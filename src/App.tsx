import React from 'react';
import 'rsuite/dist/styles/rsuite-default.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Reservation from './Components/Reservation';

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/" exact>
            <Reservation/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
