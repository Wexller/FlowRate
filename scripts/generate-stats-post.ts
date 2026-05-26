import { promises as fs } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { getCurrentDashboardState } from '../server/domain/dashboard-service'
import { buildStatsPostContext, renderStatsPostTemplate, STATS_POST_LOCALES, type StatsPostLocale } from '../shared/utils/stats-post'

const DEFAULT_TEMPLATE_DIR = path.join(process.cwd(), 'content', 'publication-templates')
const DEFAULT_OUTPUT_DIR = path.join(process.cwd(), 'content', 'publications')
const TEMPLATE_FILE_NAMES: Record<StatsPostLocale, string> = {
  ru: 'stats-post.ru.md',
  en: 'stats-post.en.md'
}

export interface GenerateStatsPostsOptions {
  outputDir?: string
  templateDir?: string
}

export interface GeneratedStatsPost {
  content: string
  locale: StatsPostLocale
  outputPath: string
}

async function readTemplate(templateDir: string, locale: StatsPostLocale): Promise<string> {
  const templatePath = path.join(templateDir, TEMPLATE_FILE_NAMES[locale])
  return fs.readFile(templatePath, 'utf-8')
}

async function atomicWriteText(filePath: string, value: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  const tempPath = `${filePath}.${process.pid}.tmp`
  await fs.writeFile(tempPath, value, 'utf-8')
  await fs.rename(tempPath, filePath)
}

export async function generateStatsPosts(options: GenerateStatsPostsOptions = {}): Promise<GeneratedStatsPost[]> {
  const state = await getCurrentDashboardState()
  const templateDir = options.templateDir ?? DEFAULT_TEMPLATE_DIR
  const outputDir = options.outputDir ?? DEFAULT_OUTPUT_DIR

  const generated: GeneratedStatsPost[] = []

  for (const locale of STATS_POST_LOCALES) {
    const template = await readTemplate(templateDir, locale)
    const content = renderStatsPostTemplate(template, buildStatsPostContext(state, locale))
    const outputPath = path.join(outputDir, TEMPLATE_FILE_NAMES[locale])
    await atomicWriteText(outputPath, content)
    generated.push({ locale, content, outputPath })
  }

  return generated
}

async function runCli(): Promise<void> {
  const generated = await generateStatsPosts()
  for (const file of generated) {
    console.log(`${file.locale}: ${file.outputPath}`)
  }
}

const entryUrl = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : null

if (entryUrl === import.meta.url) {
  runCli().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
