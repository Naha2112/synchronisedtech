"use client"

import { Suspense } from "react"
import { NewBookingForm } from "./new-booking-form"

export default function NewBookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewBookingForm />
    </Suspense>
  )
} 