import React from 'react';
import LandingPage from './containers/LandingPage';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

function App() {
    return (
        <div className="block m-0 bg-gray-50 h-screen">
            <Router>
                <Switch>
                    <Route path="/">
                        <LandingPage />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
