import React from "react";
import { motion } from 'framer-motion'

const MotionWrap = (Component, classname) => function HOC() {
    return(
        <motion.div
            whileInView={{y:[100, 50, 0],opacity: [0,0,1]}}
            transition={{duration: 0.5}}
            className={`${classname}`} //app__flex
        >   
            <Component/>
        </motion.div>
    )
}

export default MotionWrap;

