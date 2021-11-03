import Button from '@restart/ui/esm/Button'
import VoxeetSDK from '@voxeet/voxeet-web-sdk'
import React, { useEffect, useRef } from 'react'
import { Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {

    const conferenceNameRef = useRef();
    const history = useHistory();
    const { currentUser } = useAuth();
    useEffect(() => {
        VoxeetSDK.session.open({ name: currentUser.displayName, externalId: currentUser.uid }).then().catch(e => console.log(e));
    }, [currentUser]);

    const handleCreateConference = () => {
        VoxeetSDK.conference.create({ alias: conferenceNameRef.current.value, params: { ttl: 1000 } })
            .then((conference) => {
                history.push('/conference/' + conference.id);
            }, err => {

            });
    }

    return (
        <div>
            <h2>Welcome {currentUser.displayName} </h2>
            <h3>Create a new conference</h3>
            <Form.Control type='text' placeholder='Enter conference name' ref={conferenceNameRef} />
            <Button className="btn btn-primary" onClick={handleCreateConference}>Create</Button>
            <Button className="btn btn-default" onClick={handleCreateConference}>Join</Button>
        </div>
    )
}

export default Home
