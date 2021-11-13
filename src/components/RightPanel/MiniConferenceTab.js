import { Button, Col, Input, Modal, Row } from 'antd'
import React, { useState } from 'react'
import { useConference } from '../../context/ConferenceContext'
import { useDatabase } from '../../context/DatabaseContext'
import MiniConference from './MiniConference'

const MiniConferenceTab = () => {

    const { insertMini } = useDatabase();
    const { createConference, mainConference, miniList } = useConference();
    const [showCreateMiniModal, setShowCreateMiniModal] = useState(false);
    const [miniName, setMiniName] = useState('');

    const handleShowCreateMiniModal = () => {
        setShowCreateMiniModal(true);
    };

    const handleCancel = () => {
        showCreateMiniModal(false);
    };

    const handleOk = async () => {
        setShowCreateMiniModal(false);
        const minispace = await createConference('mini|' + miniName + '|' + mainConference.id, { ttl: 20000 })
        insertMini(mainConference.id, minispace.id, minispace.alias);
    };

    return (
        <div>
            <div className="right-panel p-3">
                <Button type="success" className="mb-3 float-end mt-3" onClick={handleShowCreateMiniModal}>
                    + New
                </Button>
                <div className="clearfix"></div>
                <Row gutter={{ xs: 8, sm: 16, md: 16, lg: 16 }}>
                    {miniList && Object.keys(miniList).map(id =>
                        <Col span={12}>
                            <MiniConference key={id} miniId={id} name={miniList[id].name}></MiniConference>
                        </Col>)}
                </Row>
                <Modal title="Create MiniSpace" visible={showCreateMiniModal} onOk={handleOk} onCancel={handleCancel}>
                    <Input size="large" placeholder="Enter name" onChange={e => setMiniName(e.target.value)}></Input>
                </Modal>
            </div>
        </div>
    )
}

export default MiniConferenceTab
