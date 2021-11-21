import React from 'react'
import './../../styles/participant.scss';

const Participant = ({ participant }) => {
    return (
        <div className="participant-wrapper p-3 mb-2 border w-100">
            {participant.name}
        </div>
    )
}

export default Participant
