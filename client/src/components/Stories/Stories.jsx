import "./Stories.scss";

import { Images } from "../../constants";
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function Stories() {
  return (
    <div className="stories__container">
        <div className="stories__wrapper">
            <h4 className="sub_title">stories</h4>
            <h2 className="title">real wedding stories</h2>
            <div className="gallery__wrapper">
                <a href="#" className="gallery_item gallery_item_1">
                    <img src={Images.wedding0} alt="Story1" />
                    <div className="content">
                        <h4 className="story_title">Nandana and Shashank</h4>
                        <p className="story_desc">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil, pariatur.</p>
                        <VisibilityIcon className="icon"/>
                    </div>
                </a>
                <a href="#" className="gallery_item gallery_item_2">
                    <img src={Images.wedding1} alt="Story2" />
                    <div className="content">
                        <h4 className="story_title">Nandana and Shashank</h4>
                        <p className="story_desc">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil, pariatur.</p>
                        <VisibilityIcon className="icon"/>
                    </div>
                </a>
                <a href="#" className="gallery_item gallery_item_3">
                    <img src={Images.wedding2} alt="Story3" />
                    <div className="content">
                        <h4 className="story_title">Nandana and Shashank</h4>
                        <p className="story_desc">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil, pariatur.</p>
                        <VisibilityIcon className="icon"/>
                    </div>
                </a>
                <a href="#" className="gallery_item gallery_item_4">
                    <img src={Images.wedding3} alt="Story4" />
                    <div className="content">
                        <h4 className="story_title">Nandana and Shashank</h4>
                        <p className="story_desc">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil, pariatur.</p>
                        <VisibilityIcon className="icon"/>
                    </div>
                </a>
                <a href="#" className="gallery_item gallery_item_5">
                    <img src={Images.wedding4} alt="Story5" />
                    <div className="content">
                        <h4 className="story_title">Nandana and Shashank</h4>
                        <p className="story_desc">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil, pariatur.</p>
                        <VisibilityIcon className="icon"/>
                    </div>
                </a>
                <a href="#" className="gallery_item gallery_item_6">
                    <img src={Images.wedding2} alt="Story6" />
                    <div className="content">
                        <h4 className="story_title">Nandana and Shashank</h4>
                        <p className="story_desc">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil, pariatur.</p>
                        <VisibilityIcon className="icon"/>
                    </div>
                </a>
            </div>
        </div>
    </div>
  );
}
