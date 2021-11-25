import { TeamOutlined } from '@ant-design/icons'
import { Button, Col, Drawer, notification, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useConference } from '../../context/ConferenceContext'
import Controls from './Controls'
import ParticipantCard from './ParticipantCard'
import { addVideoNode, removeVideoNode } from '../../util/Utils'
import './../../styles/participants-wrapper.scss';
import ParticipantList from './ParticipantList'

const ParticipantsWrapper = () => {

    const { currentUser } = useAuth();
    const { allParticipants, totalCurrentParticipants, currentParticipants, streamUpdated, streamAdded, streamRemoved, isMini, currentConference } = useConference();
    const [visibleParticipants, setVisibleParticipants] = useState({});
    const [showParticipantList, setShowParticipantList] = useState(false);

    useEffect(() => {
        streamAdded((participant, stream) => {
            if (stream.getVideoTracks().length) {
                addVideoNode(participant, stream);
            }
        });
        streamUpdated((participant, stream) => {

            if (stream.getVideoTracks().length) {
                addVideoNode(participant, stream);

            } else {
                removeVideoNode(participant);
            }
        });
        streamRemoved((participant, stream) => {
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (currentParticipants) {
            setVisibleParticipants({});
            Object.keys(currentParticipants).forEach((key) => {
                if (currentParticipants[key].id !== currentUser.uid && currentParticipants[key].active && Object.keys(currentParticipants).length <= 6) {
                    setVisibleParticipants(visibleParticipants => ({ ...visibleParticipants, [key]: currentParticipants[key] }));
                }
            });
        } else {
            setVisibleParticipants({});
        }
    }, [currentParticipants, currentUser]);

    const handleCopyInviteLink = () => {
        navigator.clipboard.writeText(currentConference.id);
        notification.open({
            description:
                `Conference Id copied to clipboard`

        });
    }


    return (
        <div className="conference-wrapper p-3 pt-0">
            <div className="participants-wrapper p-3">
                <div className="d-flex justify-content-between">
                    <p className="participants-count d-flex align-items-center"><TeamOutlined /><span style={{ marginLeft: '5px' }}>{totalCurrentParticipants} Participants</span></p>
                    <Button type="success" onClick={handleCopyInviteLink}>Copy Conference ID</Button>
                </div>
                <div className="mb-4">
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col span={6}>
                            <ParticipantCard key={currentUser.uid} userId={currentUser.uid} participant={{ id: currentUser.uid, name: 'You', active: true }}></ParticipantCard>
                        </Col>
                        {Object.keys(visibleParticipants).map((id) => currentUser.uid !== id && visibleParticipants[id].active &&
                            <Col span={6}><ParticipantCard key={id} userId={id} participant={visibleParticipants[id]}></ParticipantCard></Col>)}
                    </Row>
                </div>
                <Button className="view-all-participants-btn" type="default" onClick={() => setShowParticipantList(true)}> View all participants</Button>
            </div >
            <Controls />

            <Drawer
                title="Participants"
                placement="left"
                closable={true}
                visible={showParticipantList}
                onClose={() => setShowParticipantList(false)}
                size="Large"
                key="participantListDrawer">
                {isMini ?
                    currentParticipants && Object.keys(currentParticipants).map(key => <ParticipantList userId={key} key={key} participant={currentParticipants[key]} />) :
                    allParticipants && Object.keys(allParticipants).map(key => <ParticipantList userId={key} key={key} participant={allParticipants[key]} />)
                }
            </Drawer>
        </div >

    )
}

export default ParticipantsWrapper
