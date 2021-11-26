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
    const { getAdmins, getMiniList, getAllParticipants, insertParticipant, deleteParticipant } = useDatabase();
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
    }, [currentUser, admins, mainConferenceId]);

    useEffect(() => {
        if (currentConference) {
            insertParticipant(mainConferenceId, currentUser, isMini && currentConference.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentConference]);

    // Add remove Current Conference Participants
    useEffect(() => {
        if (sessionOpened) {
            streamAdded((participant) => {
                setCurrentParticipants(participants => ({ ...participants, [participant.info.externalId]: { id: participant.info.externalId, name: participant.info.name, active: true } }));
            });
            streamRemoved((participant) => {
                if (participant && participant.status === 'Left') {
                    setCurrentParticipants(participants => ({ ...participants, [participant.info.externalId]: { id: participant.info.externalId, name: participant.info.name, active: false } }));
                }
            });
            streamUpdated((participant) => {
                setCurrentParticipants(participants => ({ ...participants, [participant.info.externalId]: { id: participant.info.externalId, name: participant.info.name, active: true } }));
            });
        }
    }, [sessionOpened, currentConference, currentUser]);

    // Count Total Current Participants
    useEffect(() => {
        let total = 0;
        Object.keys(currentParticipants).map(key =>
            currentParticipants[key].active &&
            total++
        );
        setTotalCurrentParticipants(total);
    }, [currentParticipants, currentConference]);

    const createConference = (alias, params = {}) => {
        return VoxeetSDK.conference.create({ alias, params });
    }

    const getConferenceById = (id) => {
        return VoxeetSDK.conference.fetch(id);
    }

    const joinConference = (conference, isMini) => {
        return new Promise((resolve, reject) => {
            if (conference) {
                VoxeetSDK.conference.join(conference, {}).then(() => {
                    setIsMini(isMini);
                    setCurrentConference(conference);
                    resolve();
                }).catch(e => {
                    reject(e);
                });
            }
        });
    }

    const leaveConference = async (callback) => {
        setCurrentParticipants({});
        await VoxeetSDK.conference.leave(VoxeetSDK.session.participant);
        if (currentConference) {
            deleteParticipant(mainConferenceId, VoxeetSDK.session.participant.info.externalId, currentConference.id);
        }
        if (callback)
            callback();
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

    const startVideo = async (callback) => {
        await VoxeetSDK.conference.startVideo(VoxeetSDK.session.participant);
        callback();
    }

    const stopVideo = async (callback) => {
        await VoxeetSDK.conference.stopVideo(VoxeetSDK.session.participant);
        callback();
    }

    const startMicrophone = async (callback) => {
        await VoxeetSDK.conference.startAudio(VoxeetSDK.session.participant);
        callback();
    }

    const stopMicrophone = async (callback) => {
        await VoxeetSDK.conference.stopAudio(VoxeetSDK.session.participant);
        callback();
    }

    const startScreenshare = async (callback) => {
        await VoxeetSDK.conference.startScreenShare(VoxeetSDK.session.participant);
        callback();
    }

    const stopScreenshare = async (callback) => {
        await VoxeetSDK.conference.stopScreenShare(VoxeetSDK.session.participant);
        callback();
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
        startMicrophone,
        stopMicrophone,
        startScreenshare,
        stopScreenshare,
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
            {(!currentUser || sessionOpened) && children}
        </ConferenceContext.Provider>
    )
}