import dayjs from 'dayjs'
import { FC, memo, useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'

interface IChartOptions {
  categories: string[]
  seriesData: string[]
  seriesTitle: string
}

const TimesheetChart: FC<IChartOptions> = (props) => {
  const { categories, seriesData, seriesTitle } = props

  const mappingSeriesData = useMemo(() => {
    return seriesData?.map((time) => {
      const [hours, minutes] = time.split(':')
      return parseInt(hours) * 60 + parseInt(minutes)
    })
  }, [seriesData])

  const xAxisFormatter = useMemo(() => {
    return (value: string) => {
      const index = categories?.indexOf(value)
      if (index % 5 === 0) {
        return dayjs(value).format('DD/MM')
      } else {
        return ''
      }
    }
  }, [categories])

  const yAxisFormatter = (value: number) => {
    const hours = Math.floor(value / 60)
    const minutes = value % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  const chartData = useMemo(() => {
    return {
      options: {
        chart: {
          id: 'basic-line-chart',
          toolbar: {
            show: true,
            tools: {
              download: false,
              selection: false,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: false,
              reset: false
            }
          }
        },
        stroke: {
          width: 2,
          colors: ['red']
        },
        xaxis: {
          categories: categories,
          labels: {
            rotate: 0,
            formatter: xAxisFormatter,
            style: {
              colors: [],
              fontSize: '14px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 500
            }
          },
          tooltip: {
            enabled: false
          }
        },
        yaxis: {
          tickAmount: 2,
          labels: {
            rotate: 0,
            formatter: yAxisFormatter,
            style: {
              colors: [],
              fontSize: '13px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600
            }
          }
        },
        markers: {
          size: 4,
          strokeWidth: 0,
          hover: {
            size: 5
          },
          colors: ['#5e95ef']
        },
        dataLabels: {
          enabled: false
        }
      },
      series: [
        {
          name: seriesTitle,
          data: mappingSeriesData
        }
      ]
    }
  }, [categories, seriesData, seriesTitle])

  return (
    <ReactApexChart options={chartData.options} series={chartData.series} type='line' height={180} width={'100%'} />
  )
}

export default memo(TimesheetChart)
