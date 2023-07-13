export const END_POINT_API = {
  Department: {
    getByCode: (code: string) => `/org/group/${code}`,
    getBaseInfo: (code: string) => `/org/group/get-base-info/${code}`,
    updateUserRole: () => `/org/group/update/user-role`
  }
}
