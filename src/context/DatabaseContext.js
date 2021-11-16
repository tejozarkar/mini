import React, { useContext } from 'react'
import { getDatabase, onValue, ref, set, update, remove } from '@firebase/database'
import firebase from '../service/firebase';

const DatabaseContext = React.createContext();

export const useDatabase = () => {
    return useContext(DatabaseContext);
}

export const DatabaseProvider = ({ children }) => {


    const insertMainConference = (conferenceId, conferenceName, user) => {
        set(ref(getDatabase(firebase), '/conferences/' + conferenceId), {
            name: conferenceName,
            admins: {
                [user.uid]: {
                    name: user.displayName
                }
            }
        });
    }

    const insertParticipant = (conferenceId, user, miniId) => {
        const dbUrlMini = `/conferences/${conferenceId}/mini/${miniId}/participants`;
        const dbUrlMain = `/conferences/${conferenceId}/participants`;
        const userConf = {
            [user.uid]: {
                name: user.displayName
            }
        }
        update(ref(getDatabase(firebase), dbUrlMain), userConf);
        if (miniId) {
            update(ref(getDatabase(firebase), dbUrlMini), userConf);
        }
    }

    const insertMini = (conferenceId, miniId, miniName) => {
        update(ref(getDatabase(firebase), '/conferences/' + conferenceId + '/mini'), {
            [miniId]: {
                name: miniName
            }
        });
    }

    const getInvites = (conferenceId, userId, callback) => {
        onValue(ref(getDatabase(firebase), '/conferences/' + conferenceId + '/participants/' + userId + '/invites'), callback);
    }

    const getAdmins = (conferenceId, callback) => {
        onValue(ref(getDatabase(firebase), '/conferences/' + conferenceId + '/admins'), callback);
    }

    const getMiniList = (conferenceId, callback) => {
        onValue(ref(getDatabase(firebase), '/conferences/' + conferenceId + '/mini'), callback);
    }

    const getAllParticipants = (conferenceId, callback) => {
        onValue(ref(getDatabase(firebase), '/conferences/' + conferenceId + '/participants'), callback);
    }

    const deleteParticipant = (conferenceId, participantId, miniId) => {
        const dbUrl = miniId ? `/conferences/${conferenceId}/mini/${miniId}/participants/${participantId}` : `/conferences/${conferenceId}/participants/${participantId}`;
        remove(ref(getDatabase(firebase), dbUrl));
    }

    const inviteUser = (conferenceId, participantId, miniId, miniName) => {
        update(ref(getDatabase(firebase), '/conferences/' + conferenceId + '/participants/' + participantId + '/invites'), {
            [miniId]: {
                name: miniName,
                status: 'NEW'
            }
        });
    }

    const updateInvite = (conferenceId, userId, miniId, miniName) => {
        set(ref(getDatabase(firebase), '/conferences/' + conferenceId + '/participants/' + userId + '/invites/' + miniId), {
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
        deleteParticipant,
        inviteUser,
        updateInvite
    }

    return (
        <DatabaseContext.Provider value={value}>
            {children}
        </DatabaseContext.Provider>
    )
}