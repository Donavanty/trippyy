import React, {Component} from 'react';
import "./inputForm.css"
import axios from "axios";
import Calendar from "./calendar"
import { connect } from 'react-redux';
import * as actions from '../../store/actions/actions';
import { Link } from 'react-router-dom';

class InputForm extends Component {

	state = {
		startDate: null,
		endDate: null
	}

	updateDates = (startDate, endDate) => {
		this.setState({startDate, endDate});
	}

	newTrip = (event) => {
		event.preventDefault();
		this.props.newTrip(event.target.country.value, this.state.startDate, this.state.endDate);
		this.props.history.push("/mytrips")
	}

	render() {
		return (
	      <div className = "container-fluid align-items-center inputForm">
	      	{
	    		 (this.props.isAuthenticated) ?
	    			 <h1>Hello, {this.props.username}</h1> : (<h1></h1>)
	    	}
	          <div className = "jumbotron">
	              <form onSubmit = {this.newTrip}> 
	                <div>
	                	<h3> Enter Country: </h3>
	                	<input type = "text" name = "country" placeholder = "Enter country pls" />
	                </div>

	                <div className ="inputForm">
	                	<h3> Enter dates: </h3>
	                	<Calendar updateDates={this.updateDates}/>
	                </div>
	                <div className = "inputForm">
	                	<button> Submit </button>
	                </div>
	              </form>

	              
	          </div>
	      </div>);

	}

}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.token !== null,
        username: state.username,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        newTrip: (country, startDate, endDate) => dispatch(actions.newTrip(country, startDate, endDate)) 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputForm);