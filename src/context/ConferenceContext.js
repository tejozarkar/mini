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
    const [mainConferenceId, setMainConferenceId] = useState();
    const [miniList, setMiniList] = useState();
    const [allParticipants, setAllParticipants] = useState({});
    const [currentConference, setCurrentConference] = useState();
    const [isMini, setIsMini] = useState(false);

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
        if (mainConferenceId) {
            getAdmins(mainConferenceId, (snapshot) => {
                setAdmins(snapshot.val());
            });
            getMiniList(mainConferenceId, (snapshot) => {
                setMiniList(snapshot.val());
            });
            getAllParticipants(mainConferenceId, (snapshot) => {
                setAllParticipants(snapshot.val());
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mainConferenceId]);

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

    useEffect(() => {
        if (currentConference) {
            insertParticipant(mainConferenceId, currentUser, isMini && currentConference.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentConference])

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
    }, [sessionOpened, mainConferenceId, currentUser]);

    // Count Total Current Participants
    useEffect(() => {
        let total = 0;
        Object.keys(currentParticipants).map(key =>
            currentParticipants[key].active &&
            total++
        );
        setTotalCurrentParticipants(total);
    }, [currentParticipants]);

    const createConference = (alias, params = {}) => {
        return VoxeetSDK.conference.create({ alias, params });
    }

    const getConferenceById = (id) => {
        return VoxeetSDK.conference.fetch(id);
    }

    const joinConference = (conference, isMini) => {
        return new Promise((resolve, reject) => {
            VoxeetSDK.conference.join(conference, {}).then(() => {
                setIsMini(isMini);
                setCurrentConference(conference);
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

    const startVideo = (callback) => {
        VoxeetSDK.conference.startVideo(VoxeetSDK.session.participant).then(() => {
            callback();
        });
    }

    const stopVideo = (callback) => {
        VoxeetSDK.conference.stopVideo(VoxeetSDK.session.participant).then(() => {
            callback();
        });
    }

    const value = {
        createConference,
        getConferenceById,
        joinConference,
        leaveConference,
        streamAdded,
        streamUpdated,
        streamRemoved,
        setMainConferenceId,
        startVideo,
        stopVideo,
        currentParticipants,
        totalCurrentParticipants,
        isAdmin,
        admins,
        miniList,
        allParticipants,
        mainConferenceId,
        currentConference,
        isMini
    }

    return (
        <ConferenceContext.Provider value={value}>
            {sessionOpened && children}
        </ConferenceContext.Provider>
    )
}