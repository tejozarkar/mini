import { UploadOutlined } from "@ant-design/icons";
import { Alert, Button, Input, Upload } from "antd";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDatabase } from "../../context/DatabaseContext";
import './../../styles/authentication.scss';

const Signup = () => {

    const [error, setError] = useState("");
    const { signup, updateUserProfile } = useAuth();
    const { insertUserToFirestore } = useDatabase();
    const [email, setEmail] = useState();
    const { uploadFile } = useDatabase();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [displayName, setDisplayName] = useState();
    const history = useHistory();
    const [imageAsFile, setImageAsFile] = useState('')
    const [downloadUrl, setDownloadUrl] = useState()

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    const handleImageAsFile = (e) => {
        console.log('file', e);
        const image = e.file.originFileObj;
        getBase64(e.file.originFileObj, imageUrl => setDownloadUrl(imageUrl));
        setImageAsFile(imageFile => (image));
    }


    const handleSignup = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        try {
            setError("");
            await signup(email, password);
            // let photoURL;
            // if (imageAsFile) {
            //     uploadFile(imageAsFile, async (url) => {
            //         photoURL = url;
            //         await updateUserProfile(displayName, photoURL);
            //         await insertUserToFirestore({ email, displayName, photoURL });
            //     });
            // } else {
            await updateUserProfile(displayName);
            // await insertUserToFirestore({ email, displayName });
            // }
            history.push("/");
        } catch (e) {
            console.log(e);
            setError("Failed to create an account", e);
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
                    <label className="text-white-50 mb-2">Profile Picture</label>
                    <Upload listType="picture-card" showUploadList={false} onChange={handleImageAsFile}>
                        {downloadUrl ?
                            <img src={downloadUrl} style={{ objectFit: 'cover', width: '100%' }} alt="avatar" /> :
                            <span><UploadOutlined />Upload</span>}
                    </Upload>
                    <div className="mt-4 custom-label-wrapper">
                        <label className="custom-label primary">Enter your name<span className="text-danger">* </span></label>
                        <Input onChange={(e) => setDisplayName(e.currentTarget.value)} />
                    </div>
                    <div className="mt-4 custom-label-wrapper">
                        <label className="custom-label primary">Enter email<span className="text-danger">* </span></label>
                        <Input onChange={(e) => setEmail(e.currentTarget.value)} />
                    </div>
                    <div className="mt-4 custom-label-wrapper">
                        <label className="custom-label primary" >Enter password<span className="text-danger">* </span></label>
                        <Input type="password" onChange={e => setPassword(e.currentTarget.value)} />
                    </div>
                    <div className="mt-4 custom-label-wrapper">
                        <label className="custom-label primary" >Re-enter password<span className="text-danger">* </span></label>
                        <Input type="password" onChange={e => setConfirmPassword(e.currentTarget.value)} />
                    </div>

                    <div className="d-flex justify-content-end">
                        <Button type="success" className="filled mt-3" onClick={handleSignup}>Signup</Button>
                    </div>

                    <Button style={{ width: '100%' }} type="link" onClick={gotoLogin}>Already have an account? Login</Button>
                </div>

            </div>
        </div>
    );
};

export default Signup;
