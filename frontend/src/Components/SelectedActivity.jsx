// Basic Imports
import React, { Component } from "react";
// -------------------------------------------------------------------------
import "./CSS/SelectedActivity.css";
import Popup from "reactjs-popup";


/**
 * Component, renders a single activity.
 * @memberof Component
 * @param {Object} value: details of the activity
 * @param {number} displayIndex: index to show in website
 * @param {number} index: index of activity
 */
class SelectedActivity extends Component{
	state = {
		open: false,
		sliderValue: (this.props.value.recommendedTime/60),
		sliderOpen: false,
	}

	beautifyText = (text) => {
		var output = ""
		for (var i in text) {
			if (i < 1) {
				output = output + text[i].toUpperCase()
			} else if (text[i] === "_") {
				output = output + " ";
			} else {
				output = output + text[i]
			}
		}
		return output;
	}

	popupToggle = () => {
		if (!this.state.open) {
			this.setState({sliderValue: (this.props.value.recommendedTime/60)})
		}
		this.setState({open: !this.state.open})
	}
	
	closeModal = () => {
		this.setState({open: false})
	}

	onSave = (activity) => {
		this.props.activitiesEdit(activity, (this.state.sliderValue * 60));
		this.setState({open: false})
	}

	onSliderChange = (event) => {
		this.setState({sliderValue: event.target.value})
	}

	sliderToggle = () => {
		this.setState({sliderOpen: !this.state.sliderOpen});
	}

	activitiesSubtract = (value) => {
		this.props.activitiesSubtract(value);
		this.setState({open: false})
		this.setState({sliderValue: (this.props.value.recommendedTime/60)})
	}
	render() {
		return (
		<div>
			<div id="selectedActivityBox" onClick={this.popupToggle}> 
				<p className="nameText"> {this.props.value.name} </p>
				<p className="miniText"> Duration: {this.props.value.recommendedTime/60}h</p>
			</div>

			<Popup
		        open={this.state.open}
		        closeOnDocumentClick
		        onClose={this.closeModal}
	        >
	            <div className="popupBox row">
	                <button className="close" onClick={this.closeModal}>
	                	X
	                </button>
	                <div className="infoBox col-6">
	                	<button 
	                		className="trippyyButtonSquare deleteButton"
	                		onClick={() => this.activitiesSubtract(this.props.value)}
	                	> 
	                		Delete 
	                	</button>	
						<h4> {this.props.value.name} </h4> 
						<div className="selectedActivityDesBox">
			                <p> {this.props.value.formatted_address} </p>
			                <p> {this.beautifyText(this.props.value.types[0])} </p>
			            </div>

		                <div className="recommendedTimeBigBox">
		                	<div className="recommendedTimeSmallBox">
		                		<p> Recommended Duration : </p> <input 
		                							value={(this.state.sliderValue).toString() + "h"}
		                							onClick={this.sliderToggle}
		                							className="inputText"		
		                							/>
		                	</div>

		                	{this.state.sliderOpen && 
		                		<div className="sliderBox">
			                		<input 
				                		type="range" 
				                		min="1" 
				                		max="8"
				                		step="0.5"
				                		value={(this.state.sliderValue)}
				                		class="slider" 
				                		onChange={this.onSliderChange}
			                		/>
			                		<div 
			                			className="sliderValue"
			                			style={{"margin-left": ((this.state.sliderValue * 2.5)-2.5) + "vw"}}
			                		> 
			                			{this.state.sliderValue} 
			                		</div>
		                		</div>
		                	}
					    </div>

					    <div className="popupButtonsBox">
					    	<button className="trippyyButton" onClick={() => this.onSave(this.props.value)}> Save </button>
					    	<button className="trippyyButton quitButton" onClick={this.closeModal}> Quit </button>	
					    </div>
					</div>

					<div className="photoBox col-6">
				        <div className="triangle"/> 
				        <img src={this.props.value.displayPhoto} className="activityPhoto" alt="eek"/>
					</div>
	            </div>	
	        </Popup>
	    </div>
	    );
	}
}

export default SelectedActivity;

