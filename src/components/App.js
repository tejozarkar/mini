import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import PrivateRoute from '../util/PrivateRoute';
import Dashboard from './Dashboard';
import Login from './Login';
import Signup from './Signup';

function App() {
  useEffect(() => {
    VoxeetSDK.initialize(process.env.REACT_APP_DOLBY_CUSTOMER_KEY, process.env.REACT_APP_DOLBY_CUSTOMER_SECRET);
  }, []);
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path='/' component={Dashboard} />
            <Route path='/login' component={Login} />
            <Route path='/signup' component={Signup} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}
export default App;
