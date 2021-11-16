import { TeamOutlined } from '@ant-design/icons'
import { Col, Row } from 'antd'
import React, { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useConference } from '../../context/ConferenceContext'
import Controls from './Controls'
import ParticipantCard from './ParticipantCard'
import { addVideoNode } from '../../util/Utils'
import './../../styles/participants-wrapper.scss';

const ParticipantsWrapper = () => {

    const { currentUser } = useAuth();
    const { totalCurrentParticipants, currentParticipants, streamUpdated, streamAdded } = useConference();

    useEffect(() => {
        streamAdded((participant, stream) => {
            if (stream.getVideoTracks().length) {
                addVideoNode(participant, stream);
            }
        });
        streamUpdated((participant, stream) => {
            if (stream.getVideoTracks().length) {
                addVideoNode(participant, stream);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className="conference-wrapper p-3 pt-0">
            <div className="participants-wrapper p-3">
                <p className="participants-count d-flex align-items-center"><TeamOutlined /><span style={{ marginLeft: '5px' }}>{totalCurrentParticipants} Participants</span></p>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={6}>
                        <ParticipantCard key={currentUser.uid} participant={{ id: currentUser.uid, name: 'You', active: true }}></ParticipantCard>
                    </Col>
                    {Object.keys(currentParticipants).map(id => currentUser.uid !== id && currentParticipants[id].active &&
                        <Col span={6}><ParticipantCard key={id} participant={currentParticipants[id]}></ParticipantCard></Col>)}
                </Row>
            </div >
            <Controls />
        </div >

    )
}

export default ParticipantsWrapper
