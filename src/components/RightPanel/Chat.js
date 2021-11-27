import { SendOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import { useConference } from '../../context/ConferenceContext';
import { useDatabase, } from '../../context/DatabaseContext';
import './../../styles/chat.scss';
import ChatMessage from './ChatMessage';

const Chat = () => {

    const [message, setMessage] = useState();
    const { insertChatMessage, getChat } = useDatabase();
    const { mainConferenceId, currentConference, isMini } = useConference();
    const { currentUser } = useAuth();
    const [chat, setChat] = useState({});

    const sendMessage = () => {
        setMessage('');
        insertChatMessage(message, currentUser.uid, currentUser.displayName, mainConferenceId, isMini ? currentConference.id : null);
    }

    useEffect(() => {
        getChat(mainConferenceId, isMini ? currentConference.id : null, (snapshot) => {
            setChat(snapshot.val());
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mainConferenceId, currentConference])

    return (
        <div className="chat-wrap p-3">
            <div className="chat-messages-wrap">
                {chat && Object.keys(chat).map(key => <ChatMessage chat={chat[key]} />)}
            </div>
            <div className="d-flex justify-content-center align-items-center">
                <Input className="chat-input" onChange={(e) => setMessage(e.target.value)} value={message} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type message" />
                <Button type="success filled" className="h-100" onClick={sendMessage}><SendOutlined />Send</Button>
            </div>

        </div >
    )
}

export default Chat
