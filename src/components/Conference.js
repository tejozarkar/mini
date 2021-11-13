import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ParticipantCard from './ParticipantCard';
import './../styles/conference.scss';
import { Button, Col, Input, Modal, notification, Row } from 'antd';
import MiniConference from './MiniConference';
import { AudioOutlined, PhoneOutlined, TeamOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import Header from './Header';
import { getDatabase, onValue, ref, remove, set, update } from '@firebase/database';
import firebase from '../service/firebase';

const Conference = () => {
    const { id, mId } = useParams();
    const { currentUser } = useAuth();
    const [participants, setParticipants] = useState({});
    const [mainConferenceParticipants, setMainConferenceParticipants] = useState({});
    const [currentConference, setCurrentConference] = useState();
    const [mainConference, setMainConference] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [miniName, setMiniName] = useState();
    const [miniList, setMiniList] = useState();
    const [videoEnabled, setVideoEnabled] = useState(false);
    const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
    const history = useHistory();
    const [currentTab, setCurrentTab] = useState(0);
    const [isMini, setIsMini] = useState(false);
    const [currentId, setCurrentId] = useState();
    const [invites, setInvites] = useState();
    const [isAdmin, setIsAdmin] = useState(false);
    const [totalCurrentParticipants, setTotalCurrentParticipants] = useState(0);

    useEffect(() => {
        if (mainConference) {
            onValue(ref(getDatabase(firebase), mainConference.id + '/admins'), (snapshot) => {
                Object.keys(snapshot.val()).map(key => {
                    if (currentUser.uid === key) {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                    }
                });
                console.log('*admins', snapshot.val());
            });
        }
    }, [mainConference, currentUser])

    useEffect(() => {
        if (mainConference) {
            onValue(ref(getDatabase(firebase), mainConference.id + '/mini'), (snapshot) => {
                setMiniList(snapshot.val());
            });
            onValue(ref(getDatabase(firebase), mainConference.id + '/participants'), (snapshot) => {
                setParticipants(snapshot.val());
            });
        }
    }, [mainConference]);

    useEffect(() => {
        if (currentUser && mainConference) {
            onValue(ref(getDatabase(firebase), mainConference.id + '/participants/' + currentUser.uid + '/invites'), (snapshot) => {
                if (snapshot && snapshot.val()) {
                    setInvites(snapshot.val());
                }
            });
        }
    }, [currentUser, mainConference]);

    useEffect(() => {
        if (invites) {
            Object.keys(invites).forEach(key => {
                if (invites[key].status === 'NEW') {
                    updateInvite(invites[key], key);
                    openInviteNotification(invites[key].name.split('|')[1], key);
                    set(ref(getDatabase(firebase), currentId + '/participants/' + currentUser.uid + '/invites/' + key), {
                        name: invites[key].name,
                        status: 'PENDING'
                    });
                }
            });
        }
    }, [invites, currentId, currentUser])

    useEffect(() => {
        if (mId) {
            setIsMini(true);
            setCurrentId(mId);
        } else {
            setIsMini(false);
            setCurrentId(id);
        }
    }, [id, mId]);

    const updateInvite = (invite, key) => {

    }

    useEffect(() => {
        if (currentId) {
            VoxeetSDK.session.open({ name: currentUser.displayName, externalId: currentUser.uid }).then().catch(e => { })
                .finally(() => {
                    VoxeetSDK.conference.fetch(currentId)
                        .then(conference => {
                            VoxeetSDK.conference.join(conference, {})
                                .then(() => {
                                    setCurrentConference(conference);
                                    if (!isMini) {
                                        setMainConference(conference);
                                    }
                                }).catch();
                        }).catch();
                });
        }
    }, [currentUser, currentId, isMini]);

    useEffect(() => {
        if (mainConference) {
            update(ref(getDatabase(firebase), mainConference.id + '/participants'), {
                [currentUser.uid]: {
                    name: currentUser.displayName
                }
            });
        }
    }, [mainConference, currentUser])

    useEffect(() => {
        let total = 0;
        Object.keys(mainConferenceParticipants).map(key =>
            mainConferenceParticipants[key].active &&
            total++
        );
        setTotalCurrentParticipants(total);

    }, [mainConferenceParticipants]);

    useEffect(() => {
        VoxeetSDK.conference.on('streamAdded', (participant, stream) => {
            setMainConferenceParticipants(participants => ({ ...participants, [participant.info.externalId]: { id: participant.info.externalId, name: participant.info.name, active: true } }));

            if (stream.getVideoTracks().length) {
                addVideoNode(participant, stream);
            }
        });
        VoxeetSDK.conference.on('streamUpdated', (participant, stream) => {
            setMainConferenceParticipants(participants => ({ ...participants, [participant.info.externalId]: { id: participant.info.externalId, name: participant.info.name, active: true } }));

            if (stream.getVideoTracks().length) {
                addVideoNode(participant, stream);
            }
        });
        VoxeetSDK.conference.on('streamRemoved', (participant, stream) => {
            setMainConferenceParticipants(participants => ({ ...participants, [participant.info.externalId]: { id: participant.info.externalId, name: participant.info.name, active: false } }));

        });
    }, []);

    const addVideoNode = (participant, stream) => {
        let participantVideoNode = document.getElementById(`participant-${participant.info.externalId}`);
        if (!participantVideoNode) {
            participantVideoNode = document.createElement('video');
            participantVideoNode.setAttribute('id', 'video-' + participant.id);
            participantVideoNode.setAttribute('height', '100%');
            participantVideoNode.setAttribute('width', '100%');
            participantVideoNode.setAttribute("playsinline", true);
            participantVideoNode.muted = true;
            participantVideoNode.setAttribute("autoplay", 'autoplay');
            const participantContainer = document.getElementById(`video-container-${participant.info.externalId}`);
            if (participantContainer) {
                participantContainer.appendChild(participantVideoNode);
            }
        }
        navigator.attachMediaStream(participantVideoNode, stream);
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
            remove(ref(getDatabase(firebase), currentId + '/participants/' + currentUser.uid));
            history.push('/');
        });
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
                update(ref(getDatabase(firebase), currentId + '/mini'), {
                    [minispace.id]: {
                        name: minispace.alias
                    }
                });
            });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const joinMini = (id) => {
        VoxeetSDK.conference.leave(VoxeetSDK.session.participant).then(() => {
            history.push(history.location.pathname + '/mini/' + id);
        });
    }

    const titleCase = (str) => {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    const inviteUsers = (ids, miniId, name) => {
        ids.forEach(id => {
            update(ref(getDatabase(firebase), currentId + '/participants/' + id + '/invites'), {
                [miniId]: {
                    name,
                    status: 'NEW'
                }
            });
        });
    }


    const openInviteNotification = (name, id) => {
        const key = `open${Date.now()}`;
        const btn = (
            <Button type="primary" size="small" onClick={() => { notification.close(key); joinMini(id); }}>
                Join
            </Button>
        );
        notification.open({
            message: 'Invitation',
            description:
                `You have new invite to join ${name}`,
            btn,
            key
        });
    };

    const backToMainConference = () => {
        history.push(`/conference/${id}`);
    }

    return (
        <>
            <Header conferenceName={currentConference && titleCase(currentConference.alias.split('|')[1])} />
            <Row>
                <Col span={16}>
                    <div className="conference-wrapper p-3 pt-0">
                        <div className="participants-wrapper p-3">
                            <p className="participants-count d-flex align-items-center"><TeamOutlined /><span style={{ marginLeft: '5px' }}>{totalCurrentParticipants} Participants</span></p>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col span={6}><ParticipantCard key={currentUser.uid} participant={{ id: currentUser.uid, name: 'You', active: true }}></ParticipantCard> </Col>
                                {Object.keys(mainConferenceParticipants).map(id => currentUser.uid !== id && mainConferenceParticipants[id].active
                                    && <Col span={6}><ParticipantCard key={id} participant={mainConferenceParticipants[id]}></ParticipantCard></Col>)}
                            </Row>

                            <div className="controls py-3 px-3">
                                <Button type="primary" onClick={backToMainConference}> Back to Main Conference</Button>
                                <button className={`custom-control ${microphoneEnabled ? 'active' : ''}`} onClick={handleMicrophone}><AudioOutlined size="large" style={{ fontSize: '25px' }} /></button>
                                <button className="custom-control danger" onClick={endConference}><PhoneOutlined size="large" style={{ fontSize: '25px' }} /></button>
                                <button className={`custom-control ${videoEnabled ? 'active' : ''}`} onClick={handleStartVideo}><VideoCameraOutlined size="large" style={{ fontSize: '25px' }} /></button>
                            </div>
                        </div >
                    </div >
                </Col>
                <Col span={8}>
                    <div className="right-panel p-3">
                        {isAdmin &&
                            <div className="tab-buttons mb-5">
                                <button onClick={() => setCurrentTab(0)} className={`tab-button task-button-1 ${currentTab === 0 && 'active'}`}>
                                    Mini Conferences
                                </button>
                                <button onClick={() => setCurrentTab(1)} className={`tab-button task-button-2 ${currentTab === 1 && 'active'}`}>
                                    chat
                                </button>
                            </div>
                        }
                        {isAdmin && currentTab === 0 &&
                            <div>
                                {!isMini &&
                                    <Button type="success" className="mb-3 float-end mt-3" onClick={showModal}>
                                        + New
                                    </Button>
                                }
                                <div className="clearfix"></div>
                                <Row gutter={{ xs: 8, sm: 16, md: 16, lg: 16 }}>
                                    {miniList && Object.keys(miniList).map(id =>
                                        <Col span={12}>
                                            <MiniConference key={id} currentUser={currentUser}
                                                participants={participants} name={miniList[id].name}
                                                inviteUsers={(ids) => inviteUsers(ids, id, miniList[id].name)} joinMini={() => joinMini(id)}>
                                            </MiniConference>
                                        </Col>)}
                                    {/* {miniList.map((mini) => )} */}
                                </Row>
                            </div>
                        }
                        <Modal title="Create MiniSpace" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                            <Input size="large" placeholder="Enter name" onChange={e => setMiniName(e.target.value)}></Input>
                        </Modal>
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default Conference
