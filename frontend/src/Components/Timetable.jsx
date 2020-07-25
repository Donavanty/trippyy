// Basic Imports
import React, { Component } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import "./CSS/Timetable.css"
import { Spinner, DropdownButton } from 'react-bootstrap';
import NextPage from '../assets/nextpage.png'
import Plane from '../assets/plane.png'

// Rendering
import { PDFDownloadLink} from '@react-pdf/renderer'
import PDFRender from './PDFRender'

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
		day: ["0900", "1000", "1100", "1200", "1300", "1400", "1500", "1600",
			"1700", "1800", "1900", "2000", "2100", "2200", "2300", "0000", "0100", "0200"], 
		numDays: ["Mon", "Tues", "Wed", "Thu", "Fri"],
		dayStart: 0,
		show: false,
	}

	focusDay = (index) => {
		if (this.props.trip.focusedDay === index) {
			this.props.itineraryFocusDay(-1);
			return;
		}
		this.props.itineraryFocusDay(index);
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
		if (this.props.trip["itinerary"][toDayIndex] && this.props.trip["itinerary"][fromDayIndex]){
			if ((this.props.trip["itinerary"][toDayIndex][0] + 
				this.props.trip["itinerary"][fromDayIndex][fromIndex].recommendedTime) > 840) {
			return;
			}
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
		this.props.itineraryLoadDirections(this.props.trip.itinerary);
		event.preventDefault();
	}

	goPrevPage = () => {
		this.setState({dayStart: this.state.dayStart - 5})
	}

	goNextPage = () => {
		this.setState({dayStart: this.state.dayStart + 5})
	}

	render() {
	    return (
	    	<div className="timetableContainerBox">

	    	{/** Header **/}
	    	<h4> {this.props.trip.lengthOfTrip} days in {this.props.trip.country} </h4>

	    	{/** Export Button **/}
	    	<DropdownButton id="dropdown-basic-button" title="Export"
	    		onClick= {() => this.setState({show: true})}>
			  
			  	{this.state.show && 
	    		<PDFDownloadLink 
	    			document={<PDFRender trip={this.props.trip}/>} 
	    			fileName="somename.pdf"
	    		>
		      		{({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'As PDF')}
		    	</PDFDownloadLink>}
			  
			</DropdownButton>

			{/** Timetable! **/}
		    <div 	id="timetableBox"
		    		onDragOver={(event)=>this.onDragOver(event)}
	      			onDrop={this.onDrop}
	      			>
	      		{/** Timetable Grid **/}
	      		<div className="gridContainer">
	      			{ (this.state.dayStart > 0) &&
	      				<div className="changePageBox changePageBox-left">  
							<img className="changePageIcon" onClick={this.goPrevPage} alt="icon" src={NextPage}/> 
	      				</div>
	      			}
		      		<div className="timeDay">
		      			{
		          			this.state.day.map((value,index) => {
		          				return <div className="timeBlock"> {value} </div>
		          			})
		          		}

		      		</div>
		      		{
			      		this.state.numDays.map((value,index) => {
			      			return(
			      			<div className="insideTimeDay">
				          		<div className="dayBackground"> 
				          		</div>
				      			{
				          			 true && this.state.day.map((value,index) => {

				          				if (index%2 ===0) {
				          					return <div className="insideTimeBlock-even"/> 
				          				} else {
				          					return <div className="insideTimeBlock-odd"/>
				          				}
				          			})
				          		}
			      			</div>)
			      		})
		      		}

		      		{	((this.state.dayStart+5) < this.props.trip["itinerary"].length) && 
		      			<div className="changePageBox"> 
		      				<img className="changePageIcon changePageIcon-right" alt="icon" onClick={this.goNextPage} src={NextPage}/> 
		      			</div>
		      		}
	      		</div>

	      		{/** Loading box rendering! **/}
	      		{this.props.itineraryLoadDirectionsLoading && 
					<div className="loadingBox">
						<Spinner animation="border" role="status">
					  		<span className="sr-only">Loading...</span>
						</Spinner>
					</div>
	      		}

	      		{/** Loading activities **/}
	      		{!this.props.itineraryLoadDirectionsLoading && <div className ="daysContainer">
		          	{this.props.trip["itinerary"].map( (dayValue, dayindex) => {
		          	if (dayindex < this.state.dayStart || dayindex >= this.state.dayStart+5) {
		          		return null;
		          	}
		          	return <div className="day">
		          		<div onClick={() => this.focusDay(dayindex)} className="dayDetails"> 
		          			<p> Day {dayindex+1} </p>
		          		</div>

		          		{
		          			true && dayValue.map((value, index) => {
		          				if (index !== 0 && value !== "EMPTY") {
						          	return (
						          		<React.Fragment>
							          		<div
								          		key={index}
								          		data-index={index}
								          		data-dayindex={dayindex}
								          		draggable
								          		className="timetableActivity"
												onDragStart = {this.onDragStart}
											    style ={{height: ((value["recommendedTime"]/60.0) * 5)+ "vh"}}
											>
												<div className="timetableActivityDetails">
												    <p className="activityFont"
												    data-index={index}
									          		data-dayindex={dayindex}> 

									          			 {(value)["name"]} ({String.fromCharCode(dayindex + 'a'.charCodeAt(0)) + index})
									          		
									          		</p>


												    <p className="timeFont"
												    data-index={index}
									          		data-dayindex={dayindex}> 

									          			{(value)["recommendedTime"]/60} hours 
									          		
									          		</p>
									          	</div>
											</div>

										
											{ this.props.trip.itiDirections[dayindex][index-1] && 
												<div
													style ={{height: ((this.props.trip.itiDirections[dayindex][index-1].routes[0].legs[0].duration.value/3600.0) * 5)+ "vh"}}
													className="timetableActivity"
												>
													<div className="timetableTravelDetails">
														{(((this.props.trip.itiDirections[dayindex][index-1].routes[0].legs[0].duration.value/60)) > 60) && 
															<img src={Plane} alt="icon" className="planeIcon"/>}
														{(((this.props.trip.itiDirections[dayindex][index-1].routes[0].legs[0].duration.value/60)) > 15) && 
															this.props.trip.itiDirections[dayindex][index-1].routes[0].legs[0].duration.text
														}
													</div>
												</div>
											}

										</React.Fragment>)
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
		          	</div>}
		          )}
	        </div>}
	        </div>
	        </div>
	    );
  	}
}


const mapStateToProps = (state) => {
    return {
        trip: state.trip,
        getItineraryLoading: state.getItineraryLoading,
        itineraryFocusDayLoading: state.itineraryFocusDayLoading,
        itineraryLoadDirectionsLoading: state.itineraryLoadDirectionsLoading,

    }
}

const mapDispatchToProps = dispatch => {
    return {
    	itineraryUpdate: (toIndex, fromIndex) => dispatch(actions.itineraryUpdate(toIndex, fromIndex)),
    	itineraryFocusDay: (dayActivities => dispatch(actions.itineraryFocusDay(dayActivities))),
    	itineraryLoadDirections: (itinerary => dispatch(actions.itineraryLoadDirections(itinerary))),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Timetable);