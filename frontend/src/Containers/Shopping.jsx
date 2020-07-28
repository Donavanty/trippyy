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
import ActivitySearch from '../Components/ActivitySearch'
import SelectedActivityList from '../Components/SelectedActivityList'
import ActivitySearchAutocomplete from '../Components/ActivitySearchAutocomplete'
import "./CSS/Shopping.css"

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
    state={
      bgColor: " browseGrey"
    }

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

    changeBrowsing = (browse) => {
      this.props.changeBrowsing(browse);
    }

    selectAddress = (address, placeId) => {
        this.props.addSuggestions(placeId);
    }
            // <LazyLoad>
            //   <img src={BG} alt="boo" className="shoppingBg"/>
            // </LazyLoad> 
    render() {

        return (
          <div className = "shoppingBox">

              <div>
                  <NavBar id="navbar-Shopping" from={this.props.location.pathname}/>
              </div>
              <div className = "bigBox">
                <div className = "shoppingContainer">
                  <div className = "" id="selectedActivitiesBox">
                    <SelectedActivityList/>
                  </div>
                  <div className = "" id="activitiesBox">
                    <div className = "browseSearchRow">
                      <div className ={"browseBox" + (this.props.browsingToggle ? " searchGrey" : "")} onClick={() => this.changeBrowsing("BROWSE")}>
                        Browse 
                      </div>
                      <div className ="searchBox" onClick = {() => this.changeBrowsing("SEARCH")}>
                        <ActivitySearchAutocomplete selectAddress={this.selectAddress} bgColor={!this.props.browsingToggle ? " browseGrey" : ""}/>
                      </div>
                    </div>

                    {this.props.browsingToggle ?
                      <ActivityList/>
                      :
                      <ActivitySearch/>
                    }
                  </div>

                  <div className =" mapBox">
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
      error: state.error,
      browsingToggle: state.browsingToggle
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckState()),
        checkTrip: () => dispatch(actions.checkTrip()),
        changeBrowsing: (browse) => dispatch(actions.changeBrowsing(browse)),
        addSuggestions : (suggestions) => dispatch(actions.addSuggestions(suggestions)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Shopping);