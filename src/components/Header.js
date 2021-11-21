import { Button } from 'antd';
import React from 'react'
import './../styles/header.scss';
import { LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const Header = ({ conferenceName }) => {
    const { logout } = useAuth();
    return (
        <div className="header-wrapper py-2 px-3 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
                <p className="logo-text mb-0 mx-3">
                    mini
                </p>
                <h4 className="conference-name-text mb-0">{conferenceName}</h4>
            </div>
            <Button type="danger" size="large" icon={<LogoutOutlined />} onClick={logout}>Logout </Button>
        </div>
    )
}

export default Header
