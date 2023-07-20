/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from 'antd'
import FileSaver from 'file-saver'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { WorkBook } from 'xlsx'
import * as XLSX from 'xlsx'
import { FileExcelOutlined } from '@ant-design/icons'
const ExcelExportButton: React.FC<{
  sheetsData: {
    sheetName: string | ''
    headers?: string[] | []
    data: any[]
  }[]
  fileName: string | ''
}> = (props: {
  sheetsData: {
    sheetName: string | ''
    headers?: string[] | []
    data: any[]
  }[]
  fileName: string
}) => {
  const { sheetsData, fileName } = props
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'
  const { t } = useTranslation()

  const exportToCSV = (sheetsData: { sheetName: any; headers?: string[]; data: any[] }[], fileName: string) => {
    const wb: WorkBook = { Sheets: {}, SheetNames: [] }

    sheetsData.forEach(({ sheetName, headers, data }) => {
      const ws = XLSX.utils.aoa_to_sheet([headers, ...data])
      wb.SheetNames.push(sheetName)
      wb.Sheets[sheetName] = ws
    })

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  return (
    <Button type='default' onClick={() => exportToCSV(sheetsData, fileName)}>
      <FileExcelOutlined />
      {t('exportStatisticButton')}
    </Button>
  )
}

export default ExcelExportButton
