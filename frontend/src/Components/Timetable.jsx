// Basic Imports
import React, { Component } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import "./CSS/Timetable.css"
import { Spinner } from 'react-bootstrap';

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

	focusDay = (dayActivities) => {
		this.props.itineraryFocusDay(dayActivities);
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
		}

		// Checks and makes sure that the EMPTY box is always at the end.
		if (this.props.trip["itinerary"][toDayIndex] !== undefined) {
			if (parseInt(toIndex) === (this.props.trip["itinerary"][toDayIndex].length - 1) && 
				this.props.trip["itinerary"][toDayIndex][toIndex] === "EMPTY" && 
				(fromIndex < toIndex) &&
				(toDayIndex === fromDayIndex)) {
				return;
			}
		}



		// Determine rectangle on screen
		const hoverBoundingRect = event.target.getBoundingClientRect()
		// const hoverMiddleX =
		//   hoverBoundingRect.right - ((hoverBoundingRect.right - hoverBoundingRect.left) / 2)

		// Get Middle (the number 49 is half the width of a small box)
		const hoverMiddleX = hoverBoundingRect.right

		// console.log(hoverBoundingRect.right-hoverBoundingRect.left)
		// if ((hoverBoundingRect.right - hoverBoundingRect.left) > 100) {
		// 	hoverMiddleX = hoverBoundingRect.left + 100;
		// }

		// Determine mouse position
		const currentMouseX = event.clientX
		if (currentMouseX < hoverMiddleX) {
			// Update the itinerary in redux.
			if (toIndex !== undefined && toDayIndex !== undefined) {
				this.props.itineraryUpdate([toDayIndex, toIndex], [fromDayIndex, fromIndex]);
				this.setState({fromIndex: toIndex});
				this.setState({fromDayIndex: toDayIndex});
			}
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
		if (this.props.getItineraryLoading) {
			return (
				<div>
					<h1> Getting your trip! </h1>
					<Spinner animation="border" role="status">
				  		<span className="sr-only">Loading...</span>
					</Spinner>

				</div>)
		}
	    return (
		    <div id="timetable"
		    		onDragOver={(event)=>this.onDragOver(event)}
	      			onDrop={this.onDrop}>

	      		<h2> Your timetable! </h2>
	          {this.props.trip["itinerary"].map( (dayValue, dayindex) => (
	          	<React.Fragment>
	          	<div className="day">
	          		<div className="dayDetails"> 
	          			<p> Day {dayindex+1} </p>
						<button onClick={() => this.focusDay(dayValue)}> View Day! </button>

	          			
	          		
	          		</div>

	          		{
	          			dayValue.map((value, index) => {
	          				if (index !== 0 && value !== "EMPTY") {
					          	return <div
					          		key={index}
					          		data-index={index}
					          		data-dayindex={dayindex}
					          		draggable
					          		className="timetableActivity"
									onDragStart = {this.onDragStart}
								    style ={{width: ((value["recommendedTime"]/60.0) * 3)+ "vw"}}
								>
								    <p className="activityFont"
								    data-index={index}
					          		data-dayindex={dayindex}> {(value)["name"]}
					          		</p>
								    <p className="timeFont"
								    data-index={index}
					          		data-dayindex={dayindex}> {(value)["recommendedTime"]/60} hours </p>
								</div>
					  		} else if (value === "EMPTY") {
					  			return <div 
					          		key={index}
					          		data-index={index}
					          		data-dayindex={dayindex}
					          		className="empty"
									onDragStart = {this.onDragStart}
									/>
					  		}
					  		return null;
						})
			    	}
	          	</div>
	          	</React.Fragment>)
	          )}
	        </div>
	    );
  	}
}


const mapStateToProps = (state) => {
    return {
        trip: state.trip,
        getItineraryLoading: state.getItineraryLoading,
        itineraryFocusDayLoading: state.itineraryFocusDayLoading,

    }
}

const mapDispatchToProps = dispatch => {
    return {
    	itineraryUpdate: (toIndex, fromIndex) => dispatch(actions.itineraryUpdate(toIndex, fromIndex)),
    	itineraryFocusDay: (dayActivities => dispatch(actions.itineraryFocusDay(dayActivities)))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Timetable);