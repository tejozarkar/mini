import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toTitleCase } from '../../util/Utils';
import './../../styles/profile.scss';
import CustomPhoto from './CustomPhoto';

const Profile = () => {
    const { currentUser } = useAuth();
    useEffect(() => {
        console.log(currentUser);
    }, [currentUser])

    return (
        <div className="profile-wrapper p-3">
            <div className="wrap p-4">
                {currentUser && currentUser.photoURL ?
                    <img className="profile-image-sphere" src={currentUser.photoURL} alt="profile" /> :
                    <CustomPhoto />
                }
                <h5 className="mt-3 mb-5">{toTitleCase(currentUser.displayName)}</h5>
                <div>
                    <h6>Email: <span className="text-white-50">{currentUser && currentUser.email}</span></h6>
                    <h6>Last login at: <span className="text-white-50">{currentUser && currentUser.metadata.lastSignInTime}</span></h6>
                </div>
            </div>

        </div >
    )
}

export default Profile
