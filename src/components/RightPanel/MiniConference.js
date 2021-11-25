import { MailOutlined, TeamOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Checkbox, Modal, notification } from 'antd';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useConference } from '../../context/ConferenceContext';
import { useDatabase } from '../../context/DatabaseContext';
import { toTitleCase } from '../../util/Utils';
import './../../styles/mini-conference.scss';

const MiniConference = ({ name, miniId }) => {

    const { currentUser } = useAuth();
    const { inviteUser, getWaves, updateWaveStatus } = useDatabase();
    const { mainConferenceId, allParticipants, leaveConference, miniList, currentConference } = useConference();
    const [inviteeIds, setInviteeIds] = useState([]);
    const history = useHistory();
    const [isWaving, setIsWaving] = useState(false);

    useEffect(() => {
        getWaves(mainConferenceId, miniId, (snapshot) => {
            if (snapshot && snapshot.val()) {
                console.log(snapshot.val())
                if (snapshot.val().status === 'NEW') {
                    if (isWaving === false)
                        openWaveNotification(snapshot.val().name)
                    setIsWaving(true);

                } else {
                    setIsWaving(false);
                }
            } else {
                setIsWaving(false);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [miniId, mainConferenceId]);

    const selectInvitee = (id) => {
        if (inviteeIds.includes(id)) {
            setInviteeIds(inviteeIds.slice(0, inviteeIds.indexOf(id)));
            return;
        }
        setInviteeIds([...inviteeIds, id]);
    }

    const inviteUsers = (ids) => {
        ids.forEach(id => {
            inviteUser(mainConferenceId, id, miniId, name);
        });
    }

    const joinMini = async (id) => {
        await leaveConference(() => {
            history.push(`/conference/${mainConferenceId}/mini/${id}`);
        });
    }

    const avoidWave = () => {
        updateWaveStatus(mainConferenceId, miniId, 'REJECT')
    }

    const openWaveNotification = (personName) => {
        const key = `open${Date.now()}`;
        const btn = (
            <Button type="primary" size="small" onClick={() => { notification.close(key); joinMini(miniId); }}>
                Join
            </Button>
        );
        notification.open({
            message: `👋 ${personName} is waving you `,
            description:
                `${name.split('|')[1]} requires your attention. Would you like to join?`,
            btn,
            duration: 0,
            key,
            onClose: avoidWave
        });
    };

    const [showInviteModal, setShowInviteModal] = useState(false);
    return (
        <div className="mini-conference-wrapper p-3 mb-3" >
            <div className="d-flex justify-content-between align-items-start">
                <p className="conference-name mb-2">{name && name.split('|')[1]}</p>
                <div className="d-flex">
                    {isWaving && <span className="px-3 wave">👋</span>}
                    <p className="participants-count ml-3 mb-0 d-flex align-items-center"><TeamOutlined /><span style={{ marginLeft: '5px' }}>{miniList[miniId].participants ? Object.keys(miniList[miniId].participants).length : '0'}</span></p>
                </div>

            </div>
            <div className="d-flex mt-4 justify-content-between align-items-end mb-2">
                <Button type="default" style={{ width: '49%' }} onClick={() => setShowInviteModal(true)}><MailOutlined />Invite</Button>
                {currentConference && miniId !== currentConference.id && <Button type="default" className="filled" style={{ width: '49%' }} onClick={() => joinMini(miniId)}> <UserAddOutlined />Join</Button>}
            </div>

            <Modal title="Invite people" visible={showInviteModal} onCancel={() => setShowInviteModal(false)} onOk={() => { setShowInviteModal(false); inviteUsers(inviteeIds) }}>
                {allParticipants && Object.keys(allParticipants).length === 1 && <p>No participants</p>}
                {allParticipants && Object.keys(allParticipants).map(id => id !== currentUser.uid && <Checkbox key={id} onChange={() => selectInvitee(id)}>{toTitleCase(allParticipants[id].name)}</Checkbox>)}
            </Modal>
        </div>

    )
}

export default MiniConference
