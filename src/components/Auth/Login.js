import React, { useState } from 'react'
import { Alert, Button, Input } from 'antd';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './../../styles/authentication.scss';
import { hideLoader, showLoader } from '../../util/Utils';

const Login = () => {

    const { login } = useAuth();
    const history = useHistory();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();
    const handleLogin = async () => {
        showLoader();
        setError('');
        try {
            await login(email, password);
            history.push('/');
        } catch (e) {
            switch (e.code) {
                case 'auth/user-not-found':
                    setError('User doesn\'t exists');
                    break;
                case 'auth/wrong-password':
                    setError('Wrong Email/Password');
                    break;
                case 'auth/too-many-requests':
                    setError('You tried too many times, please try after some time');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email');
                    break;
                default:
                    setError(e.code);
            }
        } finally {
            hideLoader();
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
                    {error && <Alert message={error} type="error" />}
                    <div className="mt-4 custom-label-wrapper">
                        <label className="custom-label primary">Enter email *</label>
                        <Input onChange={(e) => setEmail(e.currentTarget.value)} />
                    </div>
                    <div className="mt-4 custom-label-wrapper">
                        <label className="custom-label primary">Enter password *</label>
                        <Input type="password" onChange={e => setPassword(e.currentTarget.value)} />
                    </div>
                    <div className="d-flex justify-content-end">
                        <Button disabled={!email || !password} type="success" className="filled mt-3" onClick={handleLogin}>Login</Button>
                    </div>
                    <div className="mt-4 text-center" >
                        Don't have an account? <Button className="d-inline-imp text-link" type="link" onClick={gotoSignup}> Signup</Button>
                    </div>

                </div>
            </div>
        </div >
    )
}

export default Login
