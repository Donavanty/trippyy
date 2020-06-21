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
import "./CSS/global.css"
import axios from "axios";

/** Container, renders sign up page.
* @memberof Containers
* @param {Navbar} Component, renders navigation bar.
* @param {InputForm} Component, renders input form to enter name of country
* @param {checkTrip} Redux-action, updates redux state of trip with local storage
* @param {authCheckState} Redux-action, updates redux state of user with local storage
* @param {newTrip} Redux-action, updates redux state of updated trip info
*/
class StartPage extends Component {

	componentDidMount() {
		//Updates login status into redux.
		this.props.onTryAutoSignup();
		this.props.checkTrip();
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
		onTryAutoSignup: () => dispatch(actions.authCheckState()),
		checkTrip: () => dispatch(actions.checkTrip())
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(StartPage);
