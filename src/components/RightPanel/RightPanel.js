import React, { useState } from 'react'
import MiniConferenceTab from './MiniConferenceTab';
import './../../styles/right-panel.scss';
import { useConference } from '../../context/ConferenceContext';
import { VideoCameraOutlined, WechatOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const RightPanel = () => {

    const { currentUser } = useAuth();
    const { admins } = useConference();
    const [currentTab, setCurrentTab] = useState(0);

    return (
        <div>
            {admins.hasOwnProperty(currentUser.uid) &&
                <div className="tab-buttons">
                    <button onClick={() => setCurrentTab(0)} className={`tab-button task-button-1 ${currentTab === 0 && 'active'}`}>
                        <VideoCameraOutlined /><span style={{ marginLeft: '8px' }}>Mini Conferences</span>
                    </button>
                    <button onClick={() => setCurrentTab(1)} className={`tab-button task-button-2 ${currentTab === 1 && 'active'}`}>
                        <WechatOutlined /><span style={{ marginLeft: '8px' }}>Chat</span>
                    </button>
                </div>
            }
            <div className="pb-5"></div>
            {admins.hasOwnProperty(currentUser.uid) && currentTab === 0 && <MiniConferenceTab />}
        </div>
    )
}

export default RightPanel
