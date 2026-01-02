import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

const programs = [
  {
    title: 'Martial Arts Program',
    subtitle: 'White Belt to Black Belt',
    description:
      'The foundational path from White to Black Belt. Each level adds new forms, techniques, and philosophy to build deep understanding.',
    link: '/programs/white-to-black',
    accent: 'gold',
  },
  {
    title: 'Black Belt Advanced Program',
    subtitle: 'First Degree Black Belt to Ninth Degree Black Belt',
    description:
      'The master tutorial for dedicated students seeking deeper mastery, leadership, and advanced technical refinement.',
    link: '/programs/black-belt-advanced',
    accent: 'pine',
  },
]

const Programs = () => {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Programs</div>
          <h1>Martial Arts Pathways</h1>
          <p>
            From foundational belts to advanced mastery, Evergreen Wushu offers structured programs
            for every stage of training.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="info-grid">
            {programs.map((program, index) => (
              <article
                className={`info-card info-card--program info-card--${program.accent} reveal`}
                style={{ '--delay': `${index * 0.05}s` } as CSSProperties}
                key={program.title}
              >
                <div className="class-meta">{program.subtitle}</div>
                <h3 className="info-card-title">{program.title}</h3>
                <p>{program.description}</p>
                <Link className="button small" to={program.link}>
                  View program
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Programs
