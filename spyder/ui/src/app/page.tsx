"use client"

import { useState, useEffect } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Thermometer, Moon, Sun } from "lucide-react"
import Numeric from "../components/custom/numeric"
import Header from "../components/custom/header"

const WS_URL = "ws://localhost:8080"

interface VehicleData {
  battery_temperature: number
  timestamp: number
}

/**
 * Page component that displays DAQ technical assessment. Contains the LiveValue component as well as page header and labels.
 * Could this be split into more components?...
 *
 * @returns {JSX.Element} The rendered page component.
 */
export default function Page(): JSX.Element {
  const [mounted, setMounted] = useState(false)
  const [temperature, setTemperature] = useState<any>(0)
  const [connectionStatus, setConnectionStatus] = useState<string>("Disconnected")
  const { lastJsonMessage, readyState }: { lastJsonMessage: VehicleData | null; readyState: ReadyState } = useWebSocket(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    },
  )

  /**
   * Effect hook to handle client-side mounting.
   */
  useEffect(() => {
    setMounted(true)
  }, [])

  /**
   * Effect hook to handle WebSocket connection state changes.
   */
  useEffect(() => {
    switch (readyState) {
      case ReadyState.OPEN:
        console.log("Connected to streaming service")

        localStorage.setItem('temperatureData', '[]')

        setConnectionStatus("Connected")
        break
      case ReadyState.CLOSED:
        console.log("Disconnected from streaming service")

        //ideally we would send session summary to server here for storage.
        
        setConnectionStatus("Disconnected")
        break
      case ReadyState.CONNECTING:
        setConnectionStatus("Connecting")
        break
      default:
        setConnectionStatus("Disconnected")
        break
    }
  }, [readyState])

  /**
   * Effect hook to handle incoming WebSocket messages.
   */
  useEffect(() => {
    console.log("Received: ", lastJsonMessage)
    if (lastJsonMessage === null) {
      return
    }
    setTemperature(lastJsonMessage.battery_temperature.toFixed(3))

    try {
      const existingData = JSON.parse(localStorage.getItem('temperatureData') || '[]')
      const newData = [...existingData, lastJsonMessage].slice(-100)
      localStorage.setItem('temperatureData', JSON.stringify(newData))

      //add localStorage for temp warnings
    } catch (e) {
      console.error('Failed to save vehicle data to localStorage', e)
    }
  }, [lastJsonMessage])

  /**
   * Sets mounted to true after initial client-side render
   */
  if (!mounted) {
    return <></>
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header connectionStatus={connectionStatus}/>
      <main className="flex-grow flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-light flex items-center gap-2">
              <Thermometer className="h-6 w-6" />
              Live Battery
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Numeric temp={temperature} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
