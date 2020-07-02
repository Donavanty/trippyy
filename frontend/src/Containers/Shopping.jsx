// Basic Imports
import React, { Component } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import NavBar from '../Components/navBar';
import Map from '../Components/Map'
import ActivityList from '../Components/ActivityList'
import SelectedActivityList from '../Components/SelectedActivityList'
import "./CSS/Shopping.css"
import BG from '../assets/shoppingBg.jpg'
import LazyLoad from 'react-lazy-load';

/** Container, renders shopping page
* @memberof Container
* @param {Component} Navbar, renders navigation bar.
* @param {Component} Map, renders map.
* @param {Component} ActivityList, renders activity list.
* @param {Component} SelectedActivityList, renders selected activities list.
* @param {ReduxAction} checkTrip, updates redux state of trip with local storage
* @param {ReduxAction} authCheckState, updates redux state of user with local storage
*/
class Shopping extends Component {

    componentDidMount() {
      if (localStorage.getItem('trip') === null || localStorage.getItem('trip') === undefined) {
        this.props.history.push('/');
        
        return;
      } 
      //Updates login status and trip status into redux.
      this.props.onTryAutoSignup();
      this.props.checkTrip();
      
    }

    //Happens upon receiving updated login information.
    componentDidUpdate(prevProps, prevState, snapshot) {
        window.scrollTo(0, 0); //Scroll right back to the top after InputForm.
    }

    
    render() {

        return (
          <div className = "shoppingBox">
            <LazyLoad>
              <img src={BG} alt="boo" className="shoppingBg"/>
            </LazyLoad>
              <div>
                  <NavBar id="navbar-Shopping" from={this.props.location.pathname}/>
              </div>
              <div className = "bigBox">
                <div className = "row">
                  <div className = "col-3" id="selectedActivitiesBox">
                    <h2> Welcome to {this.props.trip["country"]} </h2>
                    <SelectedActivityList/>
                  </div>
                  <div className = "col-3" id="activitiesBox">
                    <h2> Activities: </h2>
                    <ActivityList/>
                  </div>

                  <div className ="col-6 mapBox">
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
        onTryAutoSignup: () => dispatch(actions.authCheckState()),
        checkTrip: () => dispatch(actions.checkTrip()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Shopping);