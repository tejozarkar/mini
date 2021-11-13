import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Col, notification, Row } from 'antd';
import { useHistory } from 'react-router-dom';
import Header from './Header';
import RightPanel from './RightPanel/RightPanel';
import { useConference } from '../context/ConferenceContext';
import { useDatabase } from '../context/DatabaseContext';
import ParticipantsWrapper from './Participants/ParticipantsWrapper';
import MiniConference from './RightPanel/MiniConference';
import { toTitleCase } from '../util/Utils';

const Conference = () => {
    const history = useHistory();
    const { id, mId } = useParams();
    const { currentUser } = useAuth();
    const { getConferenceById, joinConference, isAdmin, leaveConference, mainConference } = useConference();
    const { getInvites, updateInvite } = useDatabase();
    const [currentConference, setCurrentConference] = useState();
    const [isMini, setIsMini] = useState(false);
    const [currentId, setCurrentId] = useState();
    const [invites, setInvites] = useState();

    // Receive Invites
    useEffect(() => {
        if (currentUser && mainConference) {
            getInvites(mainConference.id, currentUser.uid, snapshot => {
                if (snapshot && snapshot.val()) {
                    setInvites(snapshot.val());
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, mainConference]);

    // Send Invite Notification
    useEffect(() => {
        if (invites) {
            Object.keys(invites).forEach(key => {
                if (invites[key].status === 'NEW') {
                    openInviteNotification(invites[key].name.split('|')[1], key);
                    updateInvite(currentId, currentUser.uid, key, invites[key].name);
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [MiniConference, currentUser, invites])


    // Check is Mini Conference
    useEffect(() => {
        setCurrentId(mId ? mId : id);
        setIsMini(mId ? true : false);
    }, [id, mId]);

    // Join Conference
    useEffect(() => {
        if (currentId) {
            const processConference = async () => {
                const conference = await getConferenceById(currentId);
                await joinConference(conference, isMini);
                setCurrentConference(conference);
            }
            processConference();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentId]);


    const joinMini = async (id) => {
        await leaveConference();
        history.push(`/conference/${mainConference.id}/mini/${id}`);
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

    return (
        <>
            <Header conferenceName={currentConference && toTitleCase(currentConference.alias.split('|')[1])} />
            <Row>
                <Col span={16}>
                    <ParticipantsWrapper />
                </Col>
                <Col span={8}>
                    <RightPanel isAdmin={isAdmin} />
                </Col>
            </Row>
        </>
    )
}

export default Conference
