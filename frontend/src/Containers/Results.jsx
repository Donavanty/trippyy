// Basic Imports
import React, { Component } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import "./CSS/Results.css"
import {Spinner} from 'react-bootstrap'
import Timeline from '../Components/Timeline'
import Timetable from '../Components/Timetable'
// import Welcome from '../Components/Welcome'
import ResultsMap from '../Components/ResultsMap'
import NavBar from '../Components/navBar'

const WelcomePromise = import("../Components/Welcome")
const Welcome = React.lazy( () => WelcomePromise)

// <img src={BG} alt="boo" className="shoppingBg"/> 
/** Container, renders results page
* @memberof Container
* @param {Component} Navbar, renders navigation bar.
* @param {Component} Timetable, renders timetable to display activities.
* @param {ReduxAction} checkTrip, updates redux state of trip with local storage
* @param {ReduxAction} authCheckState, updates redux state of user with local storage
*/
class Results extends Component {

    componentDidMount() {
        this.props.checkTrip();
        this.props.onTryAutoSignup();

        // Load image earlier.
        const img = new Image();
        img.src = JSON.parse(localStorage.trip)["photo"]
    }
                    
    componentWillUnmount() {
    }


    scrollToTimetable = () => {
        this.refs.bigBox.scrollTo({ behavior: 'smooth', top: this.refs.smallBox.offsetTop })
        this.refs.smallBox.scrollTo({ behavior: 'smooth', top: this.refs.timetable.offsetTop })
    }

    scrollToTimeline = () => {
        this.refs.bigBox.scrollTo({ behavior: 'smooth', top: this.refs.smallBox.offsetTop })
        this.refs.smallBox.scrollTo({ behavior: 'smooth', top: this.refs.timeline.offsetTop })
    }


	render() {
        if (this.props.getItineraryLoading) {
            return (
                <div>
                    <NavBar from={this.props.location.pathname}/>
                    <div className="loadingBox">
                        <h1> Getting your trip! </h1>
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                </div>)
        }

		return (
            <div>
                <NavBar from={this.props.location.pathname}/>
                <div className="bigBox resultsBigBox" ref="bigBox">
                <div className="welcomeBox">
                <React.Suspense fallback={<h1> loading. </h1>}>
                    <Welcome 
                        scrollToTimetable={this.scrollToTimetable}
                        scrollToTimeline={this.scrollToTimeline}
                    />
                </React.Suspense>
                </div>
                    <div className="row test">
                        <div className="col-8 itineraryBox" ref="smallBox">
                            <div ref="timetable">
                                <Timetable className="" ref={this.timetable}/>
                            </div>
                            <div ref="timeline">
                                <Timeline className="" ref={this.timeline}/>
                            </div>
                        </div>

                        <div className="col-4 resultsMapBox animate__animated animate__fadeInRight">
                            <ResultsMap/>
                        </div>
                    </div>

                </div>
            </div>);
	} 
	        
  	
}


const mapStateToProps = (state) => {
    return {
        trip: state.trip,
        getItineraryLoading: state.getItineraryLoading,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckState()),
        checkTrip: () => dispatch(actions.checkTrip()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Results);