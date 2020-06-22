// Basic Imports
import React, { Component, Fragment } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import "./CSS/Timetable.css"

class Timetable extends Component {

	state = {
		tasks: [
	      {id: "0", taskName:"Read book",type:"Done", bgcolor: "peachpuff"},
	      {id: "1", taskName:"Pay bills", type:"Done", bgcolor:"peachpuff"},
	      {id: "2", taskName:"Go to the gym", type:"Done", bgcolor:"peachpuff"},
	      {id: "3", taskName:"Play baseball", type:"Done", bgcolor:"peachpuff"}
		],
		fromIndex: -1,
		fromDayIndex: -1,
	}

	onDragStart = (event, taskName) => {
    	this.setState({fromIndex: event.target.dataset.index})
    	this.setState({fromDayIndex: event.target.dataset.dayindex})
	}

	onDragOver = (event) => {
		event.preventDefault()
		//Defining the positions of the block
		const toIndex = event.target.dataset.index;
		const toDayIndex = event.target.dataset.dayindex;
		const fromIndex = this.state.fromIndex;
		const fromDayIndex = this.state.fromDayIndex;

		// If it is at the same position, do not run.
		if (toIndex === fromIndex && toDayIndex === fromDayIndex) {
			return;

		// Update the itinerary in redux.
		} else if (toIndex !== undefined && toDayIndex !== undefined) {
			this.props.itineraryUpdate([toDayIndex, toIndex], [fromDayIndex, fromIndex]);
			this.setState({fromIndex: toIndex});
			this.setState({fromDayIndex: toDayIndex});
		}
	}

	// Just remove original index.
	replaceActivity = (toIndex, fromIndex) => {
		var originalActivity = this.state.tasks[fromIndex]
		originalActivity.bgcolor = "yellow"
		var newtasks = [...this.state.tasks];
		newtasks.splice(fromIndex, 1);
		newtasks.splice(toIndex, 0, originalActivity);

		this.setState({
			tasks: newtasks
		})

	}

	onDrop = (event, cat) => {
		event.preventDefault();
	}

	render() {
		if (!this.props.trip["itinerary"]) {
			return <h1> loading </h1>
		}
	    return (
		    <div id="timetable"
		    		onDragOver={(event)=>this.onDragOver(event)}
	      			onDrop={(event)=>{this.onDrop(event)}}>
	          {this.props.trip["itinerary"].map( (value, dayindex) => (
	          	<div className="day">
	          		{
	          			value.map((value, index) => {
	          				if (index !== 0) {
				          	return <div
				          		key={index}
				          		data-index={index}
				          		data-dayindex={dayindex}
				          		draggable
				          		className="timetableActivity"
								onDragStart = {(event) => this.onDragStart(event, value.taskName)}
							    style ={{backgroundColor: value.bgcolor}}
							>
							    <p> {JSON.parse(value)["name"]} </p>
					    	</div>
					    	}
					    })
				    	
			    	}
	          	</div>)
	          )}
	        </div>
	    );
  	}
}


const mapStateToProps = (state) => {
    return {
        trip: state.trip,
    }
}

const mapDispatchToProps = dispatch => {
    return {
    	itineraryUpdate: (toIndex, fromIndex) => dispatch(actions.itineraryUpdate(toIndex, fromIndex))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Timetable);