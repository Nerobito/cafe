
import { Carousel} from 'react-bootstrap'

function Home() {
  

  return (
    <div className="home container">
      <header className="hero my-5">
        <h1 className="text-center">ยินดีต้อนรับสู่คาเฟ่ของเรา</h1>
        <p className="text-center text-muted">ค้นพบการเที่ยวคาเฟ่ที่สวยงาม</p>
       
      </header>

      <section className="carousel-section mb-5">
        <Carousel data-bs-theme="dark" className="rounded overflow-hidden">
          <Carousel.Item>
            <div style={{ height: '400px', overflow: 'hidden' }}>
              <img
                className="d-block w-100 h-100"
                src="/ImageDetails/272827273_119593777262517_8084355433692576069_n.jpg"
                alt="ภายในคาเฟ่"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div style={{ height: '400px', overflow: 'hidden' }}>
              <img
                className="d-block w-100 h-100"
                src="/ImageDetails/328618747_1210958456499205_1152357062982996622_n-2.jpg"
                alt="เมล็ดกาแฟ"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div style={{ height: '400px', overflow: 'hidden' }}>
              <img
                className="d-block w-100 h-100"
                src="/ImageDetails/448353109_436688832506847_8864637754627988796_n.jpg"
                alt="ตู้โชว์ขนมอบ"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </Carousel.Item>
        </Carousel>
      </section>

      <section className="featured-items mb-5">
        <h2 className="text-center mb-4">คาเฟ่แนะนำ</h2>
        <div className="row">
          <div className="col-md-4 mb-3">
            <div style={{ height: '200px', overflow: 'hidden' }}>
              <img src="/ImageDetails/1.jpg" alt="ลาเต้" className="img-fluid rounded w-100 h-100" style={{ objectFit: 'cover' }} />
            </div>
            <h3 className="h5 mt-2">Lista</h3>
          </div>
          <div className="col-md-4 mb-3">
            <div style={{ height: '200px', overflow: 'hidden' }}>
              <img src="/ImageDetails/2.jpg" alt="ครัวซองต์" className="img-fluid rounded w-100 h-100" style={{ objectFit: 'cover' }} />
            </div>
            <h3 className="h5 mt-2">Kyoto Shi</h3>
          </div>
          <div className="col-md-4 mb-3">
            <div style={{ height: '200px', overflow: 'hidden' }}>
              <img src="/ImageDetails/3.jpg" alt="เค้ก" className="img-fluid rounded w-100 h-100" style={{ objectFit: 'cover' }} />
            </div>
            <h3 className="h5 mt-2">ChuiFong</h3>
          </div>
        </div>
      </section>
      
      <section className="about-us mb-5">
        <h2 className="text-center mb-3">เกี่ยวกับเรา</h2>
        <p className="text-center">เราหลงใหลในการเที่ยวคาเฟ่ และ บรรยากาศที่เป็นธรรมชาติ</p>
      </section>

      <section className="contact-us mb-5">
        <h2 className="text-center mb-3">ติดต่อเรา</h2>
        <p className="text-center">
          โทร: 012-345-6789<br />
          อีเมล: info@cafewebsite.com<br />
          ที่อยู่: 123 ถนนกาแฟ, เมืองคาเฟ่, 10000
        </p>
      </section>
    </div>
  )
}

export default Home