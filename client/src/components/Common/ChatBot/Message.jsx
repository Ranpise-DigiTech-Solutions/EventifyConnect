// eslint-disable-next-line no-unused-vars
import React from 'react';

// eslint-disable-next-line react/prop-types
const userssage = ({ text, user = "assistant" }) => {
  
 
  return (
    <div style={{ marginTop: '10px'  }}>
      <div style={{ backgroundColor: user === 'user' ? 'rgb(0, 102, 255)' : 'white', color: user === 'user' ? 'white' : 'black', padding: '15px 17px', margin: '0px', width: 'fit-content', borderRadius: user === 'user' ? '15px 15px 0px 15px' : '0px 15px 15px 15px', marginRight: user === 'user' ? '20px' : 'auto', marginLeft: user === 'user' ? 'auto' : '20px',maxWidth: '70%' }}>{text}</div>
    </div>
  );
};

export default userssage;