interface IWorkingTime {
  workingDate: string[]
  workingHour: string[]
}

export interface IEmployeeWorkingTime {
  arrivalTime: IWorkingTime
  offTime: IWorkingTime
}
