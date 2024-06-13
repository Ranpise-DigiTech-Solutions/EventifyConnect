import "./Stories.scss";

import { Images } from "../../../constants";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function Stories() {
  return (
    <div className="storiesComponent__container">
      <div className="stories__wrapper">
        <h4 className="sub_title">stories</h4>
        <h2 className="title">real wedding stories</h2>
        <div className="gallery__wrapper">
          <a href="#" className="gallery_item gallery_item_1">
            <img src={Images.wedding0} alt="Story1" />
            <div className="content">
              <h4 className="story_title">Rajesh and Aishwarya</h4>
              <p className="story_desc">
                We recently celebrated our wedding at Parivar hall Ullal, and it
                was an absolutely magical experience from start to finish.
              </p>
              <VisibilityIcon className="icon" />
            </div>
          </a>
          <a href="#" className="gallery_item gallery_item_2">
            <img src={Images.wedding1} alt="Story2" />
            <div className="content">
              <h4 className="story_title">Sumit and Neeta</h4>
              <p className="story_desc">
                We recently celebrated our wedding at AB shetty hall
                mangalore,the whole function finished beyond my expectation.
              </p>
              <VisibilityIcon className="icon" />
            </div>
          </a>
          <a href="#" className="gallery_item gallery_item_3">
            <img src={Images.wedding2} alt="Story3" />
            <div className="content">
              <h4 className="story_title">Rahul</h4>
              <p className="story_desc">
                I recently had the pleasure of celebrating my 30th birthday at
                the AB shetty Banquet Hall, and it was an unforgettable
                experience from start to finish.
              </p>
              <VisibilityIcon className="icon" />
            </div>
          </a>
          <a href="#" className="gallery_item gallery_item_4">
            <img src={Images.wedding3} alt="Story4" />
            <div className="content">
              <h4 className="story_title">Adithya</h4>
              <p className="story_desc">
                We recently celebrated our 25th wedding anniversary at the
                Crystal Palace Banquet Hall, and it was an evening that exceeded
                all our expectations.
              </p>
              <VisibilityIcon className="icon" />
            </div>
          </a>
          <a href="#" className="gallery_item gallery_item_5">
            <img src={Images.wedding4} alt="Story5" />
            <div className="content">
              <h4 className="story_title">Ajit and Neha</h4>
              <p className="story_desc">
                We recently celebrated our wedding at Parivar hall Ullal, We
                couldn&apos;t have asked for a better venue or team to celebrate
                such an important milestone in our lives.
              </p>
              <VisibilityIcon className="icon" />
            </div>
          </a>
          <a href="#" className="gallery_item gallery_item_6">
            <img src={Images.wedding2} alt="Story6" />
            <div className="content">
              <h4 className="story_title">Akshath and Diksha</h4>
              <p className="story_desc">
                Our wedding day at the Parivar Grandeur Banquet Hall was nothing
                short of a dream come true.
              </p>
              <VisibilityIcon className="icon" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
