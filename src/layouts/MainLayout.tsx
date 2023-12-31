/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { DoubleLeftOutlined, DoubleRightOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Avatar, Dropdown, Layout, Menu, Space, Tooltip } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'

import logoIcon from '../assets/images/logo-ems-icon.png'
import logoHtsc from '../assets/images/logo-htsc.png'
import logo from '../assets/images/logo.png'
import menuIconReport from '../assets/images/menu/icon_group.png'
import menuIconEmployee from '../assets/images/menu/icon_human_resource.png'
import menuIconRequest from '../assets/images/menu/icon_request.png'
import menuIconTimeKeeping from '../assets/images/menu/icon_timesheet.png'
import menuIconSetting from '../assets/images/menu/setting.png'
// import menuIconDashboard from '../assets/images/menu/icon_chart.png'

import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import defaultImg from '~/assets/images/default-img.png'
import { ROLE } from '~/constants/app.constant'
import { PUBLIC_PATH } from '~/constants/public-routes'
import ChangePassword from '~/pages/change-password/change-password'
import { logout } from '~/stores/features/auth/auth.slice'
import { getAllGroup } from '~/stores/features/master-data/master-data.slice'
import { useAppDispatch } from '~/stores/hook'
import { useUserInfo } from '~/stores/hooks/useUserProfile'
import { LOCAL_STORAGE } from '~/utils/Constant'
import { hasPermission } from '~/utils/helper'
import './style.scss'

