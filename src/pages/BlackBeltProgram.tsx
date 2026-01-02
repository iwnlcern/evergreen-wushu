import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

const blackBeltAttributes = [
  {
    focus: 'Personal behavior',
    detail: 'Self-discipline, public etiquette norms',
  },
  {
    focus: 'Leadership ability',
    detail: 'Teaching, competing, performance activities',
  },
  {
    focus: 'Theoretical knowledge',
    detail: 'Terminology, competition rules, history',
  },
  {
    focus: 'Technical skills',
    detail: 'Physical skills, routine skills, sparring skills',
  },
]

const blackBeltDegrees = [
  {
    degree: 'First degree Black Belt',
    forms: 'Long Fist',
    weapons: 'Broadsword, Staff',
    sparring: 'Punches, side kicks, roundhouse kicks',
  },
  {
    degree: 'Second degree Black Belt',
    forms: 'Straight Sword',
    weapons: 'Spear',
    sparring: 'Cross punches, roundhouse kicks, back kicks',
  },
  {
    degree: 'Third degree Black Belt',
    forms: 'Southern Staff',
    weapons: 'Southern Broadsword',
    sparring: 'Hook punches, back kicks, back sweep kicks',
  },
  {
    degree: 'Fourth degree Black Belt',
    forms: 'Non-weapon sparring',
    weapons: 'Weapon sparring',
    sparring: 'Striking, wrestling, grappling',
  },
  {
    degree: 'Fifth degree Black Belt',
    forms: 'Tai Chi Quan',
    weapons: 'Tai Chi Sword',
    sparring: 'Striking, wrestling, grappling',
  },
  {
    degree: 'Sixth degree Black Belt',
    forms: 'Xing Yi',
    weapons: 'Ba Gua',
    sparring: 'Striking, wrestling, grappling',
  },
  {
    degree: 'Seventh degree Black Belt',
    forms: 'International martial arts',
    weapons: 'Research and theory',
    sparring: 'Free sparring',
  },
  {
    degree: 'Eighth degree Black Belt',
    forms: 'Teaching and training',
    weapons: 'Research and theory',
    sparring: 'Free sparring',
  },
  {
    degree: 'Ninth degree Black Belt',
    forms: 'Performance',
    weapons: 'Research and theory',
    sparring: 'Free sparring',
  },
]

const BlackBeltProgram = () => {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Black Belt Advanced Program</div>
          <h1>First Degree to Ninth Degree Black Belt</h1>
          <p>
            Our tutorial is divided into two stages. The second stage is the master tutorial from
            First Degree Black Belt to Ninth Degree Black Belt.
          </p>
        </div>
      </section>

      <section>
        <div className="container program-detail">
          <div className="info-card reveal">
            <h2 className="section-title">Master Tutorial</h2>
            <p>
              The Black Belt is a symbol of honor, a reward for endurance and concentration, and a
              sign of deeper mastery of Wushu.
            </p>
            <p>
              These dedicated students can cultivate leadership ability, in addition to a deeper
              mastery of technical skills and theoretical knowledge.
            </p>
            <p>
              We offer classes at all levels.{' '}
              <Link className="text-link" to="/schedule">
                Check them out here.
              </Link>
            </p>
            <div className="cta">
              <Link className="button" to="/schedule">
                View class schedule
              </Link>
              <Link className="button ghost" to="/#contact">
                Contact us
              </Link>
            </div>
          </div>
          <div className="info-card reveal" style={{ '--delay': '0.05s' } as CSSProperties}>
            <h2 className="section-title">Black belt qualities</h2>
            <p>
              The advanced program develops the mindset and skills expected of black belt leadership.
            </p>
            <div className="table-wrap table-wrap--flat">
              <table className="program-table program-table--compact">
                <thead>
                  <tr>
                    <th scope="col">Focus</th>
                    <th scope="col">Areas covered</th>
                  </tr>
                </thead>
                <tbody>
                  {blackBeltAttributes.map((item) => (
                    <tr key={item.focus}>
                      <td>{item.focus}</td>
                      <td>{item.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="table-wrap reveal" style={{ '--delay': '0.1s' } as CSSProperties}>
            <table className="program-table">
              <caption>Advanced black belt curriculum</caption>
              <thead>
                <tr>
                  <th scope="col">Degree</th>
                  <th scope="col">Forms / Focus</th>
                  <th scope="col">Weapons / Tools</th>
                  <th scope="col">Sparring / Skills</th>
                </tr>
              </thead>
              <tbody>
                {blackBeltDegrees.map((item) => (
                  <tr key={item.degree}>
                    <td>{item.degree}</td>
                    <td>{item.forms}</td>
                    <td>{item.weapons}</td>
                    <td>{item.sparring}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}

export default BlackBeltProgram
