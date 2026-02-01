"use client"

// This is a client-only component and should not be rendered on the server.
// It is used for development purposes to display detailed Firebase permission errors.
// In a production environment, you would likely have a more robust error handling strategy.

import { useEffect } from "react"
import { errorEmitter } from "@/firebase/error-emitter"

export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: Error) => {
      // In a real app, you might use a toast notification or a logging service.
      // For this demo, we'll throw the error to make it visible in the Next.js overlay.
      console.error("Firebase Permission Error Detected:", error);
      // NOTE: Throwing the error will trigger the Next.js error overlay in development.
      // You might want to handle this differently in production.
      throw error;
    }

    errorEmitter.on("permission-error", handleError)

    return () => {
      errorEmitter.off("permission-error", handleError)
    }
  }, [])

  return null // This component does not render anything.
}
