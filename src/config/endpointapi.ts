export const END_POINT_API = {
  Department: {
    getByCode: (code: string) => `/org/group/${code}`,
    getBaseInfo: (code: string) => `/org/group/get-base-info/${code}`,
    updateUserRole: () => `/org/group/update/user-role`
  },
  Devices: {
    create: () => `/attmachine/setup/register`,
    update: () => `/attmachine/setup/update`,
    delete: (id: string) => `/attmachine/setup/delete/${id}`,
    active: () => `/attmachine/setup/status`,
    getPageSize: () => `/attmachine/setup/filter`
  },
  TypesOfLeave: {
    create: () => `/type-of-leave/create`,
    update: () => `/type-of-leave/update`,
    getPageSize: () => `/type-of-leave/filter`,
    delete: () => `/type-of-leave/delete`
  },
  Users: {
    changePassword: () => `/system-user/change-password`
  },
  LeaveRequest: {
    create: () => `/tickets/create`,
    update: () => `/tickets/update`,
    edit: () => `/tickets/edit`,
    getPageSize: () => `/tickets/filter`,
    delete: () => `/tickets/cancel`,
    reset: () => `/tickets/reset`
  }
}
