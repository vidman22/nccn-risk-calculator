import React from 'react';
import AppForm from './containers/AppForm/AppForm';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import './App.css';

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/">
                        <AppForm />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
