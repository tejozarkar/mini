import { ExclamationCircleTwoTone } from '@ant-design/icons'
import { Button, Col, Input, Modal, Row, Empty } from 'antd'
import React, { useState } from 'react'
import { useConference } from '../../context/ConferenceContext'
import { useDatabase } from '../../context/DatabaseContext'
import MiniConference from './MiniConference'

const MiniConferenceTab = () => {

    const { insertMini } = useDatabase();
    const { createConference, mainConferenceId, miniList } = useConference();
    const [showCreateMiniModal, setShowCreateMiniModal] = useState(false);
    const [miniName, setMiniName] = useState('');

    const handleShowCreateMiniModal = () => {
        setShowCreateMiniModal(true);
    };

    const handleCancel = () => {
        setShowCreateMiniModal(false);
    };

    const handleOk = async () => {
        setShowCreateMiniModal(false);
        const minispace = await createConference('mini|' + miniName + '|' + mainConferenceId, { ttl: 20000 })
        insertMini(mainConferenceId, minispace.id, minispace.alias);
    };

    return (
        <div className="right-panel p-3">
            <Button type="success" className="mb-3 float-end mt-3" onClick={handleShowCreateMiniModal}>
                + New
            </Button>
            <div className="clearfix"></div>
            {(!miniList || (miniList && !Object.keys(miniList).length)) &&
                <Empty
                    image={<ExclamationCircleTwoTone twoToneColor="#333" style={{ fontSize: '50px' }} />}
                    imageStyle={{
                        height: 60,
                    }}
                    description={
                        <span className="text-white-50">
                            No Mini Conferences created!<br />
                            <p>
                                Please press <span className="text-success cursor-pointer" onClick={handleShowCreateMiniModal}>+ New</span> to create new mini conference
                            </p>
                        </span>
                    }>
                </Empty>
            }
            <Row gutter={{ xs: 8, sm: 16, md: 16, lg: 16 }}>
                {miniList && Object.keys(miniList).map(id =>
                    <Col span={12} key={id}>
                        <MiniConference key={id} miniId={id} name={miniList[id].name}></MiniConference>
                    </Col>
                )}
            </Row>
            <Modal key="crateMiniModal" title="Create MiniSpace" visible={showCreateMiniModal} onOk={handleOk} onCancel={handleCancel}>
                <div className="custom-label-wrapper">
                    <label className="custom-label">Enter conference name</label>
                    <Input size="large" onChange={e => setMiniName(e.target.value)}></Input>
                </div>
            </Modal>
        </div>
    )
}

export default MiniConferenceTab
