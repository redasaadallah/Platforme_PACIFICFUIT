import { motion } from "framer-motion";

function FadeIn({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      // animate={{}}
      // transition={{type:"spring"/tween,stiffness:200,mass:0.5,repeat:"infinity/3",repeatType:"reverse,mirror"}}
      //whileHover={{}}
      //whileTap={{}}
      //whileFocus={{}}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay }}
      viewport={{ once: true, amount: 0 }}

    >
      {children}
    </motion.div>
  );
}
//<AnimationPresence>
//exit={{}} 
//</AnimationPresence>
export default FadeIn;