import { Input, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';

const EditProfile = ({ showEditProfile, setShowEditProfile }) => {

    const [password, setPassword] = useState();
    const [displayName, setDisplayName] = useState();

    const { currentUser, updateUserPassword, updateUserProfile } = useAuth();

    const handleEditProfile = async () => {
        if (password) {
            await updateUserPassword(password);
        }
        if (displayName !== currentUser.displayName) {
            await updateUserProfile(displayName);
        }
        setShowEditProfile(false);
    }

    useEffect(() => {
        setDisplayName(currentUser.displayName);
    }, [currentUser]);

    return (

        <Modal title="Edit profile" okText="Save" visible={showEditProfile} onCancel={() => setShowEditProfile(false)} onOk={handleEditProfile}>
            <div>
                <div className="mt-4 custom-label-wrapper">
                    <label className="custom-label ">Enter your name<span className="text-danger">* </span></label>
                    <Input onChange={(e) => setDisplayName(e.currentTarget.value)} value={displayName} />
                </div>
                <div className="mt-4 custom-label-wrapper">
                    <label className="custom-label " >Enter new password<span className="text-danger">* </span></label>
                    <Input type="password" onChange={e => setPassword(e.currentTarget.value)} />
                </div>
            </div>
        </Modal >

    )
}

export default EditProfile
