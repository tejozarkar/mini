import { MailOutlined, TeamOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Checkbox, Modal } from 'antd';
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useConference } from '../../context/ConferenceContext';
import { useDatabase } from '../../context/DatabaseContext';
import './../../styles/mini-conference.scss';

const MiniConference = ({ name, miniId }) => {

    const { currentUser } = useAuth();
    const { inviteUser } = useDatabase();
    const { mainConferenceId, currentParticipants, leaveConference, miniList, currentConference } = useConference();
    const [inviteeIds, setInviteeIds] = useState([]);
    const history = useHistory();

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

    const [showInviteModal, setShowInviteModal] = useState(false);
    return (
        <div className="mini-conference-wrapper p-3 mb-3" >
            <div className="d-flex justify-content-between align-items-start">
                <p className="conference-name mb-2">{name.split('|')[1]}</p>
                <p className="participants-count mb-0 d-flex align-items-center"><TeamOutlined /><span style={{ marginLeft: '5px' }}>{miniList[miniId].participants ? Object.keys(miniList[miniId].participants).length : '0'}</span></p>

            </div>
            <div className="d-flex mt-4 justify-content-between align-items-end mb-2">
                <Button type="default" onClick={() => setShowInviteModal(true)}><MailOutlined />Invite</Button>
                {currentConference && miniId !== currentConference.id && <Button type="default" className="filled" onClick={() => joinMini(miniId)}> <UserAddOutlined />Join</Button>}
            </div>

            <Modal title="Invite people" visible={showInviteModal} onCancel={() => setShowInviteModal(false)} onOk={() => { setShowInviteModal(false); inviteUsers(inviteeIds) }}>
                {Object.keys(currentParticipants).length === 1 && <p>No participants</p>}
                {Object.keys(currentParticipants).map(id => id !== currentUser.uid && <Checkbox key={id} onChange={() => selectInvitee(id)}>{currentParticipants[id].name}</Checkbox>)}
            </Modal>
        </div>

    )
}

export default MiniConference
