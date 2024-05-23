import './Blogs.scss'
import { BlogsCard } from '../../sub-components'

const cardsArray = {
    blog1: {
        title : 'cool new baraat ideas that are LIT!',
        description : 'Why have the same old Braat that probably everyone in your wedding has already danced to, including you...',
        categorized: true,
        date: 'june 6/2019',
    },
    blog2: {
        title : 'cool new baraat ideas that are LIT!',
        description : 'Why have the same old Braat that probably everyone in your wedding has already danced to, including you...',
        categorized: true,
        date: 'june 6/2019',
    },
}

export default function Blogs() {
  return (
    <div className='main__container blogs__container'>
      <h3 className='sub__title'>blogs</h3>
      <h2 className='title'>travel articles</h2>
      <p className='description'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse possimus culpa quo explicabo repellat itaque, sequi reiciendis recusandae beatae blanditiis adipisci deserunt commodi ullam quia.</p>
      <div className="articles__wrapper">
        {Object.values(cardsArray).map((card, index) => (
          <div
            className="card"
            key={index}
          >
            <BlogsCard key={index} card={card}/>
          </div>
        ))}
      </div>
      <button>view all blogs</button>
    </div>
  )
}
