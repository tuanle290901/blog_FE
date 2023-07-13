/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { BellOutlined, InfoCircleOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Avatar, Badge, Dropdown, Layout, Menu, Space, Tooltip } from 'antd'
import React, { useState, useMemo } from 'react'

import logo from '../assets/images/logo.png'
import menuIconTimeKeeping from '../assets/images/menu/carry-out.png'
import menuIconDepartment from '../assets/images/menu/department.png'
import menuIconMember from '../assets/images/menu/member.png'
import menuIconSetting from '../assets/images/menu/setting.png'
import menuIconStatistical from '../assets/images/menu/statistical.png'

import { Outlet, useNavigate } from 'react-router-dom'
import './style.scss'
import { useAppDispatch, useAppSelector } from '~/stores/hook'
import { logout } from '~/stores/features/auth/auth.slice'
import { PUBLIC_PATH } from '~/constants/public-routes'
import { useUserInfo } from '~/stores/hooks/useUserProfile'

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

  const { userInfo } = useUserInfo()

  const handleLogout = () => {
    dispatch(logout())
    navigate(`auth/${PUBLIC_PATH.login}`)
  }

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
    return [
      getItem('Trang chủ', '/', <img src={menuIconStatistical} alt='' className='menu-image' />),
      getItem(
        <Tooltip placement='topLeft' title='Chức năng chính'>
          Chức năng chính
        </Tooltip>,
        'mainFunction',
        null,
        [
          getItem('Chấm công', 'timeKeeping', <img src={menuIconTimeKeeping} alt='' className='menu-image' />, [
            getItem('Lịch sử chấm công', 'timesheet'),
            getItem('Lịch sử yêu cầu', 'requestHistory'),
            getItem('Danh sách yêu cầu', 'requestList')
          ])
        ],
        'group'
      ),

      getItem(
        <Tooltip placement='topLeft' title='Chức năng quản lý'>
          Chức năng quản lý
        </Tooltip>,
        'manageFunction',
        null,
        [
          getItem('Thành viên', '/users', <img src={menuIconMember} alt='' className='menu-image' />),
          getItem('Phòng ban', 'department', <img src={menuIconDepartment} alt='' className='menu-image' />)
        ],
        'group'
      ),

      getItem(
        <Tooltip placement='topLeft' title='Cấu hình hệ thống'>
          Cấu hình hệ thống
        </Tooltip>,
        'systemConfig',
        null,
        [
          getItem('Cấu hình', 'setting', <img src={menuIconSetting} alt='' className='menu-image' />, [
            getItem('Thời gian làm việc', 'timeWorking'),
            getItem('Quy trình phê duyệt phép', 'ticket-process-definition')
          ])
        ],
        'group'
      )
    ]
  }, [])

  const handleMenuClick = (menu: MenuItem) => {
    if (menu?.key) {
      navigate(menu.key.toString())
    }
  }

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
        <Menu theme='light' defaultSelectedKeys={['1']} mode='inline' items={menuItems} onClick={handleMenuClick} />
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
                  <Avatar size='default' icon={<UserOutlined />} />
                  <span className='tw-font-bold'>{userInfo?.fullName}</span>
                </Space>
              </div>
            </Dropdown>
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
