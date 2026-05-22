import { promises as fs } from 'node:fs'
import path from 'node:path'
import { DEFAULT_DATA_DIR, AGGREGATE_PERIODS } from '../../shared/constants/dashboard'
import { dashboardAggregatePointSchema, dashboardStateSchema, type AggregatePeriod, type DashboardAggregatePoint, type DashboardState } from '../../shared/schemas/dashboard'
import { getAggregateKey, withinRange } from '../domain/aggregates'
import { makeInitialState } from '../domain/state'
import { Mutex } from './mutex'

const writeMutex = new Mutex()

function resolveDataDir(): string {
  return process.env.JOBFLOW_DATA_DIR || path.join(process.cwd(), DEFAULT_DATA_DIR)
}

function currentPath() {
  return path.join(resolveDataDir(), 'current.json')
}

function aggregateDir(period: AggregatePeriod) {
  return path.join(resolveDataDir(), 'aggregates', period)
}

async function ensureDirs(): Promise<void> {
  const baseDir = resolveDataDir()
  await fs.mkdir(baseDir, { recursive: true })

  for (const period of AGGREGATE_PERIODS) {
    await fs.mkdir(path.join(baseDir, 'aggregates', period), { recursive: true })
  }
}

async function atomicWrite(filePath: string, value: unknown): Promise<void> {
  const tmpPath = `${filePath}.${process.pid}.tmp`
  await fs.writeFile(tmpPath, JSON.stringify(value, null, 2), 'utf-8')
  await fs.rename(tmpPath, filePath)
}

async function readJson<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(raw) as T
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException
    if (nodeError.code === 'ENOENT') {
      return null
    }
    throw error
  }
}

export async function readCurrentState(): Promise<DashboardState> {
  await ensureDirs()
  const raw = await readJson<DashboardState>(currentPath())
  if (!raw) {
    const initial = makeInitialState()
    await atomicWrite(currentPath(), initial)
    return initial
  }

  return dashboardStateSchema.parse(raw)
}

async function writeAggregateSnapshot(state: DashboardState): Promise<void> {
  await Promise.all(
    AGGREGATE_PERIODS.map(async (period) => {
      const key = getAggregateKey(period, state.updatedAt)
      const point: DashboardAggregatePoint = {
        period,
        key,
        updatedAt: state.updatedAt,
        counters: state.counters,
        conversions: state.conversions
      }
      const target = path.join(aggregateDir(period), `${key}.json`)
      await atomicWrite(target, point)
    })
  )
}

export async function writeCurrentState(state: DashboardState): Promise<DashboardState> {
  return writeMutex.runExclusive(async () => {
    await ensureDirs()
    const parsed = dashboardStateSchema.parse(state)
    await atomicWrite(currentPath(), parsed)
    await writeAggregateSnapshot(parsed)
    return parsed
  })
}

export async function readAggregates(period: AggregatePeriod, from: string, to: string): Promise<DashboardAggregatePoint[]> {
  await ensureDirs()
  const dir = aggregateDir(period)
  const files = await fs.readdir(dir)
  const selected = files
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace('.json', ''))
    .filter((key) => withinRange(key, from, to))
    .sort()

  const rows = await Promise.all(
    selected.map(async (key) => {
      const raw = await readJson<DashboardAggregatePoint>(path.join(dir, `${key}.json`))
      return raw ? dashboardAggregatePointSchema.parse(raw) : null
    })
  )

  return rows.filter((row): row is DashboardAggregatePoint => row !== null)
}
