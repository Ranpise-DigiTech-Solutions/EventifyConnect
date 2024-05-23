import React, { useState, useRef } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { FaEdit } from 'react-icons/fa'; // Import the edit icon from react-icons/fa
import './UserProfileUpdate.scss';

const UserProfileUpdate = ({ isOpen, userDetails, onClose }) => {
  const [animation, setAnimation] = useState(isOpen ? 'slide-up' : '');
  const [scale, setScale] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image
  const editorRef = useRef(null);

 

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file)); // Set the selected image to display in the editor
    }
  };

  const handleSave = () => {
    if (editorRef.current) {
      // Save the cropped image
      const canvas = editorRef.current.getImage();
      // You can then handle saving the canvas data or blob here
    }
    onClose(); // Close the modal after saving
  };

  React.useEffect(() => {
    if (isOpen) {
      setAnimation('slide-up');
    } else {
      setAnimation(''); // Remove animation class on close
    }
  }, [isOpen]); // Update animation state on isOpen change

  if (!isOpen) return null; // Early return if not open

  return (
    <div className={`userProfileUpdate__container ${animation}`}>
      <div className="popup-container">
        <header className="popup-header">
          <div className="profile-image-container">
            <div className="profile-image">
              <AvatarEditor
                ref={editorRef}
                image={selectedImage || "userDetails.profileImage"} // Use selectedImage if available, else use profileImage
                width={150}
                height={170}
                border={1}
                borderRadius={125}
                scale={scale}
                rotate={0}
              />
            </div>
            
          </div>
          <label htmlFor="profileImage" className="edit-icon">
              <FaEdit />
              {/* Input for image uploading */}
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          <hr />
        </header>
        <div className="popup-content">
          {/* Form for updating user details */}
          <form>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" defaultValue={"userDetails.name"} />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" defaultValue={"userDetails.email"} />

            <label htmlFor="phone">Phone Number:</label>
            <input type="tel" id="phone" name="phone" defaultValue={"userDetails.phone"} />

            <label htmlFor="address">Address:</label>
            <textarea id="address" name="address" defaultValue={"userDetails.address"} />
          </form>
        </div>
        <div className='button'>
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="confirm-button" onClick={handleSave}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileUpdate;
