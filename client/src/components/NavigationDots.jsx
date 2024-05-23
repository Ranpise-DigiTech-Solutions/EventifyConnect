import PropTypes from 'prop-types'

export default function NavigationDots({active, imageList, className}) {
  return (
    <div>
      <div className="app__navigation">
        {imageList.map((item,index)=>(
            <div
            href={`#`}
            key={"Image-" + index}
            className={className}
            style={active===index? {backgroundColor:`#313bac`} : {}}
            />
        ))}
      </div>
    </div>
  )
}

NavigationDots.propTypes = {
  active: PropTypes.number.isRequired,
  imageList: PropTypes.array.isRequired,
  className: PropTypes.string.isRequired
}