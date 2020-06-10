// Basic Imports
import React, { Component, Fragment } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import "bootstrap/dist/css/bootstrap.css";
import NavBar from '../Components/navBar';
import InputForm from '../Components/StartComponents/InputForm'
import Calendar from '../Components/StartComponents/Calendar'
import "./CSS/global.css"
import axios from "axios";


class StartPage extends Component {

	componentDidMount() {
		//Updates login status into redux.
		this.props.onTryAutoSignup();
		this.props.checkedTrip();
	}

	render() {
	  return (
	    <div >
	    	<NavBar from={this.props.location.pathname}/>
	    	<InputForm history={this.props.history} />
	    	
	    </div>
	  );
	}
}

const mapStateToProps = (state) => {
	return {
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onTryAutoSignup: () => dispatch(actions.authCheckedState()),
		checkedTrip: () => dispatch(actions.checkedTrip())
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(StartPage);
