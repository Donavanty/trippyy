// Basic Imports
import React, { Component, Fragment } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import "./CSS/Results.css"
import Timetable from '../Components/Timetable'
import NavBar from '../Components/navBar'
class Results extends Component {
    componentDidMount() {
        this.props.checkTrip();
        this.props.onTryAutoSignup();
    }

	render() {
		return (
            <Fragment>
                <NavBar from={this.props.location.pathname}/>
                <Timetable/>
            </Fragment>);
	} 
	        
  	
}


const mapStateToProps = (state) => {
    return {
        trip: state.trip,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckState()),
        checkTrip: () => dispatch(actions.checkTrip()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Results);