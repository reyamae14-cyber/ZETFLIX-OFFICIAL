import React, { createContext, useContext, useState, useCallback } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [loadingTasks, setLoadingTasks] = useState(new Set());

  const startLoading = useCallback((taskId, message = 'Loading...') => {
    setLoadingTasks(prev => new Set([...prev, taskId]));
    setLoadingMessage(message);
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback((taskId) => {
    setLoadingTasks(prev => {
      const newTasks = new Set(prev);
      newTasks.delete(taskId);
      
      if (newTasks.size === 0) {
        // Add a small delay before hiding loading to prevent flashing
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
      
      return newTasks;
    });
  }, []);

  const setGlobalLoading = useCallback((loading, message = 'Loading...') => {
    setIsLoading(loading);
    setLoadingMessage(message);
    if (!loading) {
      setLoadingTasks(new Set());
    }
  }, []);

  const value = {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    setGlobalLoading,
    hasActiveTasks: loadingTasks.size > 0
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;