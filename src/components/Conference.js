import Button from '@restart/ui/esm/Button';
import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ParticipantCard from './ParticipantCard';

const Conference = () => {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const [participants, setParticipants] = useState({});

    useEffect(() => {
        VoxeetSDK.session.open({ name: currentUser.displayName, externalId: currentUser.uid }).then().catch(e => console.log(e))
            .finally(() => {
                VoxeetSDK.conference.fetch(id)
                    .then(conference => {
                        VoxeetSDK.conference.join(conference, {})
                            .then(() => {
                                console.log('Joined')
                            }).catch(e => console.log(e));
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

    return (
        <div>
            <Button className="btn btn-primary" onClick={handleStartVideo}>Start Video</Button>
            {Object.keys(participants).map(id => participants[id].active && <ParticipantCard participant={participants[id]}></ParticipantCard>)}
        </div>
    )
}

export default Conference
