import { type MouseEvent, useEffect, useState } from 'react'

const slides = [
  { src: '/images/slides/slide-1.jpg', alt: 'นโยบายผู้บัญชาการตำรวจแห่งชาติ ปี 2569' },
  { src: '/images/slides/slide-2.jpg', alt: 'นโยบายผู้บัญชาการตำรวจตระเวนชายแดน' },
  { src: '/images/slides/slide-3.jpg', alt: 'No Gift Policy' },
  { src: '/images/slides/slide-4.jpg', alt: 'ทรงพระเจริญ' },
  { src: '/images/slides/slide-5.jpg', alt: 'กองบัญชาการตำรวจตระเวนชายแดน' },
]

const VISION_URL = '/site/vision'
const ORGANIZATION_URL = 'http://bpptr8.go.th/index.php/2013-10-08-14-58-24'
const FORMER_COMMANDERS_URL = 'http://bpptr8.go.th/index.php/example-pages'
const SLIDE_MS = 5500

type NewsItem = {
  title: string
  date: string
  url: string
  thumb?: string
  excerpt?: string
  content?: string
  images?: string[]
}

type GoalGroup = {
  title: string
  items: string[]
}

type VisionContent = {
  vision: string
  philosophy: string
  pledge: string
  identity: string
  uniqueness: string
  definition: string
  missions: string[]
  goals: GoalGroup[]
}

type OrganizationPerson = {
  src: string
  alt?: string
  name: string
  role: string
  level: string
}

type FormerCommander = {
  src: string
  alt?: string
  name?: string
  tenure?: string
}

type ArticleDetail = {
  title: string
  date: string
  content: string
  images: string[]
  url: string
  vision?: VisionContent
  organization?: OrganizationPerson[]
  formerCommanders?: FormerCommander[]
}

type ImagePreview = {
  src: string
  alt: string
  caption?: string
}

type InfoStatus = 'loading' | 'live' | 'error'
type PageRoute = 'home' | 'organization' | 'former-commanders'

const fallbackNews: NewsItem[] = [
  {
    title: 'กิจกรรมปฐมนิเทศหลักสูตรนักเรียนนายสิบตำรวจ',
    date: '08-07-2569',
    url: 'http://bpptr8.go.th/index.php/87-2562/401-2026-07-13-07-04-28',
    excerpt:
      'เปิด API ด้วย start.cmd เพื่อดึงข่าวสดจากเว็บไซต์หลัก หาก API ยังไม่ทำงานจะแสดงข้อมูลสำรองชั่วคราว',
  },
]

function getPageRoute(): PageRoute {
  const path = window.location.pathname.replace(/\/+$/, '')
  if (path === '/organization') return 'organization'
  if (path === '/former-commanders') return 'former-commanders'
  return 'home'
}

