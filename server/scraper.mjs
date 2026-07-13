import * as cheerio from 'cheerio'

const BASE = 'http://bpptr8.go.th'
const VISION_URL = '/site/vision'

function absUrl(src) {
  if (!src) return ''
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  if (src.startsWith('//')) return `http:${src}`
  return `${BASE}${src.startsWith('/') ? '' : '/'}${src}`
}

function cleanText(value) {
  return (value || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/…/g, '...')
    .trim()
}

function textLines($, root) {
  const lines = []
  $(root)
    .find('p, strong, span')
    .each((_, el) => {
      const text = cleanText($(el).text())
      if (text && !lines.includes(text)) lines.push(text)
    })
  if (lines.length) return lines
  const text = cleanText($(root).text())
  return text ? [text] : []
}

function makeVisionArticle() {
  return {
    title: 'ปรัชญา ปณิธาน วิสัยทัศน์',
    date: '',
    content:
      'วิสัยทัศน์ กก.8 บก.กฝ.บช.ตชด.\n\nเป็นหน่วยผลิตและฝึกให้เป็นตำรวจมืออาชีพ ได้มาตรฐานสากล',
    images: [],
    url: VISION_URL,
    vision: {
      vision: 'เป็นหน่วยผลิตและฝึกให้เป็นตำรวจมืออาชีพ ได้มาตรฐานสากล',
      philosophy: 'ฝึกดี สามัคคีเด่น เน้นการพัฒนา สร้างศรัทธาต่อชุมชน ดำรงตนในความพอเพียง',
      pledge: 'มุ่งมั่น ตั้งใจ สู่การพัฒนา ที่ยั่งยืน',
      identity: 'การช่วยเหลือผู้ประสพภัย',
      uniqueness: '"ความเชี่ยวชาญการช่วยเหลือผู้ประสบภัย"',
      definition:
        '"ความชำนาญในการเข้าทำการช่วยเหลือประชาชนผู้ได้รับผลกระทบจากภัยธรรมชาติ ทั้งอุทกภัย วาตภัย อัคคีภัย และภัยแล้ง ให้มีความปลอดภัยในชีวิตและทรัพย์สินได้อย่างมีประสิทธิภาพ"',
      missions: [
        'บริหารจัดการด้านการฝึกให้ตำรวจตระเวนชายแดน ทั้งระดับหน่วยและบุคคล อย่างเหมาะสมสอดคล้องกับภารกิจ คุณลักษณะของหน่วย และการเปลี่ยนแปลงของสถานการณ์ที่เกี่ยวข้องตลอดจนจัดการฝึกให้แก่ตำรวจหน่วยอื่น สนับสนุนการฝึกประชาชนและเยาวชน',
        'พัฒนาการฝึกให้มีประสิทธิภาพด้วยการพัฒนาคุณภาพสถานที่ฝึก ครูฝึก หลักสูตรการฝึกเครื่องช่วยฝึก และสิ่งอำนวยความสะดวกในการฝึกอย่างต่อเนื่อง สมำเสมอ',
        'ดำเนินงานตามโครงการอันเนื่องมาจากพระราชดาริอย่างต่อเนื่อง พัฒนาปรับปรุงระบบงานการประสานงาน และวิธีการในการปฏิบัติเพื่อสนองแนวพระราชดำริอย่างมีประสิทธิภาพรวมทั้ง ดำเนินงานในโครงการอื่น ๆ ที่ได้รับมอบหมาย',
        'สนับสนุนการแก้ปัญหาความเดือดร้อนของประชาชน และรักษาความสงบเรียบร้อยในพื้นที่ ที่ตั้งหน่วย และพื้นที่ฝึกหรือพื้นที่อื่น ตามที่ได้รับมอบหมาย',
        'ดำเนินการให้ข้าราชการตารวจและครอบครัวในหน่วยฝึก เป็นชุมชนที่ใช้ชีวิต ความเป็นอยู่ร่วมกันอย่างสงบสุขมีความรัก ความสามัคคีช่วยเหลือเกื้อกูลซึ่งกันและกัน พึ่งตนเองได้ สามารถดำเนินวิถีชีวิตตามอุดมการณ์ของตารวจตระเวนชายแดน ได้อย่างเป็นรูปธรรม',
        'พัฒนาหน่วยและระบบการบริหารจัดการที่ดี',
      ],
      goals: [
        {
          title: 'ก. ด้านประสิทธิผลตามพันธกิจ',
          items: [
            'ชุมชนชายแดนสันติสุข มั่นคงปลอดภัยและผลประโยชน์ชองชาติตามในอาณาบริเวณชายแดนได้รับการดูแลและรักษาให้คงสภาพอยู่ต่อไปอย่างยั่งยืน',
            'ประชาชนมีคุณภาพชีวิตที่ดี',
            'ประชาชนมีส่วนร่วมในการเสริมสร้างความมั่นคงในพื้นที่ชายแดนและสามารถพึ่งพาตนเองได้',
            'ตำรวจตระเวนชายแดนมีความเชี่ยวชาญในการปฏิบัติงานในพื้นที่ชายแดนและพื้นที่ที่มีปัญหาความมั่นคงอย่างมืออาชีพ',
            'สำนักงานตำรวจแห่งชาติและหน่วยที่เกี่ยวข้องไว้วางใจตำรวจตระเวนชายแดน',
          ],
        },
        {
          title: 'ข. ด้านคุณภาพการให้บริการ',
          items: [
            'ความพึงพอใจ ของประชาชนในพื้นที่ชายแดนและพื้นที่ที่มีปัญหาความมั่นคง',
            'ความพึงพอใจของประชาชนและหน่วยงานที่เกี่ยวข้อง',
            'คุณภาพในการปฏิบัติภารกิจมีคุณภาพสูง',
            'ประชาชนตามแนวชายแดนและพื้นที่ที่มีปัญหาด้านความมั่นคงเชื่อมั่นตำรวจตระเวนชายแดน',
          ],
        },
        {
          title: 'ค. ด้านประสิทธิภาพของการปฏิบัติราชการ',
          items: [
            'ความพร้อมในการปฏิบัติภารกิจและการได้รับข่าวสารจากแหล่งข่าว',
            'กระบวนงาน ขั้นตอนและวิธีการพัฒนาช่วยเหลือประชาชนสั้น ชัดเจน',
            'การให้บริการเป็นไปตามขั้นตอนและเวลาที่กาหนดในแต่ละมาตรฐานงานบริการ',
            'ระบบบริหารงานมีประสิทธิภาพ',
          ],
        },
        {
          title: 'ง. ด้านการพัฒนาองค์กร',
          items: [
            'เทคโนโลยีทันสมัยและเสริมศักยภาพในการปฏิบัติภารกิจ',
            'ตำรวจตระเวนชายแดนมีขีดความสามารถตามคุณลักษณะ ๓ประการ(ทหาร ตารวจ พลเรือนในการปฏิบัติภารกิจได้หลายรูปแบบ',
            'ตำรวจตระเวนชายแดนมีขีดความสามารถเฉพาะทางในการปฏิบัติงานกิจการ พลเรือน',
            'มีอาวุธยุทโธปกรณ์ที่มีมาตรฐาน ทันสมัย และเพียงพอต่อการปฏิบัติงาน',
            'บุคลากรมีสมรรถนะและขวัญกาลังใจในการปฏิบัติงาน',
            'มีกฎระเบียบและกฎหมายที่ทันสมัย',
            'มีสิ่งอำนวยความสะดวกในการปฏิบัติงานอย่างเพียงพอ',
          ],
        },
      ],
    },
  }
}

function extractFormerCommanders($) {
  const commanders = []
  $('table td').each((_, td) => {
    const img = $(td).find('img').first()
    const src = img.attr('src')
    if (!src) return
    const lines = textLines($, td).filter((line) => !line.includes('รายละเอียด'))
    const index = commanders.length + 1
    commanders.push({
      src: absUrl(src),
      alt: cleanText(img.attr('alt') || img.attr('title') || lines[0] || `อดีตผู้บังคับบัญชา ลำดับที่ ${index}`),
      name: lines[0] || '',
      tenure: lines[1] || '',
    })
  })
  return commanders
}

function extractOrganization($) {
  const rows = $('table tr')
  const people = []

  const directorImage = rows.eq(0).find('td').eq(1).find('img').first()
  const directorText = textLines($, rows.eq(1).find('td').eq(1))
  if (directorImage.length) {
    people.push({
      src: absUrl(directorImage.attr('src')),
      alt: directorText[0] || 'ผู้บังคับบัญชา',
      name: directorText[0] || '',
      role: directorText[1] || '',
      level: 'director',
    })
  }

  const deputyImageRow = rows.eq(2).find('td')
  const deputyTextRow = rows.eq(3).find('td')
  ;[0, 2].forEach((cellIndex) => {
    const img = deputyImageRow.eq(cellIndex).find('img').first()
    if (!img.length) return
    const lines = textLines($, deputyTextRow.eq(cellIndex))
    people.push({
      src: absUrl(img.attr('src')),
      alt: lines[0] || 'รองผู้บังคับบัญชา',
      name: lines[0] || '',
      role: lines[1] || '',
      level: 'deputy',
    })
  })

  return people
}

