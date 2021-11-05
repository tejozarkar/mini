import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import React from 'react'
import { Button, Form, Input } from 'antd';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './../styles/authentication.scss';

const Login = () => {

    const { login } = useAuth();
    const history = useHistory();
    const handleLogin = async (values) => {
        try {
            await login(values['email'], values['password']);
            VoxeetSDK.session.open({ name: values['email'] })
            history.goBack();
        } catch {

        }
    }

    const gotoSignup = () => {
        history.push('/signup');
    }
    return (
        <div className="auth-wrapper">
            <div className="form-wrapper">
                <h3> Login </h3>
                <Form name="basic" layout="vertical" onFinish={handleLogin}
                    autoComplete="off">
                    <Form.Item label="Email" name="email"
                        rules={[{ required: true, message: "Please input your email!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Password" name="password"
                        rules={[{ required: true, message: "Please input your password!" }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button style={{ width: '100%' }} type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button style={{ width: '100%' }} type="link" onClick={gotoSignup}>Don't have an account? Signup</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Login
