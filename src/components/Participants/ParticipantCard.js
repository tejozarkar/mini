import React from 'react'
import { useConference } from '../../context/ConferenceContext';
import { getAlphabetColor, toTitleCase } from '../../util/Utils';
import { Tag } from 'antd';
import './../../styles/participant-card.scss';

const ParticipantCard = ({ participant, userId }) => {
    const { admins } = useConference();

    return (
        <>
            {participant &&
                <div className="participant-card mb-3 p-3 m-auto d-flex justify-content-center align-items-center" style={{ background: (participant && participant.name) ? getAlphabetColor(participant.name[0]) : '#63B4B8' }} id={`video-container-${participant.id}`}>
                    <p style={{ marginBottom: '0', fontSize: '2em' }}>{toTitleCase(participant.name)}</p>
                    <div className="overlay px-2 py-1">
                        {toTitleCase(participant.name)}
                    </div>
                    {admins && admins.hasOwnProperty(userId) && <Tag color="#87d068" className="border admin-tag">Admin</Tag>}
                </div>
            }
        </>
    )
}

export default ParticipantCard
