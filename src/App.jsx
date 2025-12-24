import { useState, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactPlayer from 'react-player'
import './App.css'

import photo1 from './assets/collage/photo1.jpg'
import photo2 from './assets/collage/photo2.jpg'
import photo3 from './assets/collage/photo3.jpg'
import photo4 from './assets/collage/photo4.jpg'
import photo5 from './assets/collage/photo5.jpg'
import ultrasound from './assets/collage/ultrasound.jpg'

const Snow = memo(() => {
  const snowflakes = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}vw`,
    animationDuration: `${Math.random() * 5 + 10}s`,
    animationDelay: `${Math.random() * 5}s`,
    opacity: Math.random(),
    transform: `scale(${Math.random() * 0.5 + 0.5})`
  }));

  return (
    <div className="snow-container">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: flake.left,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
            opacity: flake.opacity,
            transform: flake.transform
          }}
        />
      ))}
    </div>
  )
})

const Envelope = ({ onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      // Wait for flap animation, then trigger main content
      setTimeout(() => {
        onOpen();
      }, 800);
    }
  };

  return (
    <motion.div
      className="envelope-wrapper"
      onClick={handleClick}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
    >
      <motion.div
        className="envelope"
        animate={isOpen ? { scale: [1, 1.1, 5], opacity: [1, 1, 0] } : {}}
        transition={{ duration: 1.5, times: [0, 0.5, 1], ease: "easeInOut" }}
      >
        <div className="flap-left"></div>
        <div className="flap-right"></div>
        <div className="flap-bottom"></div>

        <motion.div
          className="flap-top"
          animate={isOpen ? { rotateX: 180, zIndex: 1 } : { rotateX: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        ></motion.div>

        <motion.div
          className="wax-seal"
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
        >M</motion.div>

        <div className="envelope-message">For You, Carolyn</div>
      </motion.div>
    </motion.div>
  )
}

function App() {
  const [start, setStart] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const outerPhotos = [photo1, photo2, photo3, photo4, photo5];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate positions for a radial layout
  const getPosition = (index, total) => {
    // If mobile, disable radial offsets so CSS Flexbox handles the stack/cascade
    if (isMobile) {
      return {
        x: 0,
        y: 0,
        rotate: (Math.random() * 6 - 3) // Subtle rotation in the stack
      };
    }

    const radius = 220;
    const angleOffset = -90 * (Math.PI / 180);
    const angle = angleOffset + (index * (2 * Math.PI) / total);

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      rotate: (Math.random() * 20 - 10)
    };
  };

  return (
    <div className="app-container">
      <Snow />

      {/* Hidden Music Player */}
      <div style={{ display: 'none' }}>
        <ReactPlayer
          url='https://www.youtube.com/watch?v=k_L5r_h22lQ'
          playing={start}
          volume={1}
          loop={true}
        />
      </div>

      <AnimatePresence>
        {!start && <Envelope onOpen={() => setStart(true)} />}
      </AnimatePresence>

      {start && (
        <motion.div
          className="decorative-border"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <header>
            <motion.h1
              className="title"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              Merry Christmas, My Love
            </motion.h1>
            <motion.p
              className="subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 2 }}
            >
              Celebrating another beautiful year of us and one more to add to the joy!
            </motion.p>
          </header>

          <section className="snowflake-collage">
            {/* Outer Photos First in Source Order for "Cascade" feel, Center Last */}
            {outerPhotos.map((photo, index) => {
              const pos = getPosition(index, outerPhotos.length);
              return (
                <motion.div
                  key={index}
                  className="photo-card outer-photo"
                  style={{
                    zIndex: 10
                  }}
                  initial={{ opacity: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: 1,
                    x: pos.x,
                    y: pos.y,
                    rotate: pos.rotate
                  }}
                  transition={{
                    delay: 1.5 + (index * 0.5), // Slower, distinct "one by one" cascade
                    type: "spring",
                    stiffness: 50
                  }}
                >
                  <img src={photo} alt={`Memory ${index + 1}`} />
                </motion.div>
              )
            })}

            {/* Center Photo (Ultrasound) - Last DRAMATIC Entrance */}
            {/* On Mobile: Appears at bottom of stack. Desktop: Center via CSS/JS coords */}
            <motion.div
              className="photo-card center-photo"
              initial={{ scale: 0, opacity: 0, rotate: -360 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{
                delay: isMobile ? 1.5 + (outerPhotos.length * 0.5) + 0.5 : 5, // On mobile, show right after the last photo. Desktop: keep dramatic pause
                duration: 2,
                ease: "easeOut"
              }}
              style={{
                zIndex: 20
              }}
            >
              <img src={ultrasound} alt="Our Miracle" />
            </motion.div>
          </section>

          <motion.div
            className="message-box"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 7 }}
          >
            <p className="message-text">
              Dear Carolyn, <br /><br />
              Looking back at these moments we've shared and what's to come, I'm reminded of how lucky I am!
              I repeat this each and every year...you are my everything.<br /><br />
              I love you more than words can say.
            </p>
            <div className="signature">
              With all my love,<br />
              Mike
            </div>
          </motion.div>

        </motion.div>
      )}
    </div>
  )
}

export default App
