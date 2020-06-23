// Basic Imports
import React, { Component } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import "./CSS/Timetable.css"

/**
 * Component, renders activities currently added into the trip in a timetable manner,
 * enabling it to be customizable by dragging the blocks around.
 * @memberof Component
 * @param {ReduxState} trip: Contains information about current trip (e.g. trip name/date, and list of current activities added)
 * @param {ReduxAction} itineraryUpdate: Updates redux state to update itinerary.
 */
class Timetable extends Component {

	state = {
		fromIndex: -1,
		fromDayIndex: -1,
	}

	/**
	* Called upon selection of activity block.
	* @param {event} Contains information about mouse location etc.
	*/
	onDragStart = (event) => {
    	this.setState({fromIndex: event.target.dataset.index})
    	this.setState({fromDayIndex: event.target.dataset.dayindex})
	}

	/**
	* Called everytime the mouse moves when dragging.
	* @param {event} Contains information about mouse location etc.
	*/
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


	/**
	* Called when activity is dropped.
	* @param {event} Contains information about mouse location etc.
	*/
	onDrop = (event) => {
		event.preventDefault();
	}

	render() {
		if (!this.props.trip["itinerary"]) {
			return <h1> loading </h1>
		}
	    return (
		    <div id="timetable"
		    		onDragOver={(event)=>this.onDragOver(event)}
	      			onDrop={this.onDrop}>
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
								onDragStart = {this.onDragStart}
							    style ={{backgroundColor: value.bgcolor}}
							>
							    <p> {JSON.parse(value)["name"]} </p>
					    	</div>
					    	}
					    	return null;
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