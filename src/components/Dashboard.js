import Button from '@restart/ui/esm/Button';
import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
    const { currentUser, logout } = useAuth();
    const history = useHistory();

    const [conferenceName, setConferenceName] = useState('');

    useEffect(() => {
        VoxeetSDK.conference.on('streamAdded', (participant, stream) => {
            if (stream.type === 'ScreenShare') return;
            addParticipantNode(participant);
            if (stream.getVideoTracks().length) {
                addVideoNode(participant, stream);
            }
        })
        VoxeetSDK.conference.on('streamUpdated', (participant, stream) => {
            if (stream.type === 'ScreenShare') return;
            addParticipantNode(participant);
            if (stream.getVideoTracks().length) {
                addVideoNode(participant, stream);
            }
        });
    }, []);


    const handleLogout = async () => {
        try {
            await logout();
            history.push('/login');
        } catch {

        }
    }

    const handleCreateConference = async () => {
        await VoxeetSDK.session.open({ name: currentUser.email })
        VoxeetSDK.conference.create({ alias: conferenceName })
            .then(conference => {
                VoxeetSDK.conference.join(conference, {})
                    .then()
            })
    }

    const handleStartVideo = () => {
        VoxeetSDK.conference.startVideo(VoxeetSDK.session.participant)
            .then();
    }

    const addVideoNode = (participant, stream) => {
        console.log('adding video node)')
        let videoNode = document.getElementById('video-' + participant.id);
        if (!videoNode) {
            console.log('createing video nodee')
            videoNode = document.createElement('video');
            videoNode.setAttribute('id', 'video-' + participant.id);
            videoNode.setAttribute('height', 240);
            videoNode.setAttribute('width', 320);
            videoNode.setAttribute("playsinline", true);
            videoNode.muted = true;
            videoNode.setAttribute("autoplay", 'autoplay');

            const videoContainer = document.getElementById('video-container');
            videoContainer.appendChild(videoNode);
        }
        navigator.attachMediaStream(videoNode, stream);
    }

    const addParticipantNode = (participant) => {
        let participantNode = document.getElementById('participant-' + participant.info.name);
        if (!participantNode) {
            const participantContainer = document.getElementById('participant-list');
            participantNode = document.createElement('li');
            participantNode.innerText = participant.info.name;
            participantNode.setAttribute('id', 'participant-' + participant.info.name);
            participantContainer.append(participantNode);
        }
    }

    return (
        <>
            <h3> Welcome {currentUser && currentUser.email} </h3>
            <Button className="btn btn-default" onClick={handleLogout}>Logout</Button>
            <input type="text" onChange={(e) => setConferenceName(e.target.value)}></input>
            <Button className="btn btn-primary" onClick={handleCreateConference}>Create Conference</Button>
            <Button className="btn btn-success" onClick={handleStartVideo}>Start Video</Button>
            <div id="video-container"></div>
            <div id='participant-list'>

            </div>
        </>
    )
}

export default Dashboard