async function fetchArticle(url: string) {
  const res = await fetch(`/api/news/article?url=${encodeURIComponent(url)}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return (await res.json()) as ArticleDetail
}

export default function App() {
  const [slide, setSlide] = useState(0)
  const [navOpen, setNavOpen] = useState(false)
  const [commandMenuOpen, setCommandMenuOpen] = useState(false)
  const [navShown, setNavShown] = useState(false)
  const [pageRoute, setPageRoute] = useState<PageRoute>(getPageRoute)
  const [news, setNews] = useState<NewsItem[]>(fallbackNews)
  const [newsStatus, setNewsStatus] = useState<InfoStatus>('loading')
  const [infoStatus, setInfoStatus] = useState<InfoStatus>('loading')
  const [vision, setVision] = useState<VisionContent | null>(null)
  const [organization, setOrganization] = useState<OrganizationPerson[]>([])
  const [formerCommanders, setFormerCommanders] = useState<FormerCommander[]>([])
  const [article, setArticle] = useState<ArticleDetail | null>(null)
  const [articleLoading, setArticleLoading] = useState(false)
  const [articleError, setArticleError] = useState('')
  const [imagePreview, setImagePreview] = useState<ImagePreview | null>(null)

  const isSubpage = pageRoute === 'organization' || pageRoute === 'former-commanders'
  const currentDirector = organization.find((person) => person.level === 'director') || organization[0]
  const deputies = organization.filter((person) => person !== currentDirector)
  const modalOpen = !!imagePreview || !!article || articleLoading

  useEffect(() => {
    const onPopState = () => setPageRoute(getPageRoute())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (isSubpage) window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [isSubpage, pageRoute])

  useEffect(() => {
    const onScroll = () => {
      const show = window.scrollY > Math.min(80, window.innerHeight * 0.08)
      setNavShown(show)
      if (!show && !isSubpage) setNavOpen(false)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isSubpage])

  useEffect(() => {
    const id = window.setInterval(() => {
      setSlide((s) => (s + 1) % slides.length)
    }, SLIDE_MS)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/news?limit=6&details=0')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = (await res.json()) as { items?: NewsItem[] }
        if (cancelled) return
        if (data.items?.length) {
          setNews(data.items)
          setNewsStatus('live')
        } else {
          setNewsStatus('error')
        }
      } catch {
        if (!cancelled) setNewsStatus('error')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setInfoStatus('loading')
      try {
        const [visionData, organizationData, formerData] = await Promise.all([
          fetchArticle(VISION_URL),
          fetchArticle(ORGANIZATION_URL),
          fetchArticle(FORMER_COMMANDERS_URL),
        ])
        if (cancelled) return
        setVision(visionData.vision || null)
        setOrganization(organizationData.organization || [])
        setFormerCommanders(
          formerData.formerCommanders?.length
            ? formerData.formerCommanders
            : formerData.images.map((src, index) => ({
                src,
                alt: `อดีตผู้บังคับบัญชา ลำดับที่ ${index + 1}`,
              })),
        )
        setInfoStatus('live')
      } catch {
        if (!cancelled) setInfoStatus('error')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!modalOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (imagePreview) {
        setImagePreview(null)
        return
      }
      closeArticle()
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [imagePreview, modalOpen])

  const closeNav = () => {
    setNavOpen(false)
    setCommandMenuOpen(false)
  }

  const navigateTo = (event: MouseEvent<HTMLAnchorElement>, route: PageRoute) => {
    event.preventDefault()
    const path = route === 'home' ? '/' : `/${route}`
    window.history.pushState(null, '', path)
    setPageRoute(route)
    closeNav()
    if (route === 'home') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openImage = (src: string, alt: string, caption?: string) => {
    setImagePreview({ src, alt, caption })
  }

  const closeArticle = () => {
    setArticle(null)
    setArticleError('')
    setArticleLoading(false)
  }

  const openArticle = async (item: NewsItem) => {
    setArticle(null)
    setArticleError('')
    setArticleLoading(true)
    try {
      const data = await fetchArticle(item.url)
      setArticle({
        ...data,
        title: data.title || item.title,
        date: item.date || data.date || '',
        content: data.content || item.excerpt || '',
        images: data.images?.length ? data.images : item.thumb ? [item.thumb] : [],
        url: data.url || item.url,
      })
    } catch {
      setArticleError('ดึงรายละเอียดข่าวไม่สำเร็จ')
      setArticle({
        title: item.title,
        date: item.date,
        content: item.excerpt || '',
        images: item.thumb ? [item.thumb] : [],
        url: item.url,
      })
    } finally {
      setArticleLoading(false)
    }
  }

  const renderImageButton = (
    src: string,
    alt: string,
    caption: string,
    className: string,
    loading: 'eager' | 'lazy' = 'lazy',
  ) => (
    <button type="button" className={`image-button ${className}`} onClick={() => openImage(src, alt, caption)}>
      <img src={src} alt={alt} loading={loading} />
      <span aria-hidden="true">ขยาย</span>
    </button>
  )

  const goPrev = () => setSlide((s) => (s - 1 + slides.length) % slides.length)
  const goNext = () => setSlide((s) => (s + 1) % slides.length)

  return (
    <div className="page">
      <header className={`topbar${navShown || isSubpage ? ' is-shown' : ''}`}>
        <div className="topbar__inner">
          <a className="brand" href="/" onClick={(event) => navigateTo(event, 'home')}>
            <img src="/images/logo.jpg" alt="ค่ายศรีนครินทรา กก.8 บก.กฝ.บช.ตชด." width={280} height={80} />
          </a>

          <button
            type="button"
            className="nav-toggle"
            aria-expanded={navOpen}
            aria-controls="site-nav"
            onClick={() => setNavOpen((v) => !v)}
          >
            เมนู
          </button>

          <nav id="site-nav" className={`nav${navOpen ? ' is-open' : ''}`} aria-label="เมนูหลัก">
            <a href="/#about" onClick={closeNav}>
              เกี่ยวกับหน่วย
            </a>
            <a href="/#vision" onClick={closeNav}>
              ปรัชญาและวิสัยทัศน์
            </a>
            <a href="/#director" onClick={closeNav}>
              ผู้บังคับบัญชา
            </a>
            <div className={`nav__group${commandMenuOpen ? ' is-open' : ''}`}>
              <button
                type="button"
                className="nav__group-trigger"
                aria-expanded={commandMenuOpen}
                onClick={() => setCommandMenuOpen((v) => !v)}
              >
                ทำเนียบผู้บังคับบัญชา
              </button>
              <div className="nav__menu">
                <a href="/organization" onClick={(event) => navigateTo(event, 'organization')}>
                  โครงสร้างผู้บังคับบัญชา
                </a>
                <a href="/former-commanders" onClick={(event) => navigateTo(event, 'former-commanders')}>
                  อดีตผู้บังคับบัญชา
                </a>
              </div>
            </div>
            <a href="/#news" onClick={closeNav}>
              ข่าวสาร
            </a>
            <a href="/#map" onClick={closeNav}>
              แผนที่
            </a>
            <a className="nav__cta" href="http://bpptr8.go.th/" target="_blank" rel="noreferrer">
              เว็บหลัก
            </a>
          </nav>
        </div>
      </header>

      <main id="main">
        {!isSubpage ? (
          <section className="hero" id="top" aria-label="สไลด์ประกาศ">
            <div className="hero__media">
              {slides.map((item, index) => (
                <button
                  type="button"
                  key={item.src}
                  className={`hero__image-button${index === slide ? ' is-active' : ''}`}
                  onClick={() => openImage(item.src, item.alt, item.alt)}
                  tabIndex={index === slide ? 0 : -1}
                >
                  <img src={item.src} alt={item.alt} loading={index === 0 ? 'eager' : 'lazy'} />
                </button>
              ))}
            </div>
            <div className="hero__veil" />
            <div className="hero__controls">
              <div className="hero__meta">
                <span className="hero__index">
                  {String(slide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </span>
                <p className="hero__caption">{slides[slide].alt}</p>
              </div>
              <div className="hero__nav" aria-label="ควบคุมสไลด์">
                <button type="button" className="hero__arrow" onClick={goPrev} aria-label="ก่อนหน้า">
                  ‹
                </button>
                <button type="button" className="hero__arrow" onClick={goNext} aria-label="ถัดไป">
                  ›
                </button>
              </div>
              <div className="hero__progress" aria-hidden="true">
                {slides.map((item, index) => (
                  <button
                    type="button"
                    key={item.src}
                    className={`hero__seg${index === slide ? ' is-active' : ''}${index < slide ? ' is-done' : ''}`}
                    onClick={() => setSlide(index)}
                    tabIndex={-1}
                  >
                    <span className="hero__seg-fill" style={{ animationDuration: `${SLIDE_MS}ms` }} />
                  </button>
                ))}
              </div>
            </div>
            <a className="hero__scroll" href="#about" aria-label="เลื่อนลงดูเนื้อหา">
              เลื่อนลง
            </a>
          </section>
        ) : (
          <div className="topbar-spacer" id="top" />
        )}

        {pageRoute === 'organization' ? (
          <section className="section organization subpage" id="organization">
            <div className="wrap">
              <div className="section__head organization__head">
                <div>
                  <h1>โครงสร้างผู้บังคับบัญชา</h1>
                </div>
                <a className="btn btn--outline" href="/" onClick={(event) => navigateTo(event, 'home')}>
                  กลับหน้าแรก
                </a>
              </div>
              {infoStatus === 'loading' ? <p className="status-text">กำลังดึงข้อมูลโครงสร้างจาก API...</p> : null}
              {infoStatus === 'error' ? <p className="status-text status-text--error">ดึงข้อมูลโครงสร้างจาก API ไม่สำเร็จ</p> : null}
              {organization.length ? (
                <div className="organization__tree">
                  {currentDirector ? (
                    <article className="organization__person organization__person--director">
                      <div className="organization__portrait">
                        {renderImageButton(
                          currentDirector.src,
                          currentDirector.alt || currentDirector.name,
                          `${currentDirector.name} · ${currentDirector.role}`,
                          'image-button--fill',
                        )}
                      </div>
                      <h3>{currentDirector.name}</h3>
                      <p>{currentDirector.role}</p>
                    </article>
                  ) : null}
                  <div className="organization__deputies">
                    {deputies.map((person) => (
                      <article className="organization__person" key={person.src}>
                        <div className="organization__portrait">
                          {renderImageButton(person.src, person.alt || person.name, `${person.name} · ${person.role}`, 'image-button--fill')}
                        </div>
                        <h3>{person.name}</h3>
                        <p>{person.role}</p>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {pageRoute === 'former-commanders' ? (
          <section className="section former subpage" id="former-commanders">
            <div className="wrap">
              <div className="section__head former__head">
                <div>
                  <h1>อดีตผู้บังคับบัญชา</h1>
                  <p>ทำเนียบเกียรติยศผู้บังคับบัญชา กก.8 บก.กฝ.บช.ตชด.</p>
                </div>
                <a className="btn btn--outline" href="/" onClick={(event) => navigateTo(event, 'home')}>
                  กลับหน้าแรก
                </a>
              </div>
              {infoStatus === 'loading' ? <p className="status-text">กำลังดึงข้อมูลอดีตผู้บังคับบัญชาจาก API...</p> : null}
              {infoStatus === 'error' ? <p className="status-text status-text--error">ดึงข้อมูลอดีตผู้บังคับบัญชาจาก API ไม่สำเร็จ</p> : null}
              <div className="former__grid">
                {formerCommanders.map((commander, index) => (
                  <figure className="former__person" key={`${commander.src}-${index}`}>
                    <div className="former__portrait">
                      {renderImageButton(
                        commander.src,
                        commander.alt || commander.name || `อดีตผู้บังคับบัญชา ลำดับที่ ${index + 1}`,
                        commander.name ? `${commander.name}${commander.tenure ? ` · ${commander.tenure}` : ''}` : `อดีตผู้บังคับบัญชา ลำดับที่ ${index + 1}`,
                        'image-button--contain',
                      )}
                      <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    {commander.name ? (
                      <figcaption>
                        <strong>{commander.name}</strong>
                        {commander.tenure ? <small>{commander.tenure}</small> : null}
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {pageRoute === 'home' ? (
          <>
            <section className="section about" id="about">
              <div className="wrap about__grid">
                <div>
                  <p className="eyebrow">กองกำกับการ 8 · กองบังคับการฝึกพิเศษ</p>
                  <h2>ค่ายศรีนครินทรา</h2>
                  <p className="about__lead">กก.8 บก.กฝ.บช.ตชด. · อำเภอทุ่งสง จังหวัดนครศรีธรรมราช</p>
                  <p>
                    หน่วยฝึกพิเศษภายใต้กองบัญชาการตำรวจตระเวนชายแดน มุ่งพัฒนากำลังพล
                    และการฝึกให้พร้อมปฏิบัติภารกิจด้านความมั่นคง การช่วยเหลือประชาชน และงานชุมชนสัมพันธ์
                  </p>
                  <div className="about__actions">
                    <a className="btn btn--primary" href="#news">
                      อ่านข่าวล่าสุด
                    </a>
                    <a className="btn btn--outline" href="#map">
                      ดูแผนที่หน่วย
                    </a>
                  </div>
                  <ul className="facts">
                    <li>
                      <span>หน่วย</span>
                      <strong>กองกำกับการ 8 บก.กฝ.บช.ตชด.</strong>
                    </li>
                    <li>
                      <span>ที่ตั้ง</span>
                      <strong>อ.ทุ่งสง จ.นครศรีธรรมราช</strong>
                    </li>
                    <li>
                      <span>เว็บไซต์หลัก</span>
                      <a href="http://bpptr8.go.th/" target="_blank" rel="noreferrer">
                        bpptr8.go.th
                      </a>
                    </li>
                  </ul>
                </div>
                <figure className="about__crest">
                  {renderImageButton('/images/logo.jpg', 'ตราและชื่อค่ายศรีนครินทรา', 'ค่ายศรีนครินทรา กก.8 บก.กฝ.บช.ตชด.', 'image-button--contain')}
                </figure>
              </div>
            </section>

            <section className="values" id="values">
              <div className="wrap values__panel">
                {renderImageButton('/images/values.jpg', 'ฝึกดี สามัคคีเด่น เน้นการพัฒนา', 'ฝึกดี สามัคคีเด่น เน้นการพัฒนา', 'values__art-button image-button--contain')}
                <div className="values__copy">
                  <p className="eyebrow">ค่านิยมหน่วย</p>
                  <blockquote>ฝึกดี สามัคคีเด่น เน้นการพัฒนา</blockquote>
                  <p>ยึดวินัย ความพร้อม และการพัฒนากำลังพลเป็นฐานของงานฝึก</p>
                </div>
              </div>
            </section>

            <section className="section vision" id="vision">
              <div className="wrap">
                <div className="section__head vision__head">
                  <div>
                    <h2>ปรัชญา ปณิธาน วิสัยทัศน์</h2>
                  </div>
                  <p className="news__status">
                    {infoStatus === 'loading' && 'กำลังดึงข้อมูลจาก API...'}
                    {infoStatus === 'live' && 'โหลดข้อมูลผ่าน API แล้ว'}
                    {infoStatus === 'error' && 'ดึงข้อมูลจาก API ไม่สำเร็จ'}
                  </p>
                </div>
                {vision ? (
                  <>
                    <div className="vision__statements">
                      <article className="vision__statement vision__statement--primary">
                        <span>วิสัยทัศน์</span>
                        <h3>วิสัยทัศน์ กก.8 บก.กฝ.บช.ตชด.</h3>
                        <p>{vision.vision}</p>
                      </article>
                      <article className="vision__statement">
                        <span>ปรัชญา</span>
                        <h3>ปรัชญา</h3>
                        <p>{vision.philosophy}</p>
                      </article>
                      <article className="vision__statement">
                        <span>ปณิธาน</span>
                        <h3>ปณิธาน</h3>
                        <p>{vision.pledge}</p>
                      </article>
                    </div>
                    <div className="vision__identity">
                      <div>
                        <p className="eyebrow">อัตลักษณ์</p>
                        <h3>{vision.identity}</h3>
                      </div>
                      <div>
                        <p className="eyebrow">เอกลักษณ์</p>
                        <h3>{vision.uniqueness}</h3>
                        <p>{vision.definition}</p>
                      </div>
                    </div>
                    <div className="mission">
                      <div className="mission__intro">
                        <p className="eyebrow">พันธกิจ</p>
                        <h3>6 ภารกิจหลักเพื่อพัฒนาการฝึกและรับใช้ประชาชน</h3>
                      </div>
                      <ol className="mission__list">
                        {vision.missions.map((mission) => (
                          <li key={mission}>{mission}</li>
                        ))}
                      </ol>
                    </div>
                    <div className="goals">
                      <div className="goals__head">
                        <p className="eyebrow">เป้าประสงค์</p>
                        <h3>ผลลัพธ์ที่หน่วยมุ่งสร้าง</h3>
                        <p>เลือกเปิดแต่ละด้านเพื่อดูรายละเอียด</p>
                      </div>
                      <div className="goals__groups">
                        {vision.goals.map((group, groupIndex) => (
                          <details key={group.title} open={groupIndex === 0}>
                            <summary>{group.title}</summary>
                            <ol>
                              {group.items.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ol>
                          </details>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </section>

            <section className="section director" id="director">
              <div className="wrap director__grid">
                <figure className="director__portrait">
                  {currentDirector
                    ? renderImageButton(
                        currentDirector.src,
                        currentDirector.alt || currentDirector.name,
                        `${currentDirector.name} · ${currentDirector.role}`,
                        'director__thumb',
                      )
                    : null}
                </figure>
                <div>
                  <p className="eyebrow">ผู้บังคับบัญชาหน่วย</p>
                  {currentDirector ? (
                    <>
                      <h2>{currentDirector.name}</h2>
                      <p className="director__role">{currentDirector.role}</p>
                    </>
                  ) : (
                    <h2>{infoStatus === 'loading' ? 'กำลังดึงข้อมูลผู้บังคับบัญชา...' : 'ไม่พบข้อมูลผู้บังคับบัญชา'}</h2>
                  )}
                  <p>
                    ข้อมูลผู้บังคับบัญชาดึงจากหน้าโครงสร้างผู้บังคับบัญชาผ่าน API ของโปรเจกต์
                    เพื่อให้ข้อมูลหน้าแรกและหน้าแยกใช้แหล่งเดียวกัน
                  </p>
                  <a className="text-link" href="/organization" onClick={(event) => navigateTo(event, 'organization')}>
                    ดูโครงสร้างผู้บังคับบัญชา →
                  </a>
                </div>
              </div>
            </section>

            <section className="section news" id="news">
              <div className="wrap">
                <div className="section__head">
                  <div>
                    <h2>อัปเดตล่าสุดจากหน่วย</h2>
                    <p className="news__status">
                      {newsStatus === 'loading' && 'กำลังแสดงข้อมูล...'}
                    </p>
                  </div>
                  <a className="btn btn--outline" href="http://bpptr8.go.th/" target="_blank" rel="noreferrer">
                    ดูทั้งหมดบนเว็บหลัก
                  </a>
                </div>
                <ul className="news__list">
                  {news.map((item) => (
                    <li key={item.url + item.title}>
                      <button type="button" className="news__item" onClick={() => openArticle(item)}>
                        {item.thumb ? (
                          <span className="news__thumb-wrap">
                            <img className="news__thumb" src={item.thumb} alt="" loading="lazy" />
                          </span>
                        ) : (
                          <span className="news__thumb news__thumb--empty" aria-hidden="true" />
                        )}
                        <span className="news__body">
                          <time>{item.date || '—'}</time>
                          <strong>{item.title}</strong>
                          {item.excerpt ? <em>{item.excerpt}</em> : null}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="section map" id="map">
              <div className="wrap">
                <p className="eyebrow">ที่ตั้งหน่วย</p>
                <h2>แผนที่ค่ายศรีนครินทรา</h2>
                <p className="map__lead">อ.ทุ่งสง จ.นครศรีธรรมราช</p>
                <div className="map__frame">
                  <iframe
                    title="แผนที่ค่ายศรีนครินทรา กก.8"
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d20384.609407325417!2d99.717057!3d8.163454!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3052453143d376e5%3A0x99762f6251ecea3b!2z4LiB4Lit4LiH4LiB4Liz4LiB4Lix4Lia4LiB4Liy4LijIDgg4LiB4Lit4LiH4Lia4Lix4LiH4LiE4Lix4Lia4LiB4Liy4Lij4Lid4Li24LiB4Lie4Li04LmA4Lio4Lip!5e1!3m2!1sen!2sus!4v1783956681802!5m2!1sen!2sus"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            </section>
          </>
        ) : null}
      </main>

      <footer className="footer">
        <div className="wrap footer__grid">
          <div>
            <strong>ค่ายศรีนครินทรา</strong>
            <p>กองกำกับการ 8 กองบังคับการฝึกพิเศษ กองบัญชาการตำรวจตระเวนชายแดน</p>
          </div>
          <div>
            <p>Facebook · กองกำกับการ 8</p>
            <p>TikTok · @specialtraining.8</p>
            <p>
              เว็บหลัก ·{' '}
              <a href="http://bpptr8.go.th/" target="_blank" rel="noreferrer">
                www.bpptr8.go.th
              </a>
            </p>
          </div>
        </div>
        <p className="footer__note">เว็บไซต์แนะนำหน่วย กองกำกับการ 8</p>
      </footer>

      {articleLoading || article ? (
        <div className="modal" role="dialog" aria-modal="true" aria-label={article?.title || 'รายละเอียดข่าว'} onClick={closeArticle}>
          <button type="button" className="modal__close" onClick={closeArticle} aria-label="ปิด" autoFocus>
            ×
          </button>
          <div className="modal__panel modal__panel--article" onClick={(e) => e.stopPropagation()}>
            {articleLoading && !article ? (
              <p className="article__loading">กำลังดึงรายละเอียดจาก bpptr8.go.th...</p>
            ) : article ? (
              <article className="article">
                {article.date ? <time className="article__date">{article.date}</time> : null}
                <h3 className="article__title">{article.title}</h3>
                {articleError ? <p className="article__error">{articleError}</p> : null}
                {article.content
                  ? article.content.split('\n\n').map((para, i) => (
                      <p key={i} className="article__text">
                        {para}
                      </p>
                    ))
                  : null}
                {article.images.length > 0 ? (
                  <div className="article__gallery">
                    {article.images.map((src, i) =>
                      renderImageButton(src, `${article.title} ภาพที่ ${i + 1}`, `${article.title} ภาพที่ ${i + 1}`, 'article__gallery-button', 'lazy'),
                    )}
                  </div>
                ) : null}
                <a className="btn btn--outline article__source" href={article.url} target="_blank" rel="noreferrer">
                  เปิดบนเว็บหลัก
                </a>
              </article>
            ) : null}
          </div>
        </div>
      ) : null}

      {imagePreview ? (
        <div className="modal modal--image" role="dialog" aria-modal="true" aria-label={imagePreview.alt} onClick={() => setImagePreview(null)}>
          <button type="button" className="modal__close" onClick={() => setImagePreview(null)} aria-label="ปิด" autoFocus>
            ×
          </button>
          <div className="modal__panel modal__panel--image" onClick={(e) => e.stopPropagation()}>
            <img src={imagePreview.src} alt={imagePreview.alt} />
            {imagePreview.caption ? <p className="modal__caption">{imagePreview.caption}</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
