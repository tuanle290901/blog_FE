/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { BellOutlined, InfoCircleOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Avatar, Badge, Dropdown, Layout, Menu, Space, Tooltip } from 'antd'
import React, { useState, useMemo, useEffect } from 'react'

import logo from '../assets/images/logo.png'
import menuIconTimeKeeping from '../assets/images/menu/carry-out.png'
import menuIconDepartment from '../assets/images/menu/department.png'
import menuIconMember from '../assets/images/menu/member.png'
import menuIconSetting from '../assets/images/menu/setting.png'
import menuIconStatistical from '../assets/images/menu/statistical.png'
import menuIconReport from '../assets/images/menu/icon-report.png'

import defaultImg from '~/assets/images/default-img.png'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import './style.scss'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { logout } from '~/stores/features/auth/auth.slice'
import { PUBLIC_PATH } from '~/constants/public-routes'
import { useUserInfo } from '~/stores/hooks/useUserProfile'
import { getAllGroup } from '~/stores/features/master-data/master-data.slice'
import ChangePassword from '~/pages/change-password/change-password'
import { hasPermission } from '~/utils/helper'
import { ROLE } from '~/constants/app.constant'

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
      {
        key: 'profile',
        label: (
          <div className='tw-flex tw-items-center'>
            <InfoCircleOutlined /> <span className='tw-ml-[8px]'>Thông tin cá nhân</span>
          </div>
        )
      },
      {
        key: 'changePassword',
        label: (
          <div
            className='tw-flex tw-items-center'
            onClick={() => {
              setShowChangePassword(!showChangePassword)
            }}
          >
            <span className='tw-ml-[8px]'>Đổi mật khẩu</span>
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
    const getItemIfAllowed = (roles: ROLE[], title: any, key: string, icon?: any, subMenu?: any, group?: any) => {
      const hasRole = hasPermission(roles, userInfo?.groupProfiles)
      if (!hasRole) return null
      return getItem(title, key, icon, subMenu, group)
    }

    return [
      getItemIfAllowed(
        [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER],
        <Tooltip placement='topLeft' title='Chức năng chính'>
          Chức năng chính
        </Tooltip>,
        'mainFunction',
        null,
        [
          getItemIfAllowed(
            [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER],
            'Chấm công',
            'timeKeeping',
            <img src={menuIconTimeKeeping} alt='' className='menu-image' />,
            [
              getItemIfAllowed(
                [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER],
                'Lịch sử chấm công',
                'timesheet'
              )
            ]
          )
        ],
        'group'
      ),

      getItemIfAllowed(
        [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER],
        <Tooltip placement='topLeft' title='Chức năng quản lý'>
          Chức năng quản lý
        </Tooltip>,
        'manageFunction',
        null,
        [
          getItemIfAllowed(
            [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.OFFICER, ROLE.MANAGER],
            'Thành viên',
            'users',
            <img src={menuIconMember} alt='' className='menu-image' />
          ),
          getItemIfAllowed(
            [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.MANAGER],
            'Phòng ban',
            'department',
            <img src={menuIconDepartment} alt='' className='menu-image' />
          ),
          getItemIfAllowed(
            [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.MANAGER],
            'Chức vụ',
            'positions',
            <img src={menuIconDepartment} alt='' className='menu-image' />
          )
        ],
        'group'
      ),

      getItemIfAllowed(
        [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.MANAGER],
        <Tooltip placement='topLeft' title='Chức năng báo cáo'>
          Chức năng báo cáo
        </Tooltip>,
        'reportFunction',
        null,
        [
          getItemIfAllowed(
            [ROLE.SYSTEM_ADMIN, ROLE.SUB_MANAGER, ROLE.MANAGER],
            'Báo cáo',
            'report',
            <img src={menuIconReport} alt='' className='menu-image' />
          )
        ],
        'group'
      ),

      getItemIfAllowed(
        [ROLE.SYSTEM_ADMIN],
        <Tooltip placement='topLeft' title='Cấu hình hệ thống'>
          Cấu hình hệ thống
        </Tooltip>,
        'systemConfig',
        null,
        [
          getItemIfAllowed(
            [ROLE.SYSTEM_ADMIN],
            'Cấu hình',
            'setting',
            <img src={menuIconSetting} alt='' className='menu-image' />,
            [
              getItemIfAllowed([ROLE.SYSTEM_ADMIN], 'Thời gian làm việc', 'timeWorking'),
              getItemIfAllowed([ROLE.SYSTEM_ADMIN], 'Danh sách thiết bị chấm công', 'devices'),
              // getItemIfAllowed([ROLE.SYSTEM_ADMIN], 'Quy trình phê duyệt phép', 'ticket-process-definition'),
              getItemIfAllowed([ROLE.SYSTEM_ADMIN], 'Loại nghỉ phép', 'types-of-leave')
            ]
          )
        ],
        'group'
      )
    ]
  }, [userInfo])

  const handleMenuClick = (menu: MenuItem) => {
    if (menu?.key) {
      navigate(menu.key.toString())
    }
  }

  useEffect(() => {
    const pathname = window.location.pathname.replace('/', '')
    setSideBarMenuKey(pathname)
    setSelectedKeyStatus(pathname)
  }, [window.location.pathname])

  return (
    <Layout className='app-container tw-min-h-screen'>
      <Sider theme='light' collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className='logo-vertical tw-flex tw-items-center tw-justify-center'>
          <img src={logo} alt='' className='logo-image' />
          {!collapsed && (
            <span className='logo-title-container'>
              <span className='logo-title tw-ml-[5px] tw-font-extrabold tw-text-lg logo-text-color'>ATTENDANCE</span>
            </span>
          )}
        </div>
        <hr className='hr-custom' />
        <Menu
          theme='light'
          // defaultSelectedKeys={['1']}
          defaultSelectedKeys={[sideBarMenuKey]}
          defaultOpenKeys={[sideBarMenuKey]}
          selectedKeys={[selectedKeyStatus]}
          mode='inline'
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header className='header-container'>
          <div className='header-container__left'></div>
          <div className='header-container__right'>
            <Dropdown
              menu={{
                items: dropdownItems
              }}
              placement='bottom'
            >
              <div className='space-custom'>
                <Badge count={1}>
                  <BellOutlined className='bell-icon-custom' />
                </Badge>
                <Space className='tw-cursor-pointer tw-ml-[15px]'>
                  <Avatar
                    size='default'
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
                  <span className='tw-font-bold'>{userInfo?.fullName}</span>
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
