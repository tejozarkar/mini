import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { toTitleCase } from '../../util/Utils';

const ChatMessage = ({ chat }) => {
    const { currentUser } = useAuth();
    return (
        <div className={`chat-message mb-2 ${currentUser.uid === chat.userId ? 'right' : 'left'}`} >
            <div className="chat-message-inner p-3">
                <p className="m-0"> {chat.message}</p>
            </div>
            <p className="text-white-50">  {toTitleCase(chat.userName)}</p>

        </div>
    )
}

export default ChatMessage
