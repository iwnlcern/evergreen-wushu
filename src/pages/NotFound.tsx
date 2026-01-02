import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="eyebrow">Page not found</div>
        <h1>We could not find that page</h1>
        <p>
          Please return to the homepage or contact us if you need help finding a specific class.
        </p>
        <div className="cta" style={{ marginTop: '24px' }}>
          <Link className="button" to="/">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  )
}

export default NotFound
