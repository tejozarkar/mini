import { MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, Tag, Menu } from 'antd';
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useConference } from '../../context/ConferenceContext';
import { useDatabase } from '../../context/DatabaseContext';
import { toTitleCase } from '../../util/Utils';
import './../../styles/participant-list.scss';

const ParticipantList = ({ participant, userId }) => {
    const { currentUser } = useAuth();
    const { admins, currentConference } = useConference();
    const { insertAdmin, deleteAdmin } = useDatabase();

    const makeAdmin = () => {
        insertAdmin(currentConference.id, userId, participant.name);
    }

    const removeAdmin = () => {
        deleteAdmin(currentConference.id, userId);
    }

    const menu = (
        <Menu>
            {admins && admins.hasOwnProperty(userId) ?
                <Menu.Item onClick={removeAdmin}>
                    Remove as Admin
                </Menu.Item> :

                <Menu.Item onClick={makeAdmin}>
                    Make Admin
                </Menu.Item>
            }
        </Menu>
    );

    return (
        <>
            <div className="participant-list-wrapper p-3 mb-2 d-flex justify-content-between align-items-center ">
                <p className="mb-0">{toTitleCase(participant.name)}{currentUser.uid === userId && ' ( you ) '}</p>
                <div className="d-flex align-items-center">
                    {admins && admins.hasOwnProperty(userId) && <Tag color="gold">Admin</Tag>}
                    {admins && admins.hasOwnProperty(currentUser.uid) && userId !== currentUser.uid && <Dropdown overlay={menu} placement="topRight">
                        <Button type="text">
                            <MoreOutlined />
                        </Button>
                    </Dropdown>}
                </div>
            </div>
        </>
    )
}

export default ParticipantList
