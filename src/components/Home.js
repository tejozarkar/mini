import { getDatabase, ref, set } from '@firebase/database';
import VoxeetSDK from '@voxeet/voxeet-web-sdk'
import { Button, Input } from 'antd';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import firebase from '../service/firebase';
import './../styles/home.scss';

const Home = () => {

    const [conferenceName, setConferenceName] = useState('');
    const history = useHistory();
    const { currentUser } = useAuth();

    useEffect(() => {
        VoxeetSDK.session.open({ name: currentUser.displayName, externalId: currentUser.uid }).then().catch(e => { });
    }, [currentUser]);

    const handleCreateConference = () => {
        VoxeetSDK.conference.create({ alias: currentUser.uid + '|' + conferenceName, params: { ttl: 1000 } })
            .then((conference) => {
                set(ref(getDatabase(firebase), conference.id), {
                    name: conference.alias,
                    admins: {
                        [currentUser.uid]: {
                            name: currentUser.displayName
                        }
                    }
                });
                history.push('/conference/' + conference.id);
            });
    }

    return (
        <div className="home-wrapper p-3">
            <div className="create-or-join-wrapper p-3 d-flex justify-content-center flex-column">
                <h3>Create a new conference</h3>
                <Input className="mb-3" type='text' placeholder='Enter conference name' onChange={(e) => setConferenceName(e.target.value)} />
                <Button type="primary" className="btn btn-primary w-100" onClick={handleCreateConference}>Create</Button>
                <p className="text-center my-2">or</p>
                <Button type="link" className="w-100" onClick={handleCreateConference}>Join by URL</Button>
            </div>
        </div>

    )
}

export default Home
