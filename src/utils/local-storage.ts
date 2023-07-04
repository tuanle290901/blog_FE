export class LocalStorage {
  static localStorage: Storage | undefined = window.localStorage ? window.localStorage : undefined
  static isEnabled = window.localStorage

  static set(key: string, value: string): void {
    if (this.isEnabled) {
      this.localStorage?.setItem(key, value)
    }
  }

  static get(key: string): string {
    if (!this.isEnabled) {
      return ''
    }
    return this.localStorage?.getItem(key) || ''
  }

  static setObject(key: string, value: unknown): void {
    if (this.isEnabled) {
      this.localStorage?.setItem(key, JSON.stringify(value))
    }
  }

  static getObject<TType = unknown>(key: string): TType | null {
    if (!this.isEnabled) {
      return null
    }
    return JSON.parse(this.localStorage?.getItem(key) || 'null') as TType
  }

  static remove(key: string): void {
    if (!this.isEnabled) {
      return
    }
    this.localStorage?.removeItem(key)
  }

  static clear(): void {
    if (this.isEnabled) {
      this.localStorage?.clear()
    }
  }
}
