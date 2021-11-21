import React from 'react'
import { useAuth } from '../../context/AuthContext';
import { changeColorContrast, getAlphabetColor, toTitleCase } from '../../util/Utils';

const CustomPhoto = () => {



    const { currentUser } = useAuth();

    return (
        <>
            {currentUser &&
                <div className="profile-image-sphere custom" style={{
                    background: getAlphabetColor(toTitleCase(currentUser.displayName)[0]),
                    border: '6px solid ' + changeColorContrast(getAlphabetColor(toTitleCase(currentUser.displayName)[0]), -20)
                }}>
                    {currentUser && toTitleCase(currentUser.displayName)[0]}
                </div>}
        </>
    )
}

export default CustomPhoto
