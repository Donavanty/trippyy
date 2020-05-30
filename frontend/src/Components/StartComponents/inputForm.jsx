import React, {Component} from 'react';
import "./inputForm.css"
import axios from "axios";
import Calendar from "./calendar"
import { connect } from 'react-redux';
import * as actions from '../../store/actions/actions';
import { Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

class InputForm extends Component {

	state = {
		startDate: null,
		endDate: null,
		newTripCreated: false,
		goToShoppingPage: false
	}

	updateDates = (startDate, endDate) => {
		this.setState({startDate, endDate});
	}


	newTrip = (event) => {
		event.preventDefault();
		this.props.newTrip(event.target.country.value, this.state.startDate, this.state.endDate);
		this.setState({newTripCreated: true});
	}

	//If new trip created is true, and loading is complete, then go to shopping page.
	static getDerivedStateFromProps(nextProps, prevState){
	  if (nextProps.loading===false && prevState.newTripCreated===true){
	     return { goToShoppingPage: true };
	  }
	  else return null;
	}

	//Happens upon receiving updated information.
    componentDidUpdate(prevProps, prevState, snapshot) {
    	if (this.state.goToShoppingPage === true) {
    		this.props.history.push("/shopping");
    	}
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
	                	{ !this.props.loading ? 
	                		<button> Submit </button> 
	                		:
							<Spinner animation="border" role="status">
							  <span className="sr-only">Loading...</span>
							</Spinner>

	                	}
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
        loading: state.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        newTrip: (country, startDate, endDate) => dispatch(actions.newTrip(country, startDate, endDate)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputForm);