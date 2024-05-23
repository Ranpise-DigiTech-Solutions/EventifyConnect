import { useEffect, useState, useRef } from "react";
import axios from 'axios'
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { format } from 'date-fns';
import { Link } from "react-router-dom";

import "./Packages.scss";
import { PackagesCard } from '../../sub-components'

export default function Packages() {

  const [data, setData] = useState([]);

  const [activeFilter, setActiveFilter] = useState("Available"); // Current Active Filter
  const [animateCard, setAnimateCard] = useState({ y: 0, opacity: 1 }); // Card Animation when clicked on TAGS
  const [filteredCards, setFilteredCards] = useState([]); // Filtering cards based on the TAGS..Ex: Most Popular, Top Rated etc..

  const wrapperRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;
  
  const searchBoxFilterStore = useSelector((state) => state.searchBoxFilter);

  const handlePageChange = (pageNumber) => {
    if (pageNumber !== currentPage) {
      if (pageNumber > 0 && pageNumber <= totalPages)
      setCurrentPage(pageNumber);
    }
  };

  function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    return merge(mergeSort(left), mergeSort(right));
  }

  function merge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex].availability === 'AVAILABLE' && right[rightIndex].availability !== 'AVAILABLE') {
            result.push(left[leftIndex]);
            leftIndex++;
        } else if (left[leftIndex].availability !== 'AVAILABLE' && right[rightIndex].availability === 'AVAILABLE') {
            result.push(right[rightIndex]);
            rightIndex++;
        } else if (left[leftIndex].availability === 'LIMITED AVAILABILITY' && right[rightIndex].availability === 'UNAVAILABLE') {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
  }

  useEffect(() => {
    const getEventId = async () => {
      try {
        if(searchBoxFilterStore.eventType) { // if user has chosen a event return its ID.. else return NULL
          const eventMasterResponse = await axios.get('http://localhost:8000/eventify_server/eventTypes/getEventId', {
            params: {
              eventName: searchBoxFilterStore.eventType
            }
          });
          return eventMasterResponse.data;
        }
        return null; // if NULL is returned ...then the event filter wont be applied in the backend
      }
     catch(error) {
        console.error('Error fetching data:', error);
        return null;
      }
    }

    const fetchData = async () => {
      const today = new Date();
      const formattedDate = format(today, "yyyy-MM-dd");
      const eventId = await getEventId();
      const selectedCityName = searchBoxFilterStore.cityName.split(',')[0].trim();
      const selectedDate = searchBoxFilterStore.bookingDate;
      try {
        const hallMasterResponse = await axios.get(`http://localhost:8000/eventify_server/hallBookingMaster/getHallsAvailabilityStatus/`, {
          params: {
            selectedCity: selectedCityName ? selectedCityName : "Mangalore",
            selectedDate: selectedDate ? selectedDate : formattedDate,
            eventId: eventId
          }
        });

        setData(hallMasterResponse.data);
        const filteredCardsBasedOnAvailability = mergeSort(hallMasterResponse.data);
        setFilteredCards(filteredCardsBasedOnAvailability);
        setTotalPages(Math.ceil(Object.values(hallMasterResponse.data).length / itemsPerPage));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchBoxFilterStore]);

  // To provide the scroll effect when the cards change
  useEffect(() => {
    if (wrapperRef.current) {
      const { top } = wrapperRef.current.getBoundingClientRect();
      // Scroll to the top of the wrapper element relative to the viewport
      window.scrollTo({ top: window.scrollY + top, behavior: 'smooth' });
    }
  }, [currentPage]);

  const handleCardFilter = (item) => { // Filtering Criteria to be passed in arguments ...Ex: Most Popular, Top Rated etc... 
    setActiveFilter(item) // Set Active Filter
    setAnimateCard({y:100, opacity:0}) //to get the shuffled animation of the cards
    if(item === "Available") {
      setFilteredCards(mergeSort(data));
     }else {
      setFilteredCards(data);
    }
    setTimeout(() => {
      setAnimateCard({y:0, opacity:1})
    }, 500);
  };
  
  const renderCards = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const slicedData = Object.values(filteredCards).slice(startIndex, endIndex);

    return slicedData.map((card, index) => (
      <div className="card" key={index} >
        <Link 
          to={{
            pathname: "/DescriptionPage",
            search: `?hallId=${card.hallId}`
          }}
          target="_blank"
        >
          <PackagesCard card={card} key={index} />
        </Link>
      </div>
    ));
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    
    if (totalPages <= 3) { // Render all page numbers if less than or equal to 3
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(
            <div
              className={`counter ${currentPage === i ? 'selected__counter' : ''}`}
              key={i}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </div>
          );
        }
      } else if (currentPage <= totalPages-2) { // if more than 3 and less than total 'totalpages - 1'
 
        pageNumbers.push(
          <div
            className="counter selected__counter"
            key={currentPage}
          >
            {currentPage}
          </div>
        );
        pageNumbers.push(
          <div
            className="counter"
            key={currentPage+1}
            onClick={() => handlePageChange(currentPage+1)}
          >
            {currentPage+1}
          </div>
        );
        pageNumbers.push(
          <div className="counter" key="ellipsis">
            ...
          </div>
        );
        pageNumbers.push(
          <div
            className={`counter ${currentPage === totalPages ? 'selected__counter' : ''}`}
            key={totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </div>
        );
      } else { // if page numbers are greater than 'totalpages - 2'
        pageNumbers.push(
          <div
            className="counter"
            key={1}
            onClick={() => handlePageChange(1)}
          >
            {1}
          </div>
        );
        pageNumbers.push(
          <div className="counter" key="ellipsis">
            ...
          </div>
        );
        pageNumbers.push(
          <div
            className={`counter ${currentPage==totalPages-1 && 'selected__counter'}`}
            key={totalPages-1}
            onClick={() => handlePageChange(totalPages-1)}
          >
            {totalPages-1}
          </div>
        );
        pageNumbers.push(
          <div
            className={`counter ${currentPage === totalPages ? 'selected__counter' : ''}`}
            key={totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </div>
        );
      }
    
    return pageNumbers;
  };
  
  return (
    <div className="packages__container" id="packages" ref={wrapperRef}>
       
      <div className="tags__wrapper">
        {["Top Rated", "Most Popular", "Most Liked", "Oldest" ,"Available"].map(
          (item, index) => (
            <div
              key={index}
              onClick={() => {handleCardFilter(item)}}
              className={`tag ${
                activeFilter === item ? "active" : ""
              }`}
            >
              {item}
            </div>
          )
        )}
      </div>
      <motion.div 
        className="packages__wrapper"
        animate={animateCard}
        transition={{ duration: 0.5, delayChildren: 0.5 }}
      >
        {renderCards()}
      </motion.div>
      <div className="packagecount__wrapper">
        <div className="counter" onClick={() => handlePageChange(1)}><a href="#packages">First</a></div>
        <div className="counter" onClick={() => handlePageChange(currentPage-1)}><a href="#packages">Previous</a></div>
        {
          renderPageNumbers()
        }
        <div className="counter" onClick={() => handlePageChange(currentPage+1)}><a href="#packages">Next</a></div>
        <div className="counter" onClick={() => handlePageChange(totalPages)}><a href="#packages">Last</a></div>
      </div>
    </div>
  );
}
