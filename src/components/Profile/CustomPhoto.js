import React from 'react'
import { useAuth } from '../../context/AuthContext';
import { getAlphabetColor, toTitleCase } from '../../util/Utils';

const CustomPhoto = () => {



    const { currentUser } = useAuth();

    return (
        <>
            {currentUser &&
                <div className="profile-image-sphere custom" style={{ background: getAlphabetColor(toTitleCase(currentUser.displayName)[0]) }}>
                    {currentUser && toTitleCase(currentUser.displayName)[0]}
                </div>}
        </>
    )
}

export default CustomPhoto
