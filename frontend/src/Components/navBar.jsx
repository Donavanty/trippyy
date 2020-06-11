
// Basic Imports
import React, { Component, Fragment } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------
import { Link } from 'react-router-dom';
import "./CSS/navBar.css";


class NavBar extends Component {

	render() {
		return (
			<nav className="navbar fixed-top navbar-expand-lg" id ="nav1">
			<Link to="/" className="navbar-brand" href="#">trippyy</Link>
			<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
			<span className="navbar-toggler-icon"></span>
			</button>

			<div className="collapse navbar-collapse col-11" id="navbar-nav" >
			<ul className="navbar-nav justify-content-center">

			<li className="nav-item">
			<Link to="/" className ="nav-link"> Home </Link>
			</li>

			<li className="nav-item">
			<Link to="/mytrips" className ="nav-link"> My Trips<span className="sr-only">(current)</span></Link>
			</li>

			{
				this.props.isAuthenticated ? 
				<React.Fragment>
				<li className="nav-item">
				<Link to= "/" className ="nav-link" onClick = {this.props.logout}>
				Logout
				</Link>
				</li>

				<li className="nav-item">
				<Link to="/mytrips" className="nav-link"> Account: {this.props.user.username} </Link>
				</li>
				</React.Fragment>
				:

				<React.Fragment>

				<li className="nav-item">
				<Link to={{
					pathname: "/login",
					state: { from: this.props.from }
				}} className="nav-link"> Login </Link>
				</li>

				<li className="nav-item">
				<Link to="/signup" className="nav-link"> Signup </Link>
				</li>

				</React.Fragment>

			}
			</ul>
			</div>
			</nav>);

	}

}


const mapStateToProps = (state) => {
	return {
		// Basic stats needed for NAV ------------
		isAuthenticated: state.user !== null,
		user: state.user
		// Basic stats needed for NAV ------------
	}
}

const mapDispatchToProps = dispatch => {
	return {
		// Basic stats needed for NAV ------------
		onTryAutoSignup: () => dispatch(actions.authCheckedState()),
		logout: () => dispatch(actions.logouted())
		// Basic stats needed for NAV ------------
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(NavBar);