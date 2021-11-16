import { ArrowLeftOutlined, AudioOutlined, PhoneOutlined, VideoCameraOutlined } from '@ant-design/icons';
import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import { Button, Col, Row } from 'antd';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useConference } from '../../context/ConferenceContext';
import './../../styles/controls.scss';

const Controls = () => {

    const { mainConferenceId, isMini, startVideo, stopVideo } = useConference();
    const [videoEnabled, setVideoEnabled] = useState(false);
    const [microphoneEnabled, setMicrophoneEnabled] = useState(true);

    const history = useHistory();


    const backToMainConference = () => {
        history.push('/conference/' + mainConferenceId);
    }

    const handleStartVideo = () => {
        if (videoEnabled) {
            startVideo(() => setVideoEnabled(true));
        } else {
            stopVideo(() => setVideoEnabled(false));
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

    const handleEndConference = () => {
        VoxeetSDK.conference.leave(VoxeetSDK.session.participant).then(() => {
            // remove(ref(getDatabase(firebase), currentId + '/participants/' + currentUser.uid));
        });
    }


    return (
        <div className="controls-wrapper px-3">
            <Row>
                <Col span={8}>{isMini && <Button type="success" className="back-btn" onClick={backToMainConference}> <ArrowLeftOutlined /> Back to Main Conference</Button>}</Col>
                <Col span={8}>
                    <div className="controls">
                        <button className={`custom-control ${microphoneEnabled ? 'active' : ''}`} onClick={handleMicrophone}><AudioOutlined size="large" style={{ fontSize: '25px' }} /></button>
                        <button className="custom-control danger" onClick={handleEndConference}><PhoneOutlined size="large" style={{ fontSize: '25px' }} /></button>
                        <button className={`custom-control ${videoEnabled ? 'active' : ''}`} onClick={handleStartVideo}><VideoCameraOutlined size="large" style={{ fontSize: '25px' }} /></button>
                    </div>
                </Col>
                <Col span={8}></Col>
            </Row>
        </div>
    )
}

export default Controls
