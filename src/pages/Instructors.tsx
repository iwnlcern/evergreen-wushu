import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import Lightbox from '../components/Lightbox'
import useLightbox from '../hooks/useLightbox'

const instructors = [
  {
    name: 'Master Zhou Chuanwang',
    image: '/assets/images/instructor-zhou.jpg',
    shortBio:
      'Over 20 years teaching Kung Fu and Tai Chi. Former instructor for the Shandong Taishan Wushu Team, internationally invited performer, and award-winning competitor.',
    fullBio:
      'Master Chuanwang Zhou has over 20 years of experience teaching Kung Fu and Tai Chi to all ages. Having been an instructor for ShanDong Taishan Wushu (Martial Arts) Team for 10 years, Master Zhou is considered one of the best of national level instructors and judges in China. In his career, Master Zhou was the champion in several large international WuShu competitions. He is especially excellent in Straight Sword and Mantis Fist style of Kung Fu. Master Chuanwang Zhou published many papers about the disciplines on training and grasping the Sword style in major magazines and newspapers. Master Chuanwang Zhou was awarded the title of top national instructor in China for many years. His students won many national and international championships in WuShu competitions.',
  },
  {
    name: 'Zheng Zhou (Andrew)',
    image: '/assets/images/instructor-andrew.jpg',
    shortBio:
      'Wushu Team Head Coach. Began training at age 5 and earned NCCAF All-Around Champion, Tiger Claw Grand Champion, and USA Wushu National Champion titles.',
    fullBio:
      "Wushu Team Head Coach. Andrew began learning Kung Fu at the age of 5. With over 15 years of dedicated wushu training, Andrew's commitment and perseverance resulted in the attainment of a 3rd Degree Black Belt. Throughout his journey, Andrew has learned invaluable experiences and discipline, which he applied to his relentless training. Additionally, he also cultivated his physical abilities such as agility and strength. Andrew's exceptional abilities earned him impressive awards such as the 2016-2017 NCCAF All-Around Champion, the 2019 Tiger Claw 14-17 Grand Champion, and a USA Wushu National Champion.",
  },
  {
    name: 'Anthony Nguyen',
    image: '/assets/images/instructor-nicholas.jpg',
    shortBio:
      'Trained in Kung Fu for 12 years, with intensive study in China including Shaolin, Tianjin, and the Shandong professional Wushu team.',
    fullBio:
      "Youth Instructor. Anthony Nguyen has trained in Kung Fu for 12 years. Though he did not start martial arts at a young age, he still had to train hard and rediscover his body's potential. Because of Kung Fu he has learned the inner works of his body and learn how to use it efficiently and effectively. He has also visited China to train in Kung Fu, going to places such as the Shaolin Temple, Tianjin and the Shandong professional wushu team. He also has achieved two gold medals at the 2016 Tiger Claw competition, and another two gold medals at the 2017 Tiger Claw competition. He specializes in Pu Dao and Fan Zi Quan.",
  },
  {
    name: 'Nicholas Sun',
    image: '/assets/images/instructor-anthony.jpg',
    shortBio:
      'Training since age five and achieved 3rd Degree Black Belt. Focused on discipline, respect, and confidence in every class.',
    fullBio:
      'Nicholas Sun has been training in Kung Fu since he was five years old, and has achieved 3rd Degree Black Belt. In addition to the Black Belt he is also the 2019 Tiger Claw IWSD 18+ All round Champion, as well as the holder of three first place medals from the 2017 James Logan High School WuShu Competition. As a student, over the years he has learned many things in Kung Fu like discipline, respect, and self confidence. Currently as a teacher, he is learning more things like patience, clarity, and how to inspire and motivate others.',
  },
]

const Instructors = () => {
  const { image, open, close } = useLightbox()

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Masters and Instructors</div>
          <h1>Meet the Evergreen Wushu Team</h1>
          <p>
            Our instructors bring decades of training, competitive experience, and a passion for
            helping every student grow.
          </p>
        </div>
      </section>

      <section>
        <div className="container card-grid">
          {instructors.map((instructor, index) => (
            <button
              type="button"
              className="profile-card profile-card-button reveal"
              style={{ '--delay': `${index * 0.05}s` } as CSSProperties}
              key={instructor.name}
              onClick={() => open(instructor.image, instructor.name, instructor.fullBio)}
              aria-label={`View ${instructor.name} bio`}
            >
              <img src={instructor.image} alt={instructor.name} />
              <h3>{instructor.name}</h3>
              <p>{instructor.shortBio}</p>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="container feature-band reveal">
          <div>
            <h2>Train with the best</h2>
            <p>Book a free trial class and see the coaching difference in person.</p>
          </div>
          <div className="feature-band-cta">
            <Link className="button" to="/#contact">
              Book Free Trial Class
            </Link>
          </div>
        </div>
      </section>
      <Lightbox image={image} onClose={close} />
    </>
  )
}

export default Instructors
