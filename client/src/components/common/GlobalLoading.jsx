import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"

import { CircularProgress } from "@mui/material"

const GlobalLoading = () => {
  const { globalLoading } = useSelector((state) => state.globalLoading)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (globalLoading) {
      setIsLoading(true)
    } else {
      setTimeout(() => {
        setIsLoading(false)
      }, 2000) // Increased delay for content loading
    }
  }, [globalLoading])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, exit: { duration: 1 } }} // Lazy fade out
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#000000",
            zIndex: 99,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none"
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            <CircularProgress 
              size={60} 
              thickness={4}
              sx={{ 
                color: "#E50914",
                "& .MuiCircularProgress-circle": {
                  strokeLinecap: "round"
                }
              }} 
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GlobalLoading