export async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'bpptr8-landing/1.0 (+local news scraper)',
      Accept: 'text/html,application/xhtml+xml',
    },
  })
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`)
  return await res.text()
}

/** List latest news from homepage modules */
export async function scrapeNewsList(limit = 8) {
  const html = await fetchHtml(`${BASE}/`)
  const $ = cheerio.load(html)
  const news = []

  $('div.nspArt').each((_, el) => {
    const root = $(el)
    const a = root.find('h4 a').first()
    if (!a.length) return

    const href = a.attr('href') || ''
    const title = cleanText(a.attr('title') || a.text())
    const info = cleanText(root.find('p.nspInfo').first().text())
    const dateMatch = info.match(/(\d{2}-\d{2}-\d{4})/)
    const thumb = root.find('img.nspImage').attr('src') || root.find('a.nspImageWrapper img').attr('src') || ''
    const excerpt = cleanText(root.find('p.nspText').first().text())

    news.push({
      title,
      date: dateMatch ? dateMatch[1] : '',
      url: absUrl(href),
      thumb: absUrl(thumb),
      excerpt,
    })
  })

  // de-dupe by url
  const seen = new Set()
  return news
    .filter((item) => {
      if (!item.title || !item.url || seen.has(item.url)) return false
      seen.add(item.url)
      return true
    })
    .slice(0, limit)
}

/** Article detail: title, content, images, date */
export async function scrapeArticle(articleUrl) {
  const url = absUrl(articleUrl)
  if (articleUrl === VISION_URL || articleUrl === 'site/vision') return makeVisionArticle()

  const html = await fetchHtml(url)
  const $ = cheerio.load(html)
  const page = $('div.item-page').first()

  const title = cleanText(
    page.find('h2').first().text() ||
      $('h1, h2').first().text() ||
      $('title').text(),
  )

  const contentParts = []
  page.find("div[dir='auto']").each((_, el) => {
    const text = cleanText($(el).text())
    if (text) contentParts.push(text)
  })
  if (contentParts.length === 0) {
    page.find('p').each((_, el) => {
      const text = cleanText($(el).text())
      if (text && text.length > 20) contentParts.push(text)
    })
  }

  const images = []
  page.find('img').each((_, el) => {
    const src = $(el).attr('src')
    if (!src) return
    if (
      src.includes('gravatar') ||
      src.includes('avatar') ||
      src.includes('/images/th/') ||
      src.includes('nfd.png')
    ) {
      return
    }
    const full = absUrl(src)
    if (!images.includes(full)) images.push(full)
  })

  const joined = contentParts.join('\n')
  const dateMatch =
    joined.match(/วันที่\s*([^\n]{4,40})/) ||
    cleanText(page.text()).match(/(\d{1,2}-\d{1,2}-\d{4})/)

  const article = {
    title,
    date: dateMatch ? cleanText(dateMatch[1]) : '',
    content: contentParts.join('\n\n'),
    images,
    url,
  }

  if (url.includes('/index.php/example-pages')) {
    article.formerCommanders = extractFormerCommanders($)
  }

  if (url.includes('/index.php/2013-10-08-14-58-24')) {
    article.organization = extractOrganization($)
  }

  return article
}

/** List + optional detail enrichment for first N items */
export async function scrapeNewsFeed({ limit = 6, details = true } = {}) {
  const list = await scrapeNewsList(limit)
  if (!details) return list

  const enriched = []
  for (const item of list) {
    try {
      const detail = await scrapeArticle(item.url)
      enriched.push({
        ...item,
        title: detail.title || item.title,
        date: item.date || detail.date,
        content: detail.content,
        images: detail.images.length ? detail.images : item.thumb ? [item.thumb] : [],
      })
    } catch {
      enriched.push({
        ...item,
        content: item.excerpt || '',
        images: item.thumb ? [item.thumb] : [],
      })
    }
  }
  return enriched
}
