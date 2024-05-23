import "./Testimonials.scss"; // Import your CSS file

import PropTypes from 'prop-types'; 

function TestimonialBox({ name, username, avatarSrc, comment, stars }) {
  // Dynamically generate star icons based on the number of stars
  const starIcons = [];
  for (let i = 0; i < stars; i++) {
    starIcons.push(<i key={i} className="fas fa-star"></i>);
  }
  // If stars are less than 5, add empty stars
  if (stars < 5) {
    for (let i = stars; i < 5; i++) {
      starIcons.push(<i key={i} className="far fa-star"></i>);
    }
  }

  return (
    <div className="testimonial-box">
      <div className="box-top">
        <div className="profile">
          <div className="profile-img">
            <img src={avatarSrc} alt="Profile" />
          </div>
          <div className="name-user">
            <strong>{name}</strong>
            <span>@{username}</span>
          </div>
        </div>
        <div className="reviews">{starIcons}</div>
      </div>
      <div className="client-comment">
        <p>{comment}</p>
      </div>
    </div>
  );
}

TestimonialBox.propTypes = {
  name : PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  avatarSrc: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired,
  stars: PropTypes.number.isRequired
}

function Testimonials() {
  return (
    <section id="testimonials__container">
      <div className="testimonial-heading">
        <span>Latest Review</span>
        <h4>What Clients Say</h4>
      </div>
      <div className="testimonial-box-container">
        <TestimonialBox
          name="Liam Mendes"
          username="liammendes"
          avatarSrc="https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-512.png"
          comment="Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem, quaerat quis? Provident temporibus architecto asperiores nobis maiores nisi a. Quae doloribus ipsum aliquam tenetur voluptates incidunt blanditiis sed atque cumque."
          stars={4}
        />
        <TestimonialBox
          name="Noah Wood"
          username="noahwood"
          avatarSrc="https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-512.png"
          comment="Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem, quaerat quis? Provident temporibus architecto asperiores nobis maiores nisi a. Quae doloribus ipsum aliquam tenetur voluptates incidunt blanditiis sed atque cumque."
          stars={5}
        />
        <TestimonialBox
          name="Oliver Queen"
          username="oliverqueen"
          avatarSrc="https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-512.png"
          comment="Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem, quaerat quis? Provident temporibus architecto asperiores nobis maiores nisi a. Quae doloribus ipsum aliquam tenetur voluptates incidunt blanditiis sed atque cumque."
          stars={4}
        />
        <TestimonialBox
          name="Barry Allen"
          username="barryallen"
          avatarSrc="https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-512.png"
          comment="Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem, quaerat quis? Provident temporibus architecto asperiores nobis maiores nisi a. Quae doloribus ipsum aliquam tenetur voluptates incidunt blanditiis sed atque cumque."
          stars={4}
        />
      </div>
    </section>
  );
}

export default Testimonials;
