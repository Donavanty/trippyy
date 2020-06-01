// Basic Imports
import React, { Component, Fragment } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import axios from "axios";
import NavBar from '../Components/navBar';
import Map from '../Components/Map'
import "./CSS/global.css"

class Shopping extends Component {

    componentDidMount() {
      if (localStorage.getItem('trip') === null || localStorage.getItem('trip') === undefined) {
        this.props.history.push('/');
      } 
      //Updates login status and trip status into redux.
      this.props.onTryAutoSignup();
      this.props.checkedTrip();
      

    }

    //Happens upon receiving updated login information.
    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {
        if (this.props.trip === null ) {
          return <h1> loading </h1>
        }
        return (
          <div className = "container-fluid align-items-center">
              <NavBar from={this.props.location.pathname}/>
              <div className = "jumbotron startBox">
                <div className = "row">
                  <div className = "col-4">
                    <h1> Shopping! </h1>
                    <p> Welcome to {this.props.trip["country"]} </p>
                  </div>

                  <div className ="col-8">
                    <Map/>
                  </div>
                </div>
              </div>
          </div>
        );

    }

}



const mapStateToProps = (state) => {
    return {
      isAuthenticated: state.token !== null,
      trip: state.trip,
      loading: state.loading,
      error: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckedState()),
        onAuth: (username, password) => dispatch(actions.authLogined(username, password)),
        checkedTrip: () => dispatch(actions.checkedTrip()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Shopping);