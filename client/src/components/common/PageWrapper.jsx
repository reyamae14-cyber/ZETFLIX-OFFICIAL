import { useEffect } from "react"
import { useDispatch } from "react-redux"

import { setAppState } from "../../redux/features/appStateSlice"
import { setGlobalLoading } from "../../redux/features/globalLoadingSlice"

const PageWrapper = ({ state, children }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    // Show loading screen when navigating to a new page
    dispatch(setGlobalLoading(true))
    
    // Scroll to top
    window.scrollTo(0, 0)
    
    // Update app state
    dispatch(setAppState(state))
    
    // Hide loading screen after a longer delay to ensure content and images are ready
    const timer = setTimeout(() => {
      dispatch(setGlobalLoading(false))
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [state, dispatch])

  return (
    children
  )
}

export default PageWrapper