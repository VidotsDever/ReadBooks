import React, { Component } from 'react';
import RootContainer from './containers/rootContainer';
import { BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';
import './App.css'

class App extends Component {
  render() {
    return (
      <Router>
          <div>
              <Route exact path="/" render={() => <Redirect to="/books" />} />
              <Route path="/books" component={RootContainer}/>
          </div>
      </Router>
    );
  }
}

export default App;
