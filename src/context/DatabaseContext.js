import React, { useContext } from 'react'
import { getDatabase, onValue, ref, set, update } from '@firebase/database'
import firebase from '../service/firebase';
import { useAuth } from './AuthContext';

const DatabaseContext = React.createContext();

export const useDatabase = () => {
    return useContext(DatabaseContext);
}

export const DatabaseProvider = ({ children }) => {

    const { currentUser } = useAuth();

    const insertMainConference = (conferenceId, conferenceName, user) => {
        set(ref(getDatabase(firebase), conferenceId), {
            name: conferenceName,
            admins: {
                [user.uid]: {
                    name: user.displayName
                }
            }
        });
    }

    const insertParticipant = (conferenceId, user) => {
        update(ref(getDatabase(firebase), conferenceId + '/participants'), {
            [user.uid]: {
                name: user.displayName
            }
        });
    }

    const insertMini = (conferenceId, miniId, miniName) => {
        update(ref(getDatabase(firebase), conferenceId + '/mini'), {
            [miniId]: {
                name: miniName
            }
        });
    }

    const getInvites = (conferenceId, callback) => {
        onValue(ref(getDatabase(firebase), conferenceId + '/participants/' + currentUser.uid + '/invites', callback));
    }

    const getAdmins = (conferenceId, callback) => {
        onValue(ref(getDatabase(firebase), conferenceId + '/admins'), callback);
    }

    const getMiniList = (conferenceId, callback) => {
        onValue(ref(getDatabase(firebase), conferenceId + '/mini'), callback);
    }

    const getAllParticipants = (conferenceId, callback) => {
        onValue(ref(getDatabase(firebase), conferenceId + '/participants'), callback);
    }

    const inviteUser = (conferenceId, participantId, mini) => {
        update(ref(getDatabase(firebase), conferenceId + '/participants/' + participantId + '/invites'), {
            [mini.id]: {
                name: mini.alias,
                status: 'NEW'
            }
        });
    }

    const updateInvite = (conferenceId, userId, miniId, miniName) => {
        set(ref(getDatabase(firebase), conferenceId + '/participants/' + userId + '/invites/' + miniId), {
            name: miniName,
            status: 'PENDING'
        });
    }

    const value = {
        insertMainConference,
        insertParticipant,
        insertMini,
        getInvites,
        getAdmins,
        getMiniList,
        getAllParticipants,
        inviteUser,
        updateInvite
    }

    return (
        <DatabaseContext.Provider value={value}>
            {children}
        </DatabaseContext.Provider>
    )
}