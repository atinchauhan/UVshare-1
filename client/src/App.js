import React, { Component } from "react";
import {Switch} from 'react-router';
import './App.css';
import { Menu,Container } from 'semantic-ui-react';
import {Upload} from './components/Upload';
import {Home} from './components/Home';
import {NotFound} from './components/NotFound';
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {


  render() {
    return (
      <Router>
       <Container>

         <Switch>
           <Route exact path='/' component={Home}/>
           <Route path='/upload/:address' component={Upload}/>
           <Route component={NotFound}/>
         </Switch>

       </Container>
      </Router>
      // <h1>hello</h1>
    );
  }
  navigateToHome(e){
    // e.preventDefault();
    // history.push('/');
    // browserHistory.push('/');
    // this.props.browserHistory.push(`/campaign`);
    // this.props.navigation.navigate('/');
  }
}
export default App;