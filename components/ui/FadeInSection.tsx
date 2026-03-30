'use client';

import { motion } from 'framer-motion';

export const FadeInSection = ({ children, className = "", id, delay = 0 }: { children: React.ReactNode, className?: string, id?: string, delay?: number }) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`w-full max-w-7xl mx-auto px-6 py-12 md:py-16 ${className}`}
  >
    {children}
  </motion.section>
);
