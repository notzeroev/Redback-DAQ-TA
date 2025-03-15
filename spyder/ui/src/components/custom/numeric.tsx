import { cn } from "@/lib/utils"

interface TemperatureProps {
  temp: number;
}

/**
 * Numeric component that displays the temperature value.
 * 
 * @param {number} props.temp - The temperature value to be displayed.
 * @returns {JSX.Element} The rendered Numeric component.
 */
function Numeric({ temp }: TemperatureProps) {
  // Change the color of the text based on the temperature
  const getTemperatureColor = (temp: number) => {
    if (temp > 80 || temp < 20) return "text-red-500"
    if (temp >= 75 || temp <= 25) return "text-orange-500"
    return "text-green-500"
  }

  return (
    <div className={cn(
      "text-4xl font-bold",
      getTemperatureColor(Number(temp))
    )}>
      {`${temp}°C`}
    </div>
  );
}

export default Numeric;
