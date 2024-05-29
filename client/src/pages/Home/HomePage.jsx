/* eslint-disable react-refresh/only-export-components */
import './HomePage.scss'
// eslint-disable-next-line no-unused-vars
import { useState } from 'react';
import { AppWrap } from '../../wrapper'
import { NavBar, Promotion, Destinations, SearchBar, Packages, AboutUs, Stories, Blogs, Footer } from '../../components'
import { LoadingScreen } from "../../sub-components";

const HomePage = () => {

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      {isLoading ? (
        <div>
          <LoadingScreen />
        </div>
      ) : (
        <>
        <NavBar setIsLoading={setIsLoading}/>
        <Promotion />
        <Destinations />
        <SearchBar /> 
        <Packages />
        <AboutUs />
        <Stories />
        <Blogs />
        <Footer />
      </>
      )}
    </div>
  )
}

// export default AppWrap(HomePage, 'app__home', 'home');
export default AppWrap(HomePage, "", "");
// export default HomePage;