const ALLOWED_HOST = 'bpptr8.go.th'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const rawUrl = String(req.query.url || '')
    const imageUrl = new URL(rawUrl)

    if (imageUrl.hostname !== ALLOWED_HOST) {
      return res.status(400).json({ error: 'Unsupported image host' })
    }

    const upstream = await fetch(imageUrl.toString(), {
      headers: {
        'User-Agent': 'bpptr8-landing/1.0 (+image proxy)',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    })

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: 'Failed to fetch image' })
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream'
    if (!contentType.startsWith('image/')) {
      return res.status(415).json({ error: 'URL is not an image' })
    }

    const body = Buffer.from(await upstream.arrayBuffer())
    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400')
    res.status(200).send(body)
  } catch (err) {
    res.status(400).json({
      error: 'Invalid image URL',
      message: err instanceof Error ? err.message : String(err),
    })
  }
}
