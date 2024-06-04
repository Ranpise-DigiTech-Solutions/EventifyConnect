import './BlogsCard.scss'
import PropTypes from 'prop-types'

export default function BlogsCard({ card }) {
  return (
    <div className='blogcard__container'>
      <img src={card.image} alt="" />
      <div className="contents">
        <h4 className='tag'>{`${card.date} | ${card.categorized ? 'categorized' : 'uncategorized'}`}</h4>
        <h3 className='card__title'>{card.title}</h3>
        <p className='card__description'>{card.description}</p>
      </div>
    </div>
  )
}

BlogsCard.propTypes = {
  card: PropTypes.object.isRequired
}
