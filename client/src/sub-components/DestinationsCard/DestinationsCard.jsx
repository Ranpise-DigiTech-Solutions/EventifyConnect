/* eslint-disable react/prop-types */
import "./DestinationsCard.scss";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useState, useRef, useCallback } from 'react'

export default function DestinationsCard({ card }) {
  
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef(null);

  const handleMouseEnter = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 2000);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(hoverTimeoutRef.current);
    setIsHovered(false);
  }, []); 

  return (
    <div
      className="card__container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      { !isHovered || !card.video ? (
        <>
          <img src={`${card.img}`} alt="banner" className="clip"/>
          <div className="overlay"></div>
          <div className="wrapper">
            <div className="tags">
              <button className="discount">{card.discount}</button>
              {card.new && <button className="new">new</button>}
            </div>
            <div className="contents">
              <div className="stars">
                <div className="icons">
                  <span>
                    <StarIcon className="bx-icon" />
                  </span>
                  <span>
                    <StarIcon className="bx-icon" />
                  </span>
                  <span>
                    <StarIcon className="bx-icon" />
                  </span>
                  <span>
                    <StarIcon className="bx-icon" />
                  </span>
                  <span>
                    <StarIcon className="bx-icon inactive" />
                  </span>
                </div>
                <div className="reviews">{`(${card.reviews} Reviews)`}</div>
              </div>
              <div className="title">{card.title}</div>
              <div className="description">{card.description}</div>
              <div className="expiry__date">
                <div>
                  <AccessTimeIcon className="icon" />
                </div>
                <div className="deadline">{`${card.deadline}`}</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <video src={card.video} autoPlay={true} loop className="clip"></video>
      )}
    </div>
  );
}
