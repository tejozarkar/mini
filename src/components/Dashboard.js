import Button from '@restart/ui/esm/Button';
import React from 'react'
import { useHistory } from 'react-router';
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
    const { currentUser, logout } = useAuth();
    const history = useHistory();
    const handleLogout = async () => {
        try {
            await logout();
            history.push('/login');
        } catch {

        }
    }
    return (
        <>
            <h3> Welcome {currentUser && currentUser.email} </h3>
            <Button className="btn btn-default" onClick={handleLogout}>Logout</Button>
        </>
    )
}

export default Dashboard
