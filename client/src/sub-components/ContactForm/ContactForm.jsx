import "./ContactForm.scss";
import { useRef, useState } from "react";
import emailjs from "emailjs-com";
import PropTypes from "prop-types";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

const ContactForm = ({ setIsSuccess }) => {
  const form = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    // EmailJS sendForm method
    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID1,
        event.target,
        import.meta.env.VITE_EMAILJS_API_PUBLIC_KEY
      )
      .then(
        () => {
          setIsSuccess(true);
          form.current.reset(); // Reset the form fields
          console.log("SUCCESS!");

          setIsLoading(false);
          // Hide the success message after 3 seconds
          setTimeout(() => {
            setIsSuccess(false);
          }, 3000);
        },
        (error) => {
          setIsLoading(false);
          console.log("FAILED...", error.text);
        }
      );
  };

  return (
    <div className="contactForm__container">
      {isLoading && <LoadingScreen />}
      <div className="title">Contact Form</div>
      <form ref={form} onSubmit={handleSubmit}>
        <div className="email">
          <input type="text" placeholder="Name" name="from_name" required />
          <input
            type="email"
            placeholder="Email address"
            name="from_email"
            required
          />
          <input
            type="text"
            placeholder="Subject"
            name="mail_subject"
            required
          />
          <textarea
            name="message"
            cols="30"
            rows="5"
            placeholder="Message"
            required
          ></textarea>
        </div>
        <button type="submit" className="submitBtn">
          Send
        </button>
      </form>
    </div>
  );
};

ContactForm.propTypes = {
  setIsSuccess: PropTypes.func.isRequired,
};

export default ContactForm;
