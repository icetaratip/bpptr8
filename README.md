# ค่ายศรีนครินทรา · Landing Page

เว็บแนะนำหน่วย **กองกำกับการ 8 กองบังคับการฝึกพิเศษ**  
กก.8 บก.กฝ.บช.ตชด. · อ.ทุ่งสง จ.นครศรีธรรมราช

อ้างอิงข้อมูลจากเว็บหลัก: [bpptr8.go.th](http://bpptr8.go.th/)

## รันบนเครื่อง

```bat
start.cmd
```

หรือ:

```bat
npm install
npm run dev
```

- เว็บ: http://localhost:5174/
- News API: http://localhost:8787/api/news

## API ดึงข่าวจาก bpptr8.go.th

| Endpoint | คำอธิบาย |
|----------|----------|
| `GET /api/news?limit=6&details=0` | รายการข่าวล่าสุด (เร็ว) |
| `GET /api/news?limit=6&details=1` | รายการ + รายละเอียด/รูปจากหน้าบทความ |
| `GET /api/news/article?url=...` | ดึงบทความเดียว |

ทดสอบ scraper:

```bat
npm run scrape
```
