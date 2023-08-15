import React from 'react'
import ApexCharts from 'react-apexcharts'

const violateSeries = [
  {
    name: 'Đến muộn',
    data: [44, 55, 57, 56, 61, 26, 58, 63, 58, 63, 60, 66]
  },
  {
    name: 'Về sớm',
    data: [76, 85, 101, 98, 87, 105, 61, 58, 63, 91, 114, 94]
  }
]

const violateOptions: any = {
  chart: {
    type: 'bar',
    height: 350
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded'
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12'
    ]
  },
  // yaxis: {
  //   title: {
  //     text: '$ (thousands)'
  //   }
  // },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: function (val: any) {
        return val + ' lần'
      }
    }
  }
}

const ViolateChart: React.FC = () => {
  return (
    <div>
      <ApexCharts options={violateOptions} series={violateSeries} type='bar' height={260} />
    </div>
  )
}

export default ViolateChart
