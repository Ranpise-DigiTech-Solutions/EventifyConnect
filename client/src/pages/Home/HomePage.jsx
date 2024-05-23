import './HomePage.scss'
// eslint-disable-next-line no-unused-vars
import { MotionWrap, AppWrap } from '../../wrapper'
import { NavBar, Promotion, Destinations, SearchBar, Packages, AboutUs, Stories, Blogs, Footer } from '../../components'

const HomePage = () => {

  return (
    <>
      <NavBar/>
      <Promotion />
      <Destinations />
      <SearchBar /> 
      <Packages />
      <AboutUs />
      <Stories />
      <Blogs />
      <Footer />
    </>
  )
}

// export default AppWrap(HomePage, 'app__home', 'home');
export default AppWrap(HomePage, "", "");
// export default HomePage;