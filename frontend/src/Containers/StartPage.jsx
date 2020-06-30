// Basic Imports
import React, { Component } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import "bootstrap/dist/css/bootstrap.css";
import NavBar from '../Components/navBar';
import InputForm from '../Components/InputForm'
import "./CSS/global.css"
import "./CSS/Start.css"

/** Container, renders sign up page.
* @memberof Container
* @param {Component} Navbar, renders navigation bar.
* @param {Component} InputForm, renders input form to enter name of country
* @param {ReduxAction} checkTrip, updates redux state of trip with local storage
* @param {ReduxAction} authCheckState, updates redux state of user with local storage
* @param {ReduxAction} newTrip, updates redux state of updated trip info
*/
class StartPage extends Component {


	componentDidMount() {
		//Updates login status into redux.
		this.props.onTryAutoSignup();
		this.props.checkTrip();
	}

	render() {
	  return (
	    <div id="startPage">
	    	<NavBar from={this.props.location.pathname}/>
	    	<div className="bigBox">
	    		<InputForm history={this.props.history} />
	    	</div>
	    	
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
