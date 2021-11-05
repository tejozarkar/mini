import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ParticipantCard from './ParticipantCard';
import './../styles/conference.scss';
import { Button, Input, Modal } from 'antd';
import MiniConference from './MiniConference';

const Conference = () => {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const [participants, setParticipants] = useState({});
    const [currentConference, setCurrentConference] = useState();
    const [mainConference, setMainConference] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [miniName, setMiniName] = useState();
    const [miniList, setMiniList] = useState([]);
    useEffect(() => {
        VoxeetSDK.session.open({ name: currentUser.displayName, externalId: currentUser.uid }).then().catch(e => console.log(e))
            .finally(() => {
                VoxeetSDK.conference.fetch(id)
                    .then(conference => {
                        VoxeetSDK.conference.join(conference, {})
                            .then(() => {
                                setCurrentConference(conference);
                                setMainConference(conference);
                            }).catch();
                    }).catch();
            });
    }, [currentUser, id]);

    useEffect(() => {
        VoxeetSDK.conference.on('streamAdded', (participant, stream) => {
            setParticipants(participants => ({ ...participants, [participant.info.externalId]: { id: participant.info.externalId, name: participant.info.name, active: true } }));
            if (stream.getVideoTracks().length) {
                addVideoNode(participant, stream);
            }
        });
        VoxeetSDK.conference.on('streamUpdated', (participant, stream) => {
            setParticipants(participants => ({ ...participants, [participant.info.externalId]: { id: participant.info.externalId, name: participant.info.name, active: true } }));
            if (stream.getVideoTracks().length) {
                addVideoNode(participant, stream);
            }
        });
        VoxeetSDK.conference.on('streamRemoved', (participant, stream) => {
            setParticipants(participants => ({ ...participants, [participant.info.externalId]: { id: participant.info.externalId, name: participant.info.name, active: false } }));
        });
    }, []);

    const addVideoNode = (participant, stream) => {
        let participantVideoNode = document.getElementById(`participant-${participant.info.externalId}`);
        if (!participantVideoNode) {
            participantVideoNode = document.createElement('video');
            participantVideoNode.setAttribute('id', 'video-' + participant.id);
            participantVideoNode.setAttribute('height', 240);
            participantVideoNode.setAttribute('width', 320);
            participantVideoNode.setAttribute("playsinline", true);
            participantVideoNode.muted = true;
            participantVideoNode.setAttribute("autoplay", 'autoplay');
            const participantContainer = document.getElementById(`video-container-${participant.info.externalId}`);
            console.log(participantContainer);
            if (participantContainer) {
                participantContainer.appendChild(participantVideoNode);
            }
        }
        navigator.attachMediaStream(participantVideoNode, stream);
    }

    const handleStartVideo = () => {
        VoxeetSDK.conference.startVideo(VoxeetSDK.session.participant).then();
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        const conferenceParams = {
            ttl: 20000
        }
        VoxeetSDK.conference.create({ alias: 'mini|' + miniName + '|' + mainConference.id, params: conferenceParams })
            .then(minispace => {
                setMiniList(miniList => [...miniList, minispace]);
            });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const joinMini = (mini) => {
        VoxeetSDK.conference.join(mini, {})
            .then(() => {
                setCurrentConference(mini);
            }).catch(e => console.log(e));
    }

    return (
        <div>
            {currentConference && currentConference.alias.split('|')[1]}
            <Button type="primary" onClick={handleStartVideo}>Start Video</Button>
            <div className="participants-wrap d-flex">
                {Object.keys(participants).map(id => participants[id].active && <ParticipantCard key={id} participant={participants[id]}></ParticipantCard>)}
            </div>
            <Button type="primary" onClick={showModal}>
                Open Modal
            </Button>
            <Modal title="Create MiniSpace" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Input size="large" placeholder="Enter name" onChange={e => setMiniName(e.target.value)}></Input>
            </Modal>
            {miniList.map((mini) => <MiniConference key={mini.alias} mini={mini} joinMini={() => joinMini(mini)}></MiniConference>)}
        </div>
    )
}

export default Conference
