import { scrapeNewsFeed, scrapeNewsList } from '../server/scraper.mjs'

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
    const limit = Math.min(Number(req.query.limit) || 6, 12)
    const details = String(req.query.details ?? '1') !== '0'
    const data = details
      ? await scrapeNewsFeed({ limit, details: true })
      : await scrapeNewsList(limit)

    res.status(200).json({
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
}
