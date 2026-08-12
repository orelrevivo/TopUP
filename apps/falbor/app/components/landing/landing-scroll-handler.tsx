"use client"

import { useEffect } from "react"

export function LandingScrollHandler() {
    useEffect(() => {
        // Show scrollbar on mount (unauthenticated landing page)
        document.body.classList.remove("overflow-hidden")

        return () => {
            // Hide scrollbar on unmount
            document.body.classList.add("overflow-hidden")
        }
    }, [])

    return null
}
