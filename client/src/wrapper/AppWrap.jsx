import { useState } from 'react';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { ChatBot } from '../components';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const AppWrap = (Component, idName, classNames) => function HOC() {
  const [showChatBot, setShowChatBot] = useState(false);
  const [isJiggling, setIsJiggling] = useState(false);

  const handleChatBotClick = () => {
    setShowChatBot(prevState => !prevState);
  };

  const handleChatClose = () => {
    setShowChatBot(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsJiggling(true);
      setTimeout(() => setIsJiggling(false), 5000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id={idName} className={`appwrap__container ${classNames}`}>
      <Component />
      <motion.div
        // animate={{ rotate: isJiggling ? [0, -10, 10, -10, 0] : 0 }}
        // transition={{ duration: 0.5 }}
      >
      <WhatsAppIcon
        className='chatbot__icon'
        onClick={handleChatBotClick}
        style={{ display: showChatBot ? 'none' : 'block' }}
      />
      {showChatBot && <ChatBot onChatClose={handleChatClose} />}
    </motion.div>
    </div>
  );
};

export default AppWrap;
