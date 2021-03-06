import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { Button, Col, notification, Row } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import Header from './Header';
import RightPanel from './RightPanel/RightPanel';
import { useConference } from '../context/ConferenceContext';
import { useDatabase } from '../context/DatabaseContext';
import ParticipantsWrapper from './Participants/ParticipantsWrapper';
import MiniConference from './RightPanel/MiniConference';
import { hideLoader, showLoader, toTitleCase } from '../util/Utils';
import { ArrowLeftOutlined, WarningOutlined } from '@ant-design/icons';
import './../styles/conference.scss';

const Conference = () => {
    const history = useHistory();
    const { currentUser } = useAuth();
    const { getConferenceById, setMainConferenceId, joinConference, isAdmin, leaveConference, mainConferenceId, currentConference } = useConference();
    const { getInvites, updateInvite } = useDatabase();
    const [invites, setInvites] = useState();
    const [conferenceNotExists, setConferenceNotExists] = useState(false);
    const { id, mId } = useParams();

    // Receive Invites
    useEffect(() => {
        if (currentUser && mainConferenceId) {
            getInvites(mainConferenceId, currentUser.uid, snapshot => {
                if (snapshot && snapshot.val()) {
                    setInvites(snapshot.val());
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, mainConferenceId]);

    // Send Invite Notification
    useEffect(() => {
        if (invites && currentUser) {
            Object.keys(invites).forEach(key => {
                if (invites[key].status === 'NEW') {
                    openInviteNotification(invites[key].name.split('|')[1], key);
                    updateInvite(mainConferenceId, currentUser.uid, key, invites[key].name);
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [MiniConference, currentUser, invites])

    // Join Conference
    useEffect(() => {
        if (id || mId) {
            showLoader();
            const processConference = async () => {
                try {
                    const conference = await getConferenceById(mId ? mId : id);
                    if (conference) {
                        setConferenceNotExists(false);
                        setMainConferenceId(id);
                        await joinConference(conference, mId ? true : false);

                    }
                } catch (e) {
                    setConferenceNotExists(true);
                } finally {
                    hideLoader();
                }
            }
            processConference();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, mId]);

    const joinMini = async (id) => {
        showLoader();
        await leaveConference();
        hideLoader();
        history.push(`/conference/${mainConferenceId}/mini/${id}`);
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

    const handleBackHome = () => {
        history.push('/');
    }

    return (
        <>
            <Header conferenceName={currentConference && toTitleCase(currentConference.alias.split('|')[1])} />
            {conferenceNotExists ?
                <div className="no-conference-wrap d-flex align-items-center justify-content-center flex-column">
                    <WarningOutlined className="warning-icon mb-3" />
                    <h5 className="mb-4">Conference doesn't exists</h5>
                    <Button type="default filled" onClick={handleBackHome}> <ArrowLeftOutlined />Back to Home</Button>
                </div> :
                currentConference &&
                <>

                    <Row>
                        <Col span={16}>
                            <ParticipantsWrapper />
                        </Col>
                        <Col span={8}>
                            <RightPanel isAdmin={isAdmin} />
                        </Col>
                    </Row>
                </>
            }
        </>
    )
}

export default Conference
