import React, { useState } from 'react'
import { Button, Input } from 'antd';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './../../styles/authentication.scss';

const Login = () => {

    const { login } = useAuth();
    const history = useHistory();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const handleLogin = async () => {
        try {
            await login(email, password);
            history.push('/');
        } catch {

        }
    }

    const gotoSignup = () => {
        history.push('/signup');
    }

    return (
        <div className="auth-wrapper">

            <div className="form-wrapper">
                <p className="logo-text mb-3 text-center">
                    mini
                </p>
                <div className="p-3 py-5">
                    <h4 className="text-white-50"> Login </h4>
                    <div className="mt-4 custom-label-wrapper">
                        <label className="custom-label primary">Enter email</label>
                        <Input onChange={(e) => setEmail(e.currentTarget.value)} />
                    </div>
                    <div className="mt-4 custom-label-wrapper">
                        <label className="custom-label primary">Enter password</label>
                        <Input type="password" onChange={e => setPassword(e.currentTarget.value)} />
                    </div>
                    <div className="d-flex justify-content-end">
                        <Button type="success" className="filled mt-3" onClick={handleLogin}>Login</Button>
                    </div>
                    <Button style={{ width: '100%' }} type="link" onClick={gotoSignup}>Don't have an account? Signup</Button>
                </div>
            </div>
        </div >
    )
}

export default Login
