"use client"

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  delay?: number
}

export default function FadeIn({ children, delay = 0 }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
    >
      {children}
    </motion.div>
  )
}