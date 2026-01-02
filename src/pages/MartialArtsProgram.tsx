import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

const beltLevels = [
  {
    level: 1,
    color: 'white',
    colorLabel: 'White',
    name: 'White',
    definition: 'Pure',
    form: 'Five Motion',
  },
  {
    level: 2,
    color: 'yellow',
    colorLabel: 'Yellow',
    name: 'Yellow',
    definition: 'Confidence',
    form: 'Xiao Hong Quan',
  },
  {
    level: 3,
    color: 'yellow-black',
    colorLabel: 'Yellow/Black',
    name: 'Yellow Black',
    definition: 'Interim',
    form: 'Shaolin Staff',
  },
  {
    level: 4,
    color: 'green',
    colorLabel: 'Green',
    name: 'Green',
    definition: 'Growth',
    form: 'Shaolin Broadsword',
  },
  {
    level: 5,
    color: 'green-black',
    colorLabel: 'Green/Black',
    name: 'Green Black',
    definition: 'Interim',
    form: 'South Fist',
  },
  {
    level: 6,
    color: 'purple',
    colorLabel: 'Purple',
    name: 'Purple',
    definition: 'Mature',
    form: 'Shaolin Straight Sword',
  },
  {
    level: 7,
    color: 'purple-black',
    colorLabel: 'Purple/Black',
    name: 'Purple Black',
    definition: 'Interim',
    form: 'Shaolin Spear',
  },
  {
    level: 8,
    color: 'blue',
    colorLabel: 'Blue',
    name: 'Blue',
    definition: 'Depth',
    form: 'Mantis Fist',
  },
  {
    level: 9,
    color: 'blue-black',
    colorLabel: 'Blue/Black',
    name: 'Blue Black',
    definition: 'Interim',
    form: 'Nunchuck',
  },
  {
    level: 10,
    color: 'brown',
    colorLabel: 'Brown',
    name: 'Brown',
    definition: 'Transition',
    form: 'Three Section Staff',
  },
  {
    level: 11,
    color: 'brown-black',
    colorLabel: 'Brown/Black',
    name: 'Brown Black',
    definition: 'Interim',
    form: 'Nine Section Whip',
  },
  {
    level: 12,
    color: 'orange',
    colorLabel: 'Orange',
    name: 'Orange',
    definition: 'Wisdom',
    form: 'Fan Zi Quan',
  },
  {
    level: 13,
    color: 'orange-black',
    colorLabel: 'Orange/Black',
    name: 'Orange Black',
    definition: 'Interim',
    form: 'Double Broadsword',
  },
  {
    level: 14,
    color: 'red',
    colorLabel: 'Red',
    name: 'Red',
    definition: 'Passionate',
    form: 'Pu Dao',
  },
  {
    level: 15,
    color: 'red-black',
    colorLabel: 'Red/Black',
    name: 'Red Black',
    definition: 'Interim',
    form: 'Sparring Set',
  },
  {
    level: 16,
    color: 'black',
    colorLabel: 'Black',
    name: 'Black',
    definition: 'Perfection',
    form: 'Long Fist / Staff / Broadsword',
  },
]

const MartialArtsProgram = () => {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Martial Arts Program</div>
          <h1>White Belt to Black Belt</h1>
          <p>
            Our tutorial is divided into two stages. The first stage is the main tutorial from
            White to Black Belt.
          </p>
        </div>
      </section>

      <section>
        <div className="container program-detail">
          <div className="info-card reveal">
            <h2 className="section-title">Stage One: White to Black Belt</h2>
            <p>
              In each level a new form is learned, with its own methods, techniques and philosophy.
            </p>
            <p>
              This precise, thorough learning provides a comprehensive understanding and profound
              awareness of the traditional Chinese martial arts.
            </p>
            <div className="cta">
              <Link className="button" to="/schedule">
                View class schedule
              </Link>
              <Link className="button ghost" to="/classes">
                Explore classes
              </Link>
            </div>
          </div>
          <div className="table-wrap reveal" style={{ '--delay': '0.05s' } as CSSProperties}>
            <table className="program-table">
              <caption>White Belt to Black Belt curriculum</caption>
              <thead>
                <tr>
                  <th scope="col">Level</th>
                  <th scope="col">Belt color</th>
                  <th scope="col">Belt name</th>
                  <th scope="col">Definition</th>
                  <th scope="col">Form</th>
                </tr>
              </thead>
              <tbody>
                {beltLevels.map((belt) => (
                  <tr key={belt.level}>
                    <td>{belt.level}</td>
                    <td>
                      <span className="belt-color">
                        <span
                          className={`belt-swatch belt-swatch--${belt.color}`}
                          aria-hidden="true"
                        />
                        <span className="belt-label">{belt.colorLabel}</span>
                      </span>
                    </td>
                    <td>{belt.name}</td>
                    <td>{belt.definition}</td>
                    <td>{belt.form}</td>
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

export default MartialArtsProgram
