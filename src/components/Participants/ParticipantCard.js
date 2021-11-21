import React from 'react'
import { getAlphabetColor, toTitleCase } from '../../util/Utils';
import './../../styles/participant-card.scss';

const ParticipantCard = ({ participant }) => {
    return (
        <div className="participant-card p-3 m-auto d-flex justify-content-center align-items-center" style={{ background: getAlphabetColor(participant.name[0]) }} id={`video-container-${participant.id}`}>
            <p style={{ marginBottom: '0', fontSize: '2em' }}>{toTitleCase(participant.name)}</p>
            <div className="overlay px-2 py-1">
                {toTitleCase(participant.name)}
            </div>
        </div>
    )
}

export default ParticipantCard
