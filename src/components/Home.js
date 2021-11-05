import { addDoc, collection, getDocs, query, where } from '@firebase/firestore';
import VoxeetSDK from '@voxeet/voxeet-web-sdk'
import { Button, Input } from 'antd';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { firestore } from '../service/firebase';

const Home = () => {

    const [conferenceName, setConferenceName] = useState('');
    const history = useHistory();
    const { currentUser } = useAuth();
    useEffect(() => {
        VoxeetSDK.session.open({ name: currentUser.displayName, externalId: currentUser.uid }).then().catch(e => console.log(e));
    }, [currentUser]);

    const handleCreateConference = () => {
        console.log(conferenceName);
        VoxeetSDK.conference.create({ alias: currentUser.uid + '|' + conferenceName, params: { ttl: 1000 } })
            .then((conference) => {
                history.push('/conference/' + conference.id);
            });
    }

    return (
        <div>
            <h2>Welcome {currentUser.displayName} </h2>
            <h3>Create a new conference</h3>
            <Input type='text' placeholder='Enter conference name' onChange={(e) => setConferenceName(e.target.value)} />
            <Button className="btn btn-primary" onClick={handleCreateConference}>Create</Button>
            <Button className="btn btn-default" onClick={handleCreateConference}>Join</Button>
        </div>
    )
}

export default Home
