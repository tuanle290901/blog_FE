import common from './common.json'
import initializeVI from './initialize.json'
import userManagement from './user-management.json'
import auth from './auth.json'
import device from './device.json'
export const vi = {
  ...common,
  ...initializeVI,
  ...auth,
  ...userManagement,
  ...device
}
