import React from 'react'
import './../styles/participant.scss';

const ParticipantCard = ({ participant }) => {
    return (
        <div className="participant-card p-3 flex" id={`video-container-${participant.id}`}>
            <p>{participant.name}</p>
        </div>
    )
}

export default ParticipantCard
