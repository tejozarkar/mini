import Button from '@restart/ui/esm/Button'
import React, { useRef, useState } from 'react'
import { Alert, Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwordRef.current.value !== confirmPasswordRef.current.value) {
            setError('Passwords do not match!');
            return;
        }
        try {
            setError('');
            await signup(emailRef.current.value, passwordRef.current.value);
            history.push('/');

        } catch {
            setError('Failed to create an account');
        }
    }
    return (
        <>
            <h3>Signup</h3>
            {error && <Alert>{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} required></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Confirm password</Form.Label>
                    <Form.Control type="password" ref={confirmPasswordRef} required></Form.Control>
                </Form.Group>
                <Button type="submit" className="btn btn-primary">Submit</Button>
            </Form>
        </>
    )
}

export default Signup
