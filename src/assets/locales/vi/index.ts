import common from './common.json'
import initializeVI from './initialize.json'
import userManagement from './user-management.json'
import auth from './auth.json'
import device from './device.json'
import timesheetVI from './timesheet.json'
import department from './department.json'
import typesOfLeave from './types-of-leave.json'
import changePassword from './change-password.json'
import position from './position.json'
import leaveRequest from './leave-request.json'
import dashboard from './dashboard.json'
import benefit from './benefit.json'

export const vi = {
  ...common,
  ...initializeVI,
  ...auth,
  ...userManagement,
  ...device,
  ...timesheetVI,
  ...department,
  ...typesOfLeave,
  ...changePassword,
  ...position,
  ...leaveRequest,
  ...dashboard,
  ...benefit
}
