import React, { useContext } from 'react'
import { getDatabase, onValue, ref, set, update, remove, get } from '@firebase/database'
import firebase, { firestore, storage } from '../service/firebase';
import { ref as storageref, uploadBytes, getDownloadURL } from '@firebase/storage';
import { collection, getDoc, addDoc } from '@firebase/firestore';

const DatabaseContext = React.createContext();

export const useDatabase = () => {
    return useContext(DatabaseContext);
}

export const DatabaseProvider = ({ children }) => {


    const insertMainConference = async (conferenceId, conferenceName, user) => {
        const conference = await get(ref(getDatabase(firebase), '/conferences/' + conferenceId))
        if (!conference.val()) {
            set(ref(getDatabase(firebase), '/conferences/' + conferenceId), {
                name: conferenceName,
                admins: {
                    [user.uid]: {
                        name: user.displayName
                    }
                }
            });
        }
    }

    const insertParticipant = async (conferenceId, user, miniId) => {
        const dbUrlMini = `/conferences/${conferenceId}/mini/${miniId}/participants`;
        const dbUrlMain = `/conferences/${conferenceId}/participants`;

        const userConf = {
            [user.uid]: {
                name: user.displayName
            }
        }
        const mainParticipant = await get(ref(getDatabase(firebase), dbUrlMain + '/' + user.uid));
        if (!mainParticipant.val())
            update(ref(getDatabase(firebase), dbUrlMain), userConf);
        if (miniId) {
            const miniParticipant = await get(ref(getDatabase(firebase), dbUrlMini + '/' + user.uid));
            if (!miniParticipant.val()) {
                update(ref(getDatabase(firebase), dbUrlMini), userConf);
            }
        }
    }

    const insertMini = async (conferenceId, miniId, miniName) => {
        const mini = await get(ref(getDatabase(firebase), '/conferences/' + conferenceId + '/mini/' + miniId));
        if (!mini.val())
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

    const insertAdmin = (conferenceId, userId, userName) => {
        update(ref(getDatabase(firebase), '/conferences/' + conferenceId + '/admins/'), {
            [userId]: {
                name: userName
            }
        });
    }

    const deleteAdmin = (conferenceId, userId) => {
        remove(ref(getDatabase(firebase), '/conferences/' + conferenceId + '/admins/' + userId));
    }

    const getMiniList = (conferenceId, callback) => {
        onValue(ref(getDatabase(firebase), '/conferences/' + conferenceId + '/mini'), callback);
    }

    const getAllParticipants = (conferenceId, callback) => {
        onValue(ref(getDatabase(firebase), '/conferences/' + conferenceId + '/participants'), callback);
    }

    const deleteParticipant = (conferenceId, participantId, miniId) => {
        const dbUrl = conferenceId !== miniId ? `/conferences/${conferenceId}/mini/${miniId}/participants/${participantId}` : `/conferences/${conferenceId}/participants/${participantId}`;
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

    const uploadFile = (imageAsFile, callback) => {
        uploadBytes(storageref(storage, '/images/' + imageAsFile.name), imageAsFile).then((task) => {
            getDownloadURL(task.ref).then(url => {
                callback(url);
            });
        })
    }

    const insertUserToFirestore = (user) => {
        return addDoc(collection(firestore, 'users'), user);
    }

    const getUserFromFirestore = (id) => {
        return getDoc(collection(firestore, 'users', id));
    }

    const value = {
        insertMainConference,
        insertParticipant,
        insertMini,
        insertAdmin,
        getInvites,
        getAdmins,
        getMiniList,
        getAllParticipants,
        deleteParticipant,
        inviteUser,
        updateInvite,
        uploadFile,
        deleteAdmin,
        insertUserToFirestore,
        getUserFromFirestore
    }

    return (
        <DatabaseContext.Provider value={value}>
            {children}
        </DatabaseContext.Provider>
    )
}