const { Header, Content, Sider } = Layout
type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type
  } as MenuItem
}

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const params = useLocation()
  const { userInfo } = useUserInfo()
  const [sideBarMenuKey, setSideBarMenuKey] = useState('')
  const [selectedKeyStatus, setSelectedKeyStatus] = useState<string>(`${params.pathname}`.split('/')[1])
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false)
  const [currentMobileItem, setCurrentMobileItem] = useState('')

  const handleLogout = () => {
    dispatch(logout())
    navigate(`auth/${PUBLIC_PATH.login}`)
  }
  useEffect(() => {
    const getAllGroups = dispatch(getAllGroup())
    return () => {
      getAllGroups.abort()
    }
  }, [])

  const dropdownItems = useMemo(() => {
    return [
      // {
      //   key: 'profile',
      //   label: (
      //     <div className='tw-flex tw-items-center'>
      //       <InfoCircleOutlined /> <span className='tw-ml-[8px]'>Thông tin cá nhân</span>
      //     </div>
      //   )
      // },
      {
        key: 'changePassword',
        label: (
          <div
            className='tw-flex tw-items-center'
            onClick={() => {
              setShowChangePassword(!showChangePassword)
            }}
          >
            <LockOutlined /> <span className='tw-ml-[8px]'>Đổi mật khẩu</span>
          </div>
        )
      },
      {
        key: 'signOut',
        label: (
          <div className='tw-flex tw-items-center tw-text-red-500' onClick={handleLogout}>
            <LoginOutlined /> <span className='tw-ml-[8px] '>Đăng xuất</span>
          </div>
        )
      }
    ]
  }, [])

  const menuItems: MenuItem[] = useMemo(() => {
    const getItemIfAllowed = (
      roles: ROLE[],
      title: React.ReactNode,
      key: React.Key,
      icon?: React.ReactNode,
      subMenu?: MenuItem[],
      group?: any
    ) => {
      const hasRole = hasPermission(roles, userInfo?.groupProfiles)
      if (hasRole) return getItem(title, key, icon, subMenu, group)
      const isHrManager = userInfo?.groupProfiles.find(
        (item) => item.groupCode === ROLE.HR && (item.role === ROLE.MANAGER || item.role === ROLE.SUB_MANAGER)
      )
      if (key === 'report') {
        if (isHrManager) {
          return getItem(title, key, icon, subMenu, group)
        }
      }
      return null
    }

    return [
      // getItemIfAllowed(
      //   [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER],
      //   'Tổng quan',
      //   'dashboard',
      //   <img src={menuIconDashboard} alt='' className='menu-image' />
      // ),

      getItemIfAllowed(
        [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER],
        'Xác nhận ngày công',
        'timesheet',
        <img src={menuIconTimeKeeping} alt='' className='menu-image' />
      ),

      getItemIfAllowed(
        [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER],
        'Yêu cầu',
        'requestGroup',
        <img src={menuIconRequest} alt='' className='menu-image' />,
        [
          getItemIfAllowed(
            [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER],
            'Danh sách yêu cầu',
            'request',
            null
          ),
          getItemIfAllowed(
            [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.MANAGER, ROLE.OFFICER],
            'Thống kê dữ liệu tháng',
            'statistical',
            null
          )
        ]
      ),

      getItemIfAllowed(
        [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER],
        <Tooltip placement='topLeft' title='Nhân sự'>
          Nhân sự
        </Tooltip>,
        'manageFunction',
        <img src={menuIconEmployee} alt='' className='menu-image' />,
        [
          getItemIfAllowed(
            [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER],
            'Thành viên',
            'users',
            null
          ),
          getItemIfAllowed([ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.MANAGER], 'Phòng ban', 'department', null),
          getItemIfAllowed([ROLE.SYSTEM_ADMIN], 'Chức vụ', 'positions', null)
        ]
      ),

      getItemIfAllowed(
        [ROLE.SYSTEM_ADMIN],
        'Báo cáo',
        'report',
        <img src={menuIconReport} alt='' className='menu-image' />
      ),

      getItemIfAllowed(
        [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER],
        'Thiết lập',
        'setting',
        <img src={menuIconSetting} alt='' className='menu-image' />,
        [
          getItemIfAllowed(
            [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER],
            'Thời gian làm việc',
            'working-time'
          ),
          getItemIfAllowed(
            [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER],
            'Ngày nghỉ lễ',
            'holiday-schedule'
          ),
          getItemIfAllowed([ROLE.SYSTEM_ADMIN], 'Thiết bị chấm công', 'devices'),
          getItemIfAllowed(
            [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER],
            'Quy trình phê duyệt phép',
            'ticket-definition'
          ),
          // getItemIfAllowed([ROLE.SYSTEM_ADMIN], 'Loại nghỉ phép', 'types-of-leave')
          getItemIfAllowed([ROLE.SYSTEM_ADMIN], 'Thời gian nghỉ phép', 'benefit')
        ]
      )
    ]
  }, [userInfo])

  const menuMobileItems: MenuItem[] = useMemo(() => {
    const getItemIfAllowed = (
      roles: ROLE[],
      title: React.ReactNode,
      key: React.Key,
      icon?: React.ReactNode,
      subMenu?: MenuItem[],
      group?: any
    ) => {
      const hasRole = hasPermission(roles, userInfo?.groupProfiles)
      if (hasRole) return getItem(title, key, icon, subMenu, group)
      const isHrManager = userInfo?.groupProfiles.find(
        (item) => item.groupCode === ROLE.HR && (item.role === ROLE.MANAGER || item.role === ROLE.SUB_MANAGER)
      )
      if (key === 'report') {
        if (isHrManager) {
          return getItem(title, key, icon, subMenu, group)
        }
      }
      return null
    }

    return [
      // getItemIfAllowed([ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER], 'Tổng quan', 'dashboard'),
      getItemIfAllowed([ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER], 'Ngày công', 'timesheet'),
      getItemIfAllowed(
        [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER],
        'Danh mục khác',
        'menu',
        null,
        [
          getItemIfAllowed(
            [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER],
            'Yêu cầu',
            'requestGroup',
            null,
            [
              getItemIfAllowed(
                [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER],
                'Danh sách yêu cầu',
                'request'
              ),
              getItemIfAllowed(
                [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER],
                'Thống kê dữ liệu tháng',
                'statistical'
              )
            ]
          ),
          getItemIfAllowed(
            [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER],
            'Nhân sự',
            'userGroup',
            null,
            [
              getItemIfAllowed(
                [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER],
                'Thành viên',
                'users'
              ),
              getItemIfAllowed(
                [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER],
                'Phòng ban',
                'department'
              ),
              getItemIfAllowed(
                [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER],
                'Chức vụ',
                'positions'
              )
            ]
          ),
          getItemIfAllowed([ROLE.SYSTEM_ADMIN], 'Báo cáo', 'report'),
          getItemIfAllowed([ROLE.SYSTEM_ADMIN], 'Thiết lập', 'setting', null, [
            getItemIfAllowed([ROLE.SYSTEM_ADMIN], 'Thời gian làm việc', 'working-time'),
            // getItemIfAllowed([ROLE.SYSTEM_ADMIN], 'Ngày nghỉ lễ', 'holiday-schedule'),
            getItemIfAllowed([ROLE.SYSTEM_ADMIN], 'Thiết bị chấm công', 'devices'),
            getItemIfAllowed([ROLE.SYSTEM_ADMIN], 'Thời gian nghỉ phép', 'benefit')
          ])
        ]
      )
    ]
  }, [userInfo])

  const handleMenuClick = (menu: MenuItem) => {
    if (menu?.key) {
      navigate(menu.key.toString())
    }
  }

  const onMobileMenuClick: MenuProps['onClick'] = (e) => {
    if (e?.key) {
      navigate(e.key.toString())
    }
    setCurrentMobileItem(e.key)
  }

  useEffect(() => {
    const pathname = window.location.pathname.replace('/', '')
    setSideBarMenuKey(pathname)
    setSelectedKeyStatus(pathname)
  }, [window.location.pathname])

  useEffect(() => {
    const handleStorageChange = (event: any) => {
      if (event.key === LOCAL_STORAGE.AUTH_INFO) {
        if (!event.newValue) {
          handleLogout()
        }
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return (
    <Layout className='app-container tw-min-h-screen'>
      <Sider
        theme='light'
        collapsible={false}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={250}
        className='sidebar-custom tw-hidden xl:tw-block'
      >
        <div className='menu-top'>
          <div className='logo-vertical tw-flex tw-flex-col tw-items-center tw-justify-center'>
            {!collapsed && (
              <img src={logo} alt='' className='logo-image tw-cursor-pointer' onClick={() => navigate('timesheet')} />
            )}
            {collapsed && (
              <img
                src={logoIcon}
                alt=''
                className='logo-image tw-cursor-pointer'
                onClick={() => navigate('timesheet')}
              />
            )}
          </div>
          <Menu
            style={{ backgroundColor: 'transparent' }}
            theme='light'
            defaultSelectedKeys={[sideBarMenuKey]}
            defaultOpenKeys={[sideBarMenuKey]}
            selectedKeys={[selectedKeyStatus]}
            mode='inline'
            items={menuItems}
            onClick={handleMenuClick}
          />
        </div>

        <div className='menu-bottom'>
          {!collapsed && (
            <>
              <div className='bottom-main-text'>Employee Management System</div>
              <div className='tw-flex tw-items-center'>
                <span className='bottom-extra-text tw-mr-1'>Powered by</span>
                <img src={logoHtsc} alt='' className='tw-h-[23px]' />
              </div>
            </>
          )}

          <div onClick={() => setCollapsed(!collapsed)}>
            {collapsed && <DoubleRightOutlined className='tw-text-white tw-cursor-pointer' />}
            {!collapsed && <DoubleLeftOutlined className='tw-text-white tw-cursor-pointer' />}
          </div>
        </div>
      </Sider>
      <Layout>
        <Header className='header-container tw-px-[10px] lg:tw-px-[30px]'>
          <div className='header-container__left tw-block xl:tw-hidden'>
            <Menu
              onClick={onMobileMenuClick}
              selectedKeys={[currentMobileItem]}
              mode='horizontal'
              items={menuMobileItems}
            />
          </div>
          <div className='header-container__right'>
            <Dropdown
              menu={{
                items: dropdownItems
              }}
              placement='bottom'
            >
              <div className='space-custom'>
                <Space className='tw-cursor-pointer tw-ml-[15px]'>
                  <Avatar
                    size='large'
                    icon={
                      userInfo?.avatarBase64 ? (
                        <img
                          className='tw-w-28 tw-border-2 tw-border-solid tw-border-gray-300 tw-h-28 tw-rounded-full tw-object-cover'
                          src={`data:image/png;base64,${userInfo?.avatarBase64}`}
                          alt='avatar'
                        />
                      ) : (
                        <img
                          className='tw-w-28 tw-border-2 tw-border-solid tw-border-gray-300 tw-h-28 tw-rounded-full tw-object-cover'
                          src={defaultImg}
                          alt='avatar'
                        />
                      )
                    }
                  />
                  <span className='tw-hidden md:tw-block header-right__username'>{userInfo?.fullName}</span>
                </Space>
              </div>
            </Dropdown>
            <ChangePassword
              showModal={showChangePassword}
              handClose={() => {
                setShowChangePassword(!showChangePassword)
              }}
            />
          </div>
        </Header>
        <Content className='content-container'>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
