import React from 'react'
import { useConference } from '../../context/ConferenceContext';
import { getAlphabetColor, toTitleCase } from '../../util/Utils';
import { Tag } from 'antd';
import './../../styles/participant-card.scss';

const ParticipantCard = ({ participant, userId }) => {
    const { admins } = useConference();

    return (
        <div className="participant-card p-3 m-auto d-flex justify-content-center align-items-center" style={{ background: getAlphabetColor(participant.name[0]) }} id={`video-container-${participant.id}`}>
            <p style={{ marginBottom: '0', fontSize: '2em' }}>{toTitleCase(participant.name)}</p>
            <div className="overlay px-2 py-1">
                {toTitleCase(participant.name)}
            </div>
            {admins && admins.hasOwnProperty(userId) && <Tag color="#87d068" className="border admin-tag">Admin</Tag>}
        </div>
    )
}

export default ParticipantCard
