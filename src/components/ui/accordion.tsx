"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Minus, Plus } from 'lucide-react';

interface AccordionProps {
  items: {
    question: string;
    answer: string;
  }[];
  locale: string;
  columns?: 1 | 2;
}

const Accordion: React.FC<AccordionProps> = ({ items, locale, columns = 1 }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`grid grid-cols-1 ${columns === 2 ? 'md:grid-cols-2' : ''} gap-4 md:max-w-[65%]`}>
      {items.map((item, idx) => (
        <div 
          key={idx}
          className="border-b-[1px] border-[#cecece] md:max-w-[80vw] py-2"
        >
          <button
            className={` cursor-pointer  w-full py-[2vw] md:py-[1.5vw] flex justify-between items-center text-left transition-colors duration-300 ${
              openIndex === idx ? '' : ''
            }`}
            onClick={() => toggleAccordion(idx)}
            aria-expanded={openIndex === idx}
          >
            <h3 className="text-[5vw] md:text-[1.6vw] font-[400] leading-[130%] pr-4  cursor-pointer ">
              {item.question}
            </h3>
            <motion.div
              animate={{ rotate: openIndex === idx ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 ml-4"
            >
              {openIndex === idx ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </motion.div>
          </button>
          
          <AnimatePresence>
            {openIndex === idx && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="py-[1vw]">
                  <p className="text-[5vw] md:text-[1.4vw] leading-[150%]">
                    {item.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default Accordion; 