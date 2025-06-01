"use client"

import { useState } from "react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

interface TimeFieldProps {
  value?: Date
  onChange?: (date: Date) => void
}

export function TimeField({ value, onChange }: TimeFieldProps) {
  const [hour, setHour] = useState<string>(() => {
    return value ? String(value.getHours()).padStart(2, '0') : '09'
  })
  
  const [minute, setMinute] = useState<string>(() => {
    return value ? String(value.getMinutes()).padStart(2, '0') : '00'
  })

  const handleHourChange = (newHour: string) => {
    setHour(newHour)
    if (onChange) {
      const newDate = new Date(value || new Date())
      newDate.setHours(parseInt(newHour), parseInt(minute))
      onChange(newDate)
    }
  }

  const handleMinuteChange = (newMinute: string) => {
    setMinute(newMinute)
    if (onChange) {
      const newDate = new Date(value || new Date())
      newDate.setHours(parseInt(hour), parseInt(newMinute))
      onChange(newDate)
    }
  }

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
  const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'))

  return (
    <div className="flex space-x-2">
      <div className="w-24">
        <Select value={hour} onValueChange={handleHourChange}>
          <SelectTrigger>
            <SelectValue placeholder="Hour" />
          </SelectTrigger>
          <SelectContent>
            {hours.map(h => (
              <SelectItem key={h} value={h}>
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <span className="flex items-center">:</span>
      <div className="w-24">
        <Select value={minute} onValueChange={handleMinuteChange}>
          <SelectTrigger>
            <SelectValue placeholder="Minute" />
          </SelectTrigger>
          <SelectContent>
            {minutes.map(m => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
} 