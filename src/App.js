import React from 'react';
import LandingPage from './containers/LandingPage';
import InfoPage from './components/InfoModal/InfoModal';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

function App() {
    return (
        <div className="block m-0 bg-gray-50 h-auto">
            <Router>
                <Switch>
                    <Route path="/info">
                        <InfoPage />
                    </Route>
                    <Route exact path="/">
                        <LandingPage />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
