import React, { useState, useEffect, ReactNode, ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

const useErrorBoundary = () => {
  const [hasError, setHasError] = useState(false);

  const resetError = () => setHasError(false);

  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    setHasError(true);
  };

  return { hasError, resetError, handleError };
};

export default useErrorBoundary;
