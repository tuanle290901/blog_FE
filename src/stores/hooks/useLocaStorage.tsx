function useLocalStorage(key: string, defaultValue: any) {
  let value = defaultValue

  if (typeof window !== 'undefined') {
    const tempValue = localStorage.getItem(key)
    value = tempValue ? JSON.parse(tempValue) : defaultValue
  }

  const setValue = (newValue: any) => {
    if (localStorage) {
      if (newValue || typeof newValue === 'boolean') {
        localStorage.setItem(key, JSON.stringify(newValue))
      } else {
        localStorage.removeItem(key)
      }
    }
    return true
  }

  return [value, setValue]
}

export default useLocalStorage
