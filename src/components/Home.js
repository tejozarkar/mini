import { Button, Input } from 'antd';
import React, { useState } from 'react'
import { useConference } from '../context/ConferenceContext';
import { useDatabase } from '../context/DatabaseContext';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import './../styles/home.scss';

const Home = () => {

    const { createConference } = useConference();
    const { insertMainConference } = useDatabase();
    const { currentUser } = useAuth();
    const [conferenceName, setConferenceName] = useState('');
    const history = useHistory();

    const handleCreateConference = async () => {
        const conference = await createConference(currentUser.uid + '|' + conferenceName, { ttl: 1000 }, currentUser);
        insertMainConference(conference.id, conference.alias, currentUser);
        history.push('/conference/' + conference.id);
    }

    return (
        <div className="home-wrapper p-3">
            <div className="create-or-join-wrapper p-3 d-flex justify-content-center flex-column">
                <h3>Create a new conference</h3>
                <Input className="mb-3" type='text' placeholder='Enter conference name' onChange={(e) => setConferenceName(e.target.value)} />
                <Button type="primary" className="btn btn-primary w-100" onClick={handleCreateConference}>Create</Button>
                <p className="text-center my-2">or</p>
                {/* <Button type="link" className="w-100" onClick={handleCreateConference}>Join by URL</Button> */}
            </div>
        </div >

    )
}

export default Home
