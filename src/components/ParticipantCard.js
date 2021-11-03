import React from 'react'
import { Card } from 'react-bootstrap'

const ParticipantCard = ({ participant }) => {
    return (
        <Card id={`video-container-${participant.id}`}>
            <p>{participant.name}</p>
        </Card>
    )
}

export default ParticipantCard
