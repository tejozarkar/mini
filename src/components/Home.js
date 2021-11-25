import { Button, Col, Input, Row } from 'antd';
import React, { useState } from 'react'
import { useConference } from '../context/ConferenceContext';
import { useDatabase } from '../context/DatabaseContext';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './../styles/home.scss';
import Header from './Header';
import Profile from './Profile/Profile';
import { CalendarOutlined, EditOutlined, PlusOutlined, ShareAltOutlined } from '@ant-design/icons';
import EditProfile from './Profile/EditProfile';
import { hideLoader, showLoader } from '../util/Utils';

const Home = () => {

    const { createConference } = useConference();
    const { insertMainConference } = useDatabase();
    const { currentUser } = useAuth();
    const [conferenceName, setConferenceName] = useState('');
    const [conferenceId, setConferenceId] = useState('');
    const [showEditProfile, setShowEditProfile] = useState(false);

    const history = useHistory();

    const handleCreateConference = async () => {
        showLoader();
        const conference = await createConference(currentUser.uid + '|' + conferenceName, { ttl: 1000 }, currentUser);
        insertMainConference(conference.id, conference.alias, currentUser);
        hideLoader();
        history.push('/conference/' + conference.id);
    }

    const handleJoinConference = () => {
        history.push('/conference/' + conferenceId);
    }

    return (
        <>
            <Header />
            <Row>
                <Col span={8}>
                    <Profile />
                </Col>
                <Col span={16}>
                    <div className="home-wrapper p-3">
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col span={12}>
                                <div className="create-or-join-wrapper p-4 text-center">
                                    <PlusOutlined style={{ fontSize: '4em' }} />
                                    <h5 className="mt-2">Create a new conference</h5>
                                    <div className="custom-label-wrapper mt-4">
                                        <label className="custom-label primary">Enter conference name</label>
                                        <Input className="mb-3" type='text' onChange={(e) => setConferenceName(e.target.value)} />
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <Button type="success filled" onClick={handleCreateConference}>Create</Button>
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="create-or-join-wrapper p-4 text-center">
                                    <ShareAltOutlined style={{ fontSize: '4em' }} />
                                    <h5 className="mt-2">Join existing conference</h5>
                                    <div className="custom-label-wrapper mt-4">
                                        <label className="custom-label primary">Enter conference ID</label>
                                        <Input className="mb-3" type='text' onChange={(e) => setConferenceId(e.target.value)} />
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <Button type="default filled" onClick={handleJoinConference}>Join</Button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col span={8}>
                            <div className="p-3" onClick={() => setShowEditProfile(true)}>
                                <div className="card cursor-pointer p-4 d-flex justify-content-center align-items-center">
                                    <br />
                                    <EditOutlined style={{ fontSize: '4em' }} />
                                    <p className="mt-3 text-white-50"> Edit Profile</p>

                                </div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="p-3">
                                <div className="card cursor-pointer p-4 d-flex justify-content-center align-items-center">
                                    <CalendarOutlined style={{ fontSize: '4em' }} />
                                    <p className="mt-3 text-white-50 text-center"> Schedule conference<br /><small>coming soon</small></p>
                                </div>
                            </div>
                        </Col>
                    </Row>

                </Col>
            </Row>
            <EditProfile showEditProfile={showEditProfile} setShowEditProfile={setShowEditProfile} />
        </>

    )
}

export default Home
