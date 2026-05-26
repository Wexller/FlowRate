import { afterEach, describe, expect, it } from 'vitest'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { replaceDashboardCounters } from '../../server/domain/dashboard-service'
import { generateStatsPosts } from '../../scripts/generate-stats-post'

describe('stats post generator script', () => {
  const rootDir = path.join(process.cwd(), 'data/test-stats-post')
  const dataDir = path.join(rootDir, 'jobflow')
  const outputDir = path.join(rootDir, 'publications')
  const templateDir = path.join(process.cwd(), 'content', 'publication-templates')

  afterEach(async () => {
    process.env.JOBFLOW_DATA_DIR = dataDir
    await rm(rootDir, { recursive: true, force: true })
  })

  it('generates russian and english markdown files from current state', async () => {
    process.env.JOBFLOW_DATA_DIR = dataDir
    await replaceDashboardCounters({ counters: { applications: 50, replies: 12, interviews: 6, offers: 2 } })

    const generated = await generateStatsPosts({ templateDir, outputDir })
    const ruOutput = await readFile(path.join(outputDir, 'stats-post.ru.md'), 'utf-8')
    const enOutput = await readFile(path.join(outputDir, 'stats-post.en.md'), 'utf-8')

    expect(generated).toHaveLength(2)
    expect(ruOutput).toContain('Отклики отправлены: 50')
    expect(ruOutput).toContain('Ответы: 12 (24 %)')
    expect(enOutput).toContain('Applications: 50')
    expect(enOutput).toContain('Replies: 12 (24%)')
  })

  it('creates the output directory and renders zero-rate values cleanly', async () => {
    process.env.JOBFLOW_DATA_DIR = dataDir
    await replaceDashboardCounters({ counters: { applications: 0, replies: 0, interviews: 0, offers: 0 } })

    await generateStatsPosts({ templateDir, outputDir })

    const enOutput = await readFile(path.join(outputDir, 'stats-post.en.md'), 'utf-8')
    expect(enOutput).toContain('Replies: 0 (0%)')
  })

  it('surfaces schema validation failures from invalid current data', async () => {
    process.env.JOBFLOW_DATA_DIR = dataDir
    await mkdir(dataDir, { recursive: true })
    await writeFile(
      path.join(dataDir, 'current.json'),
      JSON.stringify({
        updatedAt: '2026-05-22T09:25:32.788Z',
        counters: {
          applications: 1,
          replies: 2,
          interviews: 0,
          offers: 0
        },
        conversions: {
          replyRate: 2,
          interviewRate: 0,
          offerRate: 0
        }
      }),
      'utf-8'
    )

    await expect(generateStatsPosts({ templateDir, outputDir })).rejects.toBeTruthy()
  })
})
