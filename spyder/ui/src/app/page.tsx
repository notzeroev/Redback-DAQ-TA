"use client"

import { useState, useEffect } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"
import { Thermometer, Clock, BarChart3, LineChart, CloudSun } from "lucide-react"
import Numeric from "../components/custom/numeric"
import Header from "../components/custom/header"
import { TemperatureChart } from "../components/custom/temperature-chart"
import { BentoCard } from "../components/custom/bento-card"

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
  const [tempWarnings, setTempWarnings] = useState<number>(0)
  const [badDataCounter, setBadDataCounter] = useState<number>(0)
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)
  
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
        // reset session data
        localStorage.setItem('temperatureData', '[]')
        localStorage.setItem('errorCount', '0')
        localStorage.setItem('criticalTemperatureAlerts', '0')

        setConnectionStatus("Connected")
        console.log("Connected to streaming service")
        
        // start session timer
        setElapsedTime(0)
        const interval = setInterval(() => {
          setElapsedTime(prev => prev + 1)
        }, 1000)
        setTimerInterval(interval)
        break
        
      case ReadyState.CLOSED:
        // stop session timer
        if (timerInterval) {
          clearInterval(timerInterval)
          setTimerInterval(null)
        }
        
        setConnectionStatus("Disconnected")
        console.log("Disconnected from streaming service")
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
    if (lastJsonMessage === null) {
      return
    }

    // update invalid count
    if (lastJsonMessage.battery_temperature == null) {
      const errorCount = JSON.parse(localStorage.getItem('errorCount') || '0')
      const newErrorCount = errorCount + 1
      localStorage.setItem('errorCount', JSON.stringify(newErrorCount))
      setBadDataCounter(badDataCounter + 1)
      return
    }
    
    try {
      let temperature = lastJsonMessage.battery_temperature.toFixed(3)
      setTemperature(temperature)

      // update warning temperature counts
      if(Number(temperature) < 20 || Number(temperature) > 80){
        const critTempCount = JSON.parse(localStorage.getItem('criticalTemperatureAlerts') || '0')
        const newCritTempCount = critTempCount + 1
        localStorage.setItem('criticalTemperatureAlerts', JSON.stringify(newCritTempCount))
        setTempWarnings(newCritTempCount)
      }

      // update values in localStorage for Graph
      const existingData = JSON.parse(localStorage.getItem('temperatureData') || '[]')
      const newData = [...existingData, lastJsonMessage].slice(-100)
      localStorage.setItem('temperatureData', JSON.stringify(newData))

    } catch (e) {
      console.error('Failed to save vehicle data to localStorage', e)
    }
  }, [lastJsonMessage])

  if (!mounted) {
    return <></>
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header connectionStatus={connectionStatus}/>

      <main className="flex-grow p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto max-w-7xl mx-auto">

          <BentoCard title="Session Uptime" icon={Clock} size="small">
            <div className="text-2xl font-semibold">
              {/* Wacky stopwatch implementation. I really need an extension for this. */}
              {Math.floor(elapsedTime / 3600).toString().padStart(2, '0')}:
              {Math.floor((elapsedTime % 3600) / 60).toString().padStart(2, '0')}:
              {(elapsedTime % 60).toString().padStart(2, '0')}
            </div>
          </BentoCard>

          <BentoCard title="Live Battery" icon={Thermometer} size="small">
            <Numeric temp={temperature} />
          </BentoCard>

          <BentoCard title="Temperature Monitor" icon={LineChart} size="large">
              <div className="h-[300px] w-full p-4">
                <TemperatureChart/>
              </div>
          </BentoCard>

          <BentoCard title="Ambient" icon={CloudSun} size="medium">
            {/* sample placeholder data, can be changed to anything in the future */}
            <div className="flex items-center justify-between">
              <div className="text-3xl font-semibold">32°C</div>
              <div className="text-right">
                <div>Partly Cloudy</div>
                <div className="text-muted-foreground">Humidity: 61%</div>
              </div>
            </div>
          </BentoCard>

          <BentoCard title="Session Stats" icon={BarChart3} size="medium">
            <div className="h-full flex flex-col gap-4">
              <div className="flex justify-between">
                <span>Temp. threshold crossed</span>
                <span className="font-medium">{tempWarnings}</span>
              </div>
              <div className="flex justify-between">
                <span>Invalid data recieved</span>
                <span className="font-medium">{badDataCounter}</span>
              </div>
            </div>
          </BentoCard>
        </div>
      </main>
    </div>
  )
}