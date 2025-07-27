import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  "We rise by lifting others. – Robert Ingersoll",
  "No one has ever become poor by giving. – Anne Frank",
  "The best way to find yourself is to lose yourself in the service of others. – Mahatma Gandhi",
  "Alone we can do so little; together we can do so much. – Helen Keller",
  "We can't help everyone, but everyone can help someone. – Ronald Reagan",
  "The true meaning of life is to plant trees under whose shade you do not expect to sit. – Nelson Henderson",
  "Life’s most persistent and urgent question is, ‘What are you doing for others?’ – Martin Luther King Jr.",
  "The purpose of life is not to be happy. It is to be useful. – Ralph Waldo Emerson",
  "Helping one person might not change the world, but it could change the world for one person.",
  "Kindness is the sunshine in which virtue grows. – Robert Green Ingersoll",
  "What you do makes a difference. You have to decide what kind of difference you want to make. – Jane Goodall",
  "When you help someone else, you help yourself.",
  "You don’t need a reason to help people.",
  "A single act of kindness throws out roots in all directions. – Amelia Earhart"
];

const QuoteTicker = () => {
  const [quote, setQuote] = useState(quotes[0]);
  const [overflow, setOverflow] = useState(false);
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current && containerRef.current) {
        const isOverflowing = textRef.current.scrollWidth > containerRef.current.offsetWidth;
        setOverflow(isOverflowing);
      }
    };
    checkOverflow();
    const interval = setInterval(() => {
      const nextQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(nextQuote);
      setTimeout(checkOverflow, 100); // delay check after new quote renders
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        overflow: 'hidden',
        background: '#A2AADB ',
        color: '#fff',
        padding: '14px 0',
        fontSize: '1.1rem',
        fontWeight: 600,
        fontFamily: 'Segoe UI, sans-serif',
        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      <AnimatePresence mode="wait">
        {overflow ? (
          <motion.div
            key={quote}
            ref={textRef}
            style={{ display: 'inline-block', paddingLeft: '100vw' }}
            initial={{ x: '100%' }}
            animate={{ x: '-100%' }}
            exit={{ opacity: 0 }}
            transition={{
              x: {
                duration: 30,
                repeat: Infinity,
                ease: 'linear',
              },
            }}
          >
            {quote}
          </motion.div>
        ) : (
          <motion.div
            key={quote}
            ref={textRef}
            style={{ margin: '0 auto' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {quote}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuoteTicker;
