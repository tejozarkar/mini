import { Alert, Button, Form, Input } from "antd";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './../styles/authentication.scss';

const Signup = () => {

    const [error, setError] = useState("");
    const { signup, updateDisplayName } = useAuth();
    const history = useHistory();

    const onFinish = async (values) => {
        if (values['password'] !== values['confirmPassword']) {
            setError("Passwords do not match!");
            return;
        }
        try {
            setError("");
            await signup(values['email'], values['password']);
            await updateDisplayName(values['displayName']);
            history.push("/");
        } catch {
            setError("Failed to create an account");
        }
    };

    const gotoLogin = () => {
        history.push('/login');
    }
    return (
        <div className="auth-wrapper">
            <div className="form-wrapper">
                <h3> Signup </h3>
                {error && <Alert message={error} type="error" />}
                <Form name="basic" layout="vertical" onFinish={onFinish}
                    autoComplete="off">
                    <Form.Item label="Display Name" name="displayName"
                        rules={[{ required: true, message: "Please input your display name!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email"
                        rules={[{ required: true, message: "Please input your email!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Password" name="password"
                        rules={[{ required: true, message: "Please input your password!" }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item label="Confirm Password" name="confirmPassword"
                        rules={[{ required: true, message: "Please input your password again!" }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button style={{ width: '100%' }} size="large" type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button style={{ width: '100%' }} type="link" onClick={gotoLogin}>Already have an account? Login</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Signup;
