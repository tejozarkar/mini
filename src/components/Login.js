import Button from '@restart/ui/esm/Button'
import React, { useRef } from 'react'
import { Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();
    const history = useHistory();
    const handleLogin = async () => {
        try {
            await login(emailRef.current.value, passwordRef.current.value);
            history.push('/');
        } catch {

        }
    }
    return (
        <>
            <h3> Login </h3>
            <Form>
                <Form.Group>
                    <Form.Label> Email</Form.Label>
                    <Form.Control type='email' ref={emailRef} />
                </Form.Group>
                <Form.Group>
                    <Form.Label> Password</Form.Label>
                    <Form.Control type='password' ref={passwordRef} />
                </Form.Group>
                <Button className='btn btn-primary' onClick={handleLogin}>Login</Button>

            </Form>
        </>
    )
}

export default Login
