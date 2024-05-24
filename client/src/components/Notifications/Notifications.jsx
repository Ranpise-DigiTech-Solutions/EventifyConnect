import React from 'react';
import './Notifications.scss';
import UserProfileLeftPanel from '../UserProfileLeftPanel/UserProfileLeftPanel';
import { NavBar } from '..';


class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        { title: "Profile updation successful", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. magna a neque. Donec dui urna, vehicula et sem eget, facilisis sodales sem.", time: "2024-04-11T08:00:00" },
        { title: "Checkout our new blog !", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. magna a neque. Donec dui urna, vehicula et sem eget, facilisis sodales sem.", time: "2024-04-05T15:30:00" },
        { title: "Booked a hall succsessfully", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. magna a neque. Donec dui urna, vehicula et sem eget, facilisis sodales sem.", time: "2024-03-28T15:30:00" },
        { title: "Welcome back user!", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. magna a neque. Donec dui urna, vehicula et sem eget, facilisis sodales sem.", time: "2024-03-15T09:45:00" },
        { title: "Log in successful", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. magna a neque. Donec dui urna, vehicula et sem eget, facilisis sodales sem.", time: "2024-03-15T09:45:00" }
      ],
      isMobile: window.matchMedia("(max-width: 767px)").matches,
    };

    this.handleSetActiveComponent = this.handleSetActiveComponent.bind(this);
  }

  componentDidMount() {
    // Add event listener for media query changes
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleMediaQueryChange = () => {
      this.setState({ isMobile: mediaQuery.matches });
    };
    mediaQuery.addListener(handleMediaQueryChange);

    // Cleanup the event listener on component unmount
    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }

  clearNotifications = () => {
    this.setState({ messages: [] });
  }

  handleSetActiveComponent(component) {
    // Implement your logic for setActiveComponent here
    console.log('Setting active component:', component);
  };

  render() {
    const { isMobile } = this.state;

    return (
      <>
        {isMobile && <NavBar />}
        <div className="left-panel-container">
          <UserProfileLeftPanel setActiveComponent={this.handleSetActiveComponent} />
        </div>
        <div className='notification-container'>
          <h1>Messages</h1>
          <button onClick={this.clearNotifications} className="clear-button">Clear All</button>
          {this.state.messages.map((message, index) => (
            <NotificationCard key={index} message={message} />
          ))}
        </div>
      </>
    );
  }
}

class NotificationCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: false
    };
  }

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  }

  render() {
    const { title, body, time } = this.props.message;
    return (
      <div className='notification__card'>
        <div className='message-header' onClick={this.toggleDetails}>
          <div className='title'>{title}</div>
          <div className='time'>{new Date(time).toLocaleString()}</div>
          <div className={`arrow ${this.state.showDetails ? 'down' : 'right'}`}></div>
        </div>
        {this.state.showDetails && (
          <div className='message-body'>{body}</div>
        )}
      </div>
    );
  }
}

export default Notification;
