import { ArrowLeftOutlined, AudioOutlined, LoadingOutlined, PhoneOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useConference } from '../../context/ConferenceContext';
import { useDatabase } from '../../context/DatabaseContext';
import './../../styles/controls.scss';

const Controls = () => {

    const { mainConferenceId, isMini, startVideo, stopVideo, startMicrophone, stopMicrophone, leaveConference, currentConference } = useConference();
    const { deleteParticipant, wave } = useDatabase();
    const [videoEnabled, setVideoEnabled] = useState(false);
    const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
    const [disableVideoBtn, setDisableVideoBtn] = useState(false);
    const [disableMicrophoneBtn, setDisableMicrophoneBtn] = useState(false);
    const [disableEndCallBtn, setDisableEndCallBtn] = useState(false);
    const { currentUser } = useAuth();

    const history = useHistory();


    const backToMainConference = () => {
        leaveConference(() => {
            deleteParticipant(mainConferenceId, currentUser.uid, currentConference.id);
            history.push(`/conference/${mainConferenceId}`);
            history.push('/conference/' + mainConferenceId);
        });

    }

    const handleStartVideo = async () => {
        setDisableVideoBtn(true);
        if (videoEnabled) {
            stopVideo(() => {
                setDisableVideoBtn(false);
                setVideoEnabled(false);
            });
        } else {
            startVideo(() => {
                setDisableVideoBtn(false);
                setVideoEnabled(true);
            });
        }
    }

    const handleMicrophone = () => {
        setDisableMicrophoneBtn(true);
        if (microphoneEnabled) {
            stopMicrophone(() => {
                setDisableMicrophoneBtn(false);
                setMicrophoneEnabled(false);
            });
        } else {
            startMicrophone(() => {
                setDisableMicrophoneBtn(false);
                setMicrophoneEnabled(true);
            });
        }
    }

    const handleEndConference = () => {
        setDisableEndCallBtn(true);
        leaveConference(() => {
            setDisableEndCallBtn(false);
            if (isMini) {
                deleteParticipant(mainConferenceId, currentUser.uid, currentConference.id);
                history.push(`/conference/${mainConferenceId}`);
            } else {
                deleteParticipant(mainConferenceId, currentUser.uid, null);
                history.push('/');
            }
        });
    }

    const waveToAdmin = () => {
        wave(mainConferenceId, currentConference.id, currentUser.uid, currentUser.displayName);
    }


    return (
        <div className="controls-wrapper px-3">
            <Row>
                <Col span={8}>{isMini && <Button type="success" className="back-btn" onClick={backToMainConference}> <ArrowLeftOutlined /> Back to Main Conference</Button>}</Col>
                <Col span={8}>
                    <div className="controls">
                        <button className={`custom-control ${microphoneEnabled ? 'active' : ''}`} onClick={handleMicrophone} disabled={disableMicrophoneBtn}>
                            {disableMicrophoneBtn ? <LoadingOutlined style={{ fontSize: '25px' }} /> :
                                <AudioOutlined size="large" style={{ fontSize: '25px' }} />}
                        </button>
                        <button className="custom-control danger" onClick={handleEndConference} disabled={disableEndCallBtn}>
                            {disableEndCallBtn ? <LoadingOutlined style={{ fontSize: '25px' }} /> :
                                <PhoneOutlined size="large" style={{ fontSize: '25px' }} />}
                        </button>
                        <button className={`custom-control ${videoEnabled ? 'active' : ''}`} onClick={handleStartVideo} disabled={disableVideoBtn}>
                            {disableVideoBtn ? <LoadingOutlined style={{ fontSize: '25px' }} /> :
                                <VideoCameraOutlined size="large" style={{ fontSize: '25px' }} />}
                        </button>
                    </div>
                </Col>
                <Col span={8}>{isMini && <Button type="default" className="back-btn" onClick={waveToAdmin}> Wave to admin</Button>}</Col>
            </Row>
        </div>
    )
}

export default Controls
