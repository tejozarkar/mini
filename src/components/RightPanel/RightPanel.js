import React, { useState } from 'react'
import MiniConferenceTab from './MiniConferenceTab';
import './../../styles/right-panel.scss';

const RightPanel = (isAdmin) => {

    const [currentTab, setCurrentTab] = useState(0);

    return (
        <div>
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
            {currentTab === 0 && <MiniConferenceTab />}
        </div>
    )
}

export default RightPanel
