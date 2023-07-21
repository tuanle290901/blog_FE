const mockupData = [
  ['STT', 'Mã', 'Tên', 'Địa chỉ', 'Số điện thoại'],
  [1, 'HTSC', 'HTSC1', '9', '0968335364'],
  [2, '162657', '162657', '', ''],
  [3, 'HTS', 'HDS', '', ''],
  [4, 'HTISERVICE', 'HTIS ERVICE', '', '']
]
let excelContent = ''
mockupData.forEach((row) => {
  excelContent += row.join(',') + '\r\n'
})
export const excelBlob = new Blob([excelContent], { type: 'text/csv' })
export const excelURL = URL.createObjectURL(excelBlob)
