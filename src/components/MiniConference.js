import React from 'react'

const MiniConference = ({ mini, joinMini }) => {
    return (
        <div onClick={joinMini}>
            {mini.alias.split('|')[1]}
        </div>
    )
}

export default MiniConference
