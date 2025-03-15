"use client"

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

interface TemperatureData {
  battery_temperature: number
  timestamp: number
}

export function TemperatureChart() {
  const [data, setData] = useState<TemperatureData[]>([])

  // load initial data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const storedData = localStorage.getItem("temperatureData")
        if (storedData) {
          const parsedData = JSON.parse(storedData) as TemperatureData[]

          // cap temperatures above 100
          const processedData = parsedData.map((item) => ({
            ...item,
            battery_temperature: Math.min(item.battery_temperature, 100),
          }))

          setData(processedData)
        }
      } catch (error) {
        console.error("Error loading temperature data:", error)
      }
    }

    // set up storage event listener to update when localStorage changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "temperatureData" && event.newValue) {
        try {
          const parsedData = JSON.parse(event.newValue) as TemperatureData[]

          const processedData = parsedData.map((item) => ({
            ...item,
            battery_temperature: Math.min(item.battery_temperature, 100),
          }))

          setData(processedData)
        } catch (error) {
          console.error("Error processing updated temperature data:", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Set up interval to check for changes in the current tab
    const intervalId = setInterval(() => {
      loadData()
    }, 100)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(intervalId)
    }
  }, [])

  // Format timestamp for display
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md p-2 shadow-sm text-sm">
          <p className="text-muted-foreground">{formatTimestamp(label)}</p>
          <p className="font-medium">{`${payload[0].value}°F`}</p>
        </div>
      )
    }
    return null
  }

  // If no data, show a message
  if (data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-muted-foreground">No temperature data available</p>
      </div>
    )
  }


  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
        <XAxis
          dataKey="timestamp"
          tickFormatter={formatTimestamp}
          tick={{ fontSize: 12 }}
          tickMargin={10}
          minTickGap={30}
        />
        <YAxis domain={[0, 100]} tickCount={6} tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />

        {/* Reference line at 80°C - upper threshold */}
        <ReferenceLine
          y={80}
          stroke="hsl(var(--warning, 38 92% 50%))"
          strokeDasharray="3 3"
          strokeWidth={2}
          opacity={0.6}
          label={{
            value: "80°C",
            position: "right",
            fill: "hsl(var(--warning, 38 92% 50%))",
            fontSize: 12,
          }}
        />

        {/* Reference line at 20°C - lower threshold */}
        <ReferenceLine
          y={20}
          stroke="hsl(var(--info, 217 91% 60%))"
          strokeDasharray="3 3"
          strokeWidth={2}
          opacity={0.6}
          label={{
            value: "20°C",
            position: "right",
            fill: "hsl(var(--info, 217 91% 60%))",
            fontSize: 12,
          }}
        />

        <Line
          type="monotone"
          dataKey="battery_temperature"
          stroke="hsl(var(--primary, 221.2 83.2% 53.3%))"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}