import { BellOutlined, InfoCircleOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Avatar, Badge, Dropdown, Layout, Menu, Space, Tooltip } from 'antd'
import React, { useState } from 'react'

import logo from '../assets/images/logo.png'
import menuIconTimeKeeping from '../assets/images/menu/carry-out.png'
import menuIconDepartment from '../assets/images/menu/department.png'
import menuIconMember from '../assets/images/menu/member.png'
import menuIconSetting from '../assets/images/menu/setting.png'
import menuIconStatistical from '../assets/images/menu/statistical.png'

import { Outlet } from 'react-router-dom'
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

const menuItems: MenuItem[] = [
  getItem('Trang chủ', 'dashboard', <img src={menuIconStatistical} alt='' className='menu-image' />),
  getItem(
    <Tooltip placement='topLeft' title='Chức năng chính'>
      Chức năng chính
    </Tooltip>,
    'mainFunction',
    null,
    [
      getItem('Chấm công', 'timeKeeping', <img src={menuIconTimeKeeping} alt='' className='menu-image' />, [
        getItem('Lịch sử chấm công', 'timeKeepingHistory'),
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
      getItem('Thành viên', 'member', <img src={menuIconMember} alt='' className='menu-image' />),
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
        getItem('Thời gian làm việc', 'timeWorking')
      ])
    ],
    'group'
  )
]

const dropdownItems = [
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
      <div className='tw-flex tw-items-center tw-text-red-500'>
        <LoginOutlined /> <span className='tw-ml-[8px] '>Đăng xuất</span>
      </div>
    )
  }
]

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)

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
        <Menu theme='light' defaultSelectedKeys={['1']} mode='inline' items={menuItems} />
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
                  <span className='tw-font-bold'>Lục Vân Tiên</span>
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
