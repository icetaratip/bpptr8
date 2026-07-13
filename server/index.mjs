import express from 'express'
import { scrapeArticle, scrapeNewsFeed, scrapeNewsList } from './scraper.mjs'

const app = express()
const PORT = Number(process.env.PORT || 8787)

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  if (_req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, source: 'http://bpptr8.go.th/' })
})

/** GET /api/news?limit=6&details=1 */
app.get('/api/news', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 6, 12)
    const details = String(req.query.details ?? '1') !== '0'
    const data = details
      ? await scrapeNewsFeed({ limit, details: true })
      : await scrapeNewsList(limit)
    res.json({
      source: 'http://bpptr8.go.th/',
      fetchedAt: new Date().toISOString(),
      count: data.length,
      items: data,
    })
  } catch (err) {
    res.status(502).json({
      error: 'Failed to scrape news',
      message: err instanceof Error ? err.message : String(err),
    })
  }
})

/** GET /api/news/article?url=... */
app.get('/api/news/article', async (req, res) => {
  try {
    const url = String(req.query.url || '')
    if (!url.includes('bpptr8.go.th') && !url.startsWith('/')) {
      return res.status(400).json({ error: 'url must point to bpptr8.go.th' })
    }
    const article = await scrapeArticle(url)
    res.json(article)
  } catch (err) {
    res.status(502).json({
      error: 'Failed to scrape article',
      message: err instanceof Error ? err.message : String(err),
    })
  }
})

app.listen(PORT, () => {
  console.log(`BPPTR8 news API http://localhost:${PORT}`)
  console.log(`  GET /api/news`)
  console.log(`  GET /api/news/article?url=...`)
})
