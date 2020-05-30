import React, {Component} from 'react';
import "bootstrap/dist/css/bootstrap.css";
import NavBar from '../Components/navBar';
import InputForm from '../Components/StartComponents/inputForm'
import Calendar from '../Components/StartComponents/calendar'
import "./CSS/global.css"
import axios from "axios";

import {connect} from 'react-redux';
import * as actions from '../store/actions/actions'


class StartPage extends Component {

	componentDidMount() {
		//Updates login status into redux.
		this.props.onTryAutoSignup();
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
		isAuthenticated: state.token !== null,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onTryAutoSignup: () => dispatch(actions.authCheckedState()),
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(StartPage);
