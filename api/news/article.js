import { scrapeArticle } from '../../server/scraper.mjs'
import { fallbackArticleFor } from '../../server/fallback-data.mjs'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
    return res.status(204).end()
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  res.setHeader('Access-Control-Allow-Origin', '*')

  try {
    const url = String(req.query.url || '')
    if (!url.includes('bpptr8.go.th') && !url.startsWith('/')) {
      return res.status(400).json({ error: 'url must point to bpptr8.go.th' })
    }

    const article = await scrapeArticle(url)
    res.status(200).json(article)
  } catch (err) {
    const fallback = fallbackArticleFor(String(req.query.url || ''))
    if (fallback) {
      return res.status(200).json({
        ...fallback,
        source: 'fallback',
        warning: 'Failed to scrape live article',
        message: err instanceof Error ? err.message : String(err),
      })
    }

    res.status(502).json({
      error: 'Failed to scrape article',
      message: err instanceof Error ? err.message : String(err),
    })
  }
}
