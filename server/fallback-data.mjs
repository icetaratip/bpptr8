export const VISION_URL = '/site/vision'
export const ORGANIZATION_URL = 'http://bpptr8.go.th/index.php/2013-10-08-14-58-24'
export const FORMER_COMMANDERS_URL = 'http://bpptr8.go.th/index.php/example-pages'

export const fallbackNews = [
  {
    title: 'กิจกรรมปฐมนิเทศหลักสูตรนักเรียนนายสิบตำรวจ',
    date: '08-07-2569',
    url: 'http://bpptr8.go.th/index.php/87-2562/401-2026-07-13-07-04-28',
    thumb: '/images/slides/slide-1.jpg',
    excerpt: 'ข่าวประชาสัมพันธ์จากกองกำกับการ 8 กองบังคับการฝึกพิเศษ',
  },
]

export const fallbackVision = {
  title: 'ปรัชญา ปณิธาน วิสัยทัศน์',
  date: '',
  content: 'เป็นหน่วยผลิตและฝึกให้เป็นตำรวจมืออาชีพ ได้มาตรฐานสากล',
  images: [],
  url: VISION_URL,
  vision: {
    vision: 'เป็นหน่วยผลิตและฝึกให้เป็นตำรวจมืออาชีพ ได้มาตรฐานสากล',
    philosophy: 'ฝึกดี สามัคคีเด่น เน้นการพัฒนา สร้างศรัทธาต่อชุมชน ดำรงตนในความพอเพียง',
    pledge: 'มุ่งมั่น ตั้งใจ สู่การพัฒนาที่ยั่งยืน',
    identity: 'การช่วยเหลือผู้ประสบภัย',
    uniqueness: 'ความเชี่ยวชาญการช่วยเหลือผู้ประสบภัย',
    definition:
      'ความชำนาญในการเข้าทำการช่วยเหลือประชาชนผู้ได้รับผลกระทบจากภัยธรรมชาติอย่างมีประสิทธิภาพ',
    missions: [
      'บริหารจัดการด้านการฝึกให้สอดคล้องกับภารกิจและคุณลักษณะของหน่วย',
      'พัฒนาคุณภาพสถานที่ฝึก ครูฝึก หลักสูตร และเครื่องช่วยฝึกอย่างต่อเนื่อง',
      'สนับสนุนการแก้ปัญหาความเดือดร้อนของประชาชนและรักษาความสงบเรียบร้อยในพื้นที่',
    ],
    goals: [
      {
        title: 'ด้านประสิทธิผลตามพันธกิจ',
        items: [
          'ประชาชนมีคุณภาพชีวิตที่ดี',
          'หน่วยงานที่เกี่ยวข้องไว้วางใจตำรวจตระเวนชายแดน',
        ],
      },
      {
        title: 'ด้านคุณภาพการให้บริการ',
        items: [
          'ประชาชนและหน่วยงานที่เกี่ยวข้องมีความพึงพอใจ',
          'การปฏิบัติภารกิจมีคุณภาพสูง',
        ],
      },
    ],
  },
}

export const fallbackOrganization = {
  title: 'โครงสร้างผู้บังคับบัญชา',
  date: '',
  content: '',
  images: [
    '/images/director.png',
    '/images/organization/deputy-pitak.jpg',
    '/images/organization/deputy-duangduen.jpg',
  ],
  url: ORGANIZATION_URL,
  organization: [
    {
      src: '/images/director.png',
      alt: 'ผู้บังคับบัญชา',
      name: 'ผู้บังคับบัญชา',
      role: 'กองกำกับการ 8',
      level: 'director',
    },
    {
      src: '/images/organization/deputy-pitak.jpg',
      alt: 'รองผู้บังคับบัญชา',
      name: 'รองผู้บังคับบัญชา',
      role: 'กองกำกับการ 8',
      level: 'deputy',
    },
    {
      src: '/images/organization/deputy-duangduen.jpg',
      alt: 'รองผู้บังคับบัญชา',
      name: 'รองผู้บังคับบัญชา',
      role: 'กองกำกับการ 8',
      level: 'deputy',
    },
  ],
}

export const fallbackFormerCommanders = {
  title: 'อดีตผู้บังคับบัญชา',
  date: '',
  content: '',
  images: Array.from({ length: 17 }, (_, index) => `/images/former-commanders/${index + 1}.jpg`),
  url: FORMER_COMMANDERS_URL,
  formerCommanders: Array.from({ length: 17 }, (_, index) => ({
    src: `/images/former-commanders/${index + 1}.jpg`,
    alt: `อดีตผู้บังคับบัญชา ลำดับที่ ${index + 1}`,
    name: '',
    tenure: '',
  })),
}

export function fallbackArticleFor(url) {
  if (url === VISION_URL || url === 'site/vision') return fallbackVision
  if (url === ORGANIZATION_URL || url.includes('2013-10-08-14-58-24')) return fallbackOrganization
  if (url === FORMER_COMMANDERS_URL || url.includes('example-pages')) return fallbackFormerCommanders
  return null
}
