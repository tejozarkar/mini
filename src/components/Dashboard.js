import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
import firebase from '../service/firebase';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { Button } from 'antd';

const Dashboard = () => {
    const { currentUser, logout } = useAuth();
    const history = useHistory();
    const [mainConferenceRef, setMainConferenceRef] = useState();
    const [conferenceName, setConferenceName] = useState('');
    const [miniConferences, setMiniConferences] = useState([]);
    const [participants, setParticipants] = useState([]);

    useEffect(() => {


        participants.forEach(participant => {
            console.log(participant.info);
            const confRef = ref(getDatabase(firebase), mainConferenceRef.id + '/participants/' + participant.info.externalId);
            const obj = {
                inviteId: 'sampleId'
            };

            set(confRef, obj);
        });
    }, [participants, mainConferenceRef])
    useEffect(() => {
        console.log(currentUser.uid);
        VoxeetSDK.session.open({ name: currentUser.email, externalId: currentUser.uid })
        VoxeetSDK.conference.on('streamAdded', (participant, stream) => {
            if (stream.type === 'ScreenShare') return;
            setParticipants([...participants, participant]);
            if (stream.getVideoTracks().length) {
                addVideoNode(participant, stream);
            }
        })
        VoxeetSDK.conference.on('streamUpdated', (participant, stream) => {
            if (stream.type === 'ScreenShare') return;
            setParticipants([...participants, participant]);
            if (stream.getVideoTracks().length) {
                addVideoNode(participant, stream);
            }
        });
        return VoxeetSDK.session.close();
    }, []);


    const handleLogout = async () => {
        try {
            await logout();
            history.push('/login');
        } catch {

        }
    }

    const handleCreateConference = () => {
        const conferenceParams = {
            ttl: 20000
        }
        VoxeetSDK.conference.create({ alias: conferenceName, params: conferenceParams })
            .then(conference => {
                if (!mainConferenceRef) {
                    const confRef = ref(getDatabase(firebase), conference.id);
                    const confObj = {
                        alias: conference.alias
                    }
                    set(confRef, confObj);
                    setMainConferenceRef(conference);
                    const tref = ref(getDatabase(firebase), conference.id + '/participants/' + currentUser.uid + '/inviteId');
                    onValue(tref, (snapshot) => {
                        alert(snapshot.val());
                    });
                }
                else {
                    // add miniConferences to firebase
                    setMiniConferences([...miniConferences, conference]);
                }
            })
    }

    const handleJoinConference = (conferenceId) => {
        if (!conferenceId) {
            VoxeetSDK.conference.join(mainConferenceRef, {})
                .then()
                .catch(e => console.log(e))
            return;
        }
        if (conferenceId) {
            VoxeetSDK.conference.leave(mainConferenceRef, {}).then(
                () => {
                    VoxeetSDK.conference.fetch(conferenceId)
                        .then(conf => {
                            console.log(conf);
                            VoxeetSDK.conference.join(conf, {})
                                .then(
                                )
                                .catch(e => console.log(e))
                        }).catch(e => console.log(e));
                }

            );
            console.log(conferenceId);


        }

    }

    const handleStartVideo = () => {
        VoxeetSDK.conference.startVideo(VoxeetSDK.session.participant)
            .then();
    }

    const addVideoNode = (participant, stream) => {
        let videoNode = document.getElementById('video-' + participant.id);
        if (!videoNode) {
            videoNode = document.createElement('video');
            videoNode.setAttribute('id', 'video-' + participant.id);
            videoNode.setAttribute('height', 240);
            videoNode.setAttribute('width', 320);
            videoNode.setAttribute("playsinline", true);
            videoNode.muted = true;
            videoNode.setAttribute("autoplay", 'autoplay');

            const videoContainer = document.getElementById('video-container');
            videoContainer.appendChild(videoNode);
        }
        navigator.attachMediaStream(videoNode, stream);
    }

    const handleInvite = (participant) => {
        const confRef = ref(getDatabase(firebase), mainConferenceRef.id + '/participants/' + participant.info.externalId + '/inviteId');

        set(confRef, 'secondid');
    }

    return (
        <>
            <h3> Welcome {currentUser && currentUser.email} </h3>
            <Button onClick={handleLogout}>Logout</Button>
            <input type="text" onChange={(e) => setConferenceName(e.target.value)}></input>
            <Button onClick={handleCreateConference}>Create Conference</Button>
            <Button onClick={handleStartVideo}>Start Video</Button>
            <Button onClick={() => handleJoinConference()}>Join Conference</Button>
            <div id="video-container"></div>
            <div id='participant-list'>
                {participants.map(participant => <li key={participant.info.name} onClick={() => handleInvite(participant)}>{participant.info.name}</li>)}
            </div>
            <ul>
                {miniConferences.map(conference => <li key={conference} onClick={() => handleJoinConference(conference.id)}>{conference.alias}</li>)}
            </ul>
        </>
    )
}

export default Dashboard


// const insertUser = async () => {
        //     try {
        //         const docRef = await addDoc(collection(firestore, "users"), {
        //             first: "data",
        //             last: "Lovelace",
        //             born: 1815
        //         });
        //         const q = query(collection(firestore, "users"), where("first", "==", "data"));
        //         const querySnapshot = await getDocs(q);
        //         querySnapshot.forEach((doc) => {
        //             // doc.data() is never undefined for query doc snapshots
        //             console.log(doc.id, " => ", doc.data());
        //         });
        //     } catch (e) {
        //         console.error("Error adding document: ", e);
        //     }
        // }


        // insertUser();