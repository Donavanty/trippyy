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
import ActivityList from '../Components/ActivityList'
import SelectedActivityList from '../Components/SelectedActivityList'
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

        return (
          <div className = "container-fluid align-items-center">
              <NavBar from={this.props.location.pathname}/>
              <div className = "startBox">
                <div className = "row">
                  <div className = "col-3">
                    <h2> Welcome to {this.props.trip["country"]} </h2>
                    <SelectedActivityList/>
                  </div>
                  <div className = "col-3" id="activitiesBox">
                    <h2> Activities: </h2>
                    <ActivityList/>
                  </div>

                  <div className ="col-6">
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
      isAuthenticated: state.user !== null,
      trip: state.trip,
      loading: state.loading,
      error: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckedState()),
        checkedTrip: () => dispatch(actions.checkedTrip()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Shopping);