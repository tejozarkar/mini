import React from 'react'
import './../styles/participant.scss';

const ParticipantCard = ({ participant }) => {
    return (
        <div className="participant-card p-3 flex" id={`video-container-${participant.id}`}>
            <div className="overlay px-2 py-1">
                {participant.name}
            </div>
        </div>
    )
}

export default ParticipantCard
