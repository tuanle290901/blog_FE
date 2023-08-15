import React from 'react'
import ApexCharts from 'react-apexcharts'
import { useTranslation } from 'react-i18next'

const ViolateChart: React.FC = () => {
  const { t } = useTranslation()
  const violateSeries = [
    {
      name: t('dashboard.lateCome'),
      data: [44, 55, 57, 56, 61, 26, 58, 63, 58, 63, 60, 66]
    },
    {
      name: t('dashboard.backEarly'),
      data: [76, 85, 101, 98, 87, 105, 61, 58, 63, 91, 114, 94]
    }
  ]

  const violateOptions: any = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
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
    colors: ['#66dcd2', '#fb7677'],
    xaxis: {
      categories: [
        `${t('dashboard.month')} 1`,
        `${t('dashboard.month')} 2`,
        `${t('dashboard.month')} 3`,
        `${t('dashboard.month')} 4`,
        `${t('dashboard.month')} 5`,
        `${t('dashboard.month')} 6`,
        `${t('dashboard.month')} 7`,
        `${t('dashboard.month')} 8`,
        `${t('dashboard.month')} 9`,
        `${t('dashboard.month')} 10`,
        `${t('dashboard.month')} 11`,
        `${t('dashboard.month')} 12`
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
        formatter: function (amount: number) {
          return amount + ` ${t('dashboard.bout')}`
        }
      }
    }
  }

  return <ApexCharts options={violateOptions} series={violateSeries} type='bar' height={410} width='100%' />
}

export default ViolateChart
