import { useEffect, useRef } from 'react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import { Chart} from 'chart.js' // Import the Chart type from chart.js

const MainChart = () => {
  const chartRef = useRef<Chart | null>(null) // Type the ref to the Chart instance

  useEffect(() => {
    const handleColorSchemeChange = () => {
      if (chartRef.current) {
        const { options } = chartRef.current

        // Check if scales and the necessary properties exist
        if (options && options.scales) {
          const { x, y } = options.scales

          if (x && x.grid) {
            // x.grid.borderColor = getStyle('--cui-border-color-translucent') // Grid line color
            x.grid.color = getStyle('--cui-border-color-translucent') // Grid line color
          }

          if (x && x.ticks) {
            x.ticks.color = getStyle('--cui-body-color') // Tick color
          }

          if (y && y.grid) {
            // y.grid.borderColor = getStyle('--cui-border-color-translucent') // Grid line color
            y.grid.color = getStyle('--cui-border-color-translucent') // Grid line color
          }

          if (y && y.ticks) {
            y.ticks.color = getStyle('--cui-body-color') // Tick color
          }

          // Always update the chart after making changes
          chartRef.current.update()
        }
      }
    }

    // Adding the event listener for color scheme change
    document.documentElement.addEventListener('ColorSchemeChange', handleColorSchemeChange)

    // Cleanup listener on unmount
    return () => {
      document.documentElement.removeEventListener('ColorSchemeChange', handleColorSchemeChange)
    }
  }, [])

  // Modified random function to accept a min and max range
  const random = (min: number, max: number) => Math.round(Math.random() * (max - min) + min)

  return (
    <>
      <CChartLine
        ref={chartRef}
        style={{ height: '300px', marginTop: '40px' }}
        data={{
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
            {
              label: 'My First dataset',
              backgroundColor: `rgba(${getStyle('--cui-info-rgb')}, .1)`,
              borderColor: getStyle('--cui-info'),
              pointHoverBackgroundColor: getStyle('--cui-info'),
              borderWidth: 2,
              data: [
                random(50, 200),
                random(50, 200),
                random(50, 200),
                random(50, 200),
                random(50, 200),
                random(50, 200),
                random(50, 200),
              ],
              fill: true,
            },
            {
              label: 'My Second dataset',
              backgroundColor: 'transparent',
              borderColor: getStyle('--cui-success'),
              pointHoverBackgroundColor: getStyle('--cui-success'),
              borderWidth: 2,
              data: [
                random(50, 200),
                random(50, 200),
                random(50, 200),
                random(50, 200),
                random(50, 200),
                random(50, 200),
                random(50, 200),
              ],
            },
            {
              label: 'My Third dataset',
              backgroundColor: 'transparent',
              borderColor: getStyle('--cui-danger'),
              pointHoverBackgroundColor: getStyle('--cui-danger'),
              borderWidth: 1,
              borderDash: [8, 5],
              data: [65, 65, 65, 65, 65, 65, 65],
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              grid: {
                color: getStyle('--cui-border-color-translucent'), // Set the grid line color
                drawOnChartArea: false,
              },
              ticks: {
                color: getStyle('--cui-body-color'), // Set the tick color
              },
            },
            y: {
              beginAtZero: true,
              border: {
                color: getStyle('--cui-border-color-translucent'),
              },
              grid: {
                color: getStyle('--cui-border-color-translucent'), // Set the grid line color
              },
              max: 250,
              ticks: {
                color: getStyle('--cui-body-color'),
                maxTicksLimit: 5,
                stepSize: Math.ceil(250 / 5),
              },
            },
          },
          elements: {
            line: {
              tension: 0.4,
            },
            point: {
              radius: 0,
              hitRadius: 10,
              hoverRadius: 4,
              hoverBorderWidth: 3,
            },
          },
        }}
      />
    </>
  )
}

export default MainChart
