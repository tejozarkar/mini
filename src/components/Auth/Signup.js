import { Alert, Button, Input } from "antd";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { hideLoader, showLoader } from "../../util/Utils";
import './../../styles/authentication.scss';

const Signup = () => {

    const [error, setError] = useState("");
    const { signup, updateUserProfile } = useAuth();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [displayName, setDisplayName] = useState();
    const history = useHistory();


    const handleSignup = async () => {
        if (!email || !displayName || !password || !confirmPassword) {
            setError('All fields are mandatory');
            return;
        }
        if (password.length < 6) {
            setError('Password must be atleast 6 letters');
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        showLoader();
        if (password)
            try {
                setError("");
                await signup(email, password);
                await updateUserProfile(displayName);
                history.push("/");
            } catch (e) {
                setError("Failed to create an account", e);
            } finally {
                hideLoader();
            }
    };

    const gotoLogin = () => {
        history.push('/login');
    }

    return (
        <div className="auth-wrapper">
            <div className="form-wrapper">
                <p className="logo-text mb-3 text-center">
                    mini
                </p>
                <div className="p-3">
                    <h4 className="text-white-50"> Signup </h4>
                    {error && <Alert message={error} type="error" />}
                    <div className="mt-4 custom-label-wrapper">
                        <label className="custom-label primary">Enter your name<span className="text-danger">* </span></label>
                        <Input onChange={(e) => setDisplayName(e.currentTarget.value)} />
                    </div>
                    <div className="mt-4 custom-label-wrapper">
                        <label className="custom-label primary">Enter email<span className="text-danger">* </span></label>
                        <Input onChange={(e) => setEmail(e.currentTarget.value)} />
                    </div>
                    <div className="mt-4 custom-label-wrapper">
                        <label className="custom-label primary" >Enter password (Minimum 6 letters)<span className="text-danger">* </span></label>
                        <Input type="password" onChange={e => setPassword(e.currentTarget.value)} />
                    </div>
                    <div className="mt-4 custom-label-wrapper">
                        <label className="custom-label primary" >Re-enter password<span className="text-danger">* </span></label>
                        <Input type="password" onChange={e => setConfirmPassword(e.currentTarget.value)} />
                    </div>

                    <div className="d-flex justify-content-end">
                        <Button type="success" className="filled mt-3" onClick={handleSignup}>Signup</Button>
                    </div>
                    <div className="my-4 text-center" >
                        Already have an account? <Button className="d-inline-imp text-link" type="link" onClick={gotoLogin}>Login</Button>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Signup;
