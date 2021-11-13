import { AudioOutlined, PhoneOutlined, VideoCameraOutlined } from '@ant-design/icons';
import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import { Button } from 'antd';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useConference } from '../../context/ConferenceContext';
import './../../styles/controls.scss';

const Controls = () => {

    const { mainConference } = useConference();
    const [videoEnabled, setVideoEnabled] = useState(false);
    const [microphoneEnabled, setMicrophoneEnabled] = useState(true);

    const history = useHistory();


    const backToMainConference = () => {
        history.push('/conference/' + mainConference.id);
    }

    const handleStartVideo = () => {
        if (videoEnabled) {
            VoxeetSDK.conference.stopVideo(VoxeetSDK.session.participant).then(() => {
                setVideoEnabled(false);
            });
        } else {
            VoxeetSDK.conference.startVideo(VoxeetSDK.session.participant).then(() => {
                setVideoEnabled(true);
            });
        }
    }

    const handleMicrophone = () => {
        if (microphoneEnabled) {
            VoxeetSDK.conference.stopAudio(VoxeetSDK.session.participant).then(() => {
                setMicrophoneEnabled(false);
            });
        } else {
            VoxeetSDK.conference.startAudio(VoxeetSDK.session.participant).then(() => {
                setMicrophoneEnabled(true);
            });
        }
    }

    const endConference = () => {
        VoxeetSDK.conference.leave(VoxeetSDK.session.participant).then(() => {
            // remove(ref(getDatabase(firebase), currentId + '/participants/' + currentUser.uid));
        });
    }


    return (
        <div className="controls py-3 px-3">
            <Button type="primary" onClick={backToMainConference}> Back to Main Conference</Button>
            <button className={`custom-control ${microphoneEnabled ? 'active' : ''}`} onClick={handleMicrophone}><AudioOutlined size="large" style={{ fontSize: '25px' }} /></button>
            <button className="custom-control danger" onClick={endConference}><PhoneOutlined size="large" style={{ fontSize: '25px' }} /></button>
            <button className={`custom-control ${videoEnabled ? 'active' : ''}`} onClick={handleStartVideo}><VideoCameraOutlined size="large" style={{ fontSize: '25px' }} /></button>
        </div>
    )
}

export default Controls
