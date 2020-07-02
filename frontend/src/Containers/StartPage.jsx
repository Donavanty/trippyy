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
import { Spinner } from 'react-bootstrap';
import "./CSS/global.css"
import "./CSS/Start.css"
import SBG from '../assets/startBackground.jpg'
import { LazyLoadImage } from 'react-lazy-load-image-component';
/** Container, renders sign up page.
* @memberof Container
* @param {Component} Navbar, renders navigation bar.
* @param {Component} InputForm, renders input form to enter name of country
* @param {ReduxAction} checkTrip, updates redux state of trip with local storage
* @param {ReduxAction} authCheckState, updates redux state of user with local storage
* @param {ReduxAction} newTrip, updates redux state of updated trip info
*/
class StartPage extends Component {

	state = {
		bgLoading: true,
	}

	componentDidMount() {
		//Updates login status into redux.
		this.props.onTryAutoSignup();
		this.props.checkTrip();
		this.setState({bgLoading: false});
	}

	render() {
		if (this.state.bgLoading) {
			return (
			<div className ="loadingBox">
				<Spinner animation="border" role="status">
				  <span className="sr-only">Loading...</span>
				</Spinner>
			</div>);
		}
		
	  return (

	    <div id="startPage" className="animate__animated animate__fadeIn">
	    	<LazyLoadImage 
	    		src={SBG} 
	    		ref={this.bgRef} 
	    		id="startBg"/>
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
		loading: state.loading
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onTryAutoSignup: () => dispatch(actions.authCheckState()),
		checkTrip: () => dispatch(actions.checkTrip())
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(StartPage);
