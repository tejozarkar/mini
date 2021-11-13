import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import React, { useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext';
import { useDatabase } from './DatabaseContext';

const ConferenceContext = React.createContext();

export const useConference = () => {
    return useContext(ConferenceContext);
}

export const ConferenceProvider = ({ children }) => {

    const { currentUser } = useAuth();
    const { getAdmins, getMiniList, getAllParticipants, insertParticipant } = useDatabase();
    const [sessionOpened, setSessionOpened] = useState(false);
    const [currentParticipants, setCurrentParticipants] = useState({});
    const [totalCurrentParticipants, setTotalCurrentParticipants] = useState(0);
    const [admins, setAdmins] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);
    const [mainConference, setMainConference] = useState();
    const [miniList, setMiniList] = useState();
    const [allParticipants, setAllParticipants] = useState({});

    // Open Session
    useEffect(() => {
        if (currentUser) {
            VoxeetSDK.session.open({ name: currentUser.displayName, externalId: currentUser.uid })
                .then()
                .catch(e => { })
                .finally(() => setSessionOpened(true));
        }
    }, [currentUser]);

    // Get Admins | MiniConf | AllParticipants
    useEffect(() => {
        if (mainConference) {
            getAdmins(mainConference.id, (snapshot) => {
                setAdmins(snapshot.val());
            });
            getMiniList(mainConference.id, (snapshot) => {
                setMiniList(snapshot.val());
            });
            getAllParticipants(mainConference.id, (snapshot) => {
                setAllParticipants(snapshot.val());
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mainConference]);

    // Find User is Admin
    useEffect(() => {
        if (currentUser && admins) {
            Object.keys(admins).forEach(key => {
                if (currentUser.uid === key) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            });
        }
    }, [currentUser, admins]);

    // Add remove Current Conference Participants
    useEffect(() => {
        if (sessionOpened) {
            streamAdded((participant) => {
                setCurrentParticipants(participants => ({ ...participants, [participant.info.externalId]: { id: participant.info.externalId, name: participant.info.name, active: true } }));
            });
            streamRemoved((participant) => {
                setCurrentParticipants(participants => ({ ...participants, [participant.info.externalId]: { id: participant.info.externalId, name: participant.info.name, active: false } }));
            });
            streamUpdated((participant) => {
                setCurrentParticipants(participants => ({ ...participants, [participant.info.externalId]: { id: participant.info.externalId, name: participant.info.name, active: true } }));
            });
        }
    }, [sessionOpened, mainConference, currentUser]);

    // Count Total Current Participants
    useEffect(() => {
        let total = 0;
        Object.keys(currentParticipants).map(key =>
            currentParticipants[key].active &&
            total++
        );
        setTotalCurrentParticipants(total);
    }, [currentParticipants]);

    // Add Participant to Database
    useEffect(() => {
        if (mainConference) {
            insertParticipant(mainConference.id, currentUser);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, mainConference])

    const createConference = (alias, params = {}) => {
        return VoxeetSDK.conference.create({ alias, params });
    }

    const getConferenceById = (id) => {
        return VoxeetSDK.conference.fetch(id);
    }

    const joinConference = (conference, isMini = true) => {
        return new Promise((resolve, reject) => {
            VoxeetSDK.conference.join(conference, {}).then(() => {
                if (!isMini) {
                    setMainConference(conference);
                }
                resolve();
            });
        });
    }

    const leaveConference = () => {
        return VoxeetSDK.conference.leave(VoxeetSDK.session.participant);
    }

    const streamAdded = (callback) => {
        VoxeetSDK.conference.on('streamAdded', callback);
    }

    const streamUpdated = (callback) => {
        VoxeetSDK.conference.on('streamUpdated', callback);
    }

    const streamRemoved = (callback) => {
        VoxeetSDK.conference.on('streamRemoved', callback);
    }

    const value = {
        createConference,
        getConferenceById,
        joinConference,
        leaveConference,
        streamAdded,
        streamUpdated,
        streamRemoved,
        currentParticipants,
        totalCurrentParticipants,
        isAdmin,
        admins,
        miniList,
        allParticipants,
        mainConference
    }

    return (
        <ConferenceContext.Provider value={value}>
            {children}
        </ConferenceContext.Provider>
    )
}