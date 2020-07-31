// Basic Importsre
import React, { Component } from "react";
// -------------------------------------------------------------------------
import "./CSS/ResultDirection.css";
import Bus from '../assets/bus.png'
import Vehicle from '../assets/vehicle.png'
import Dot from '../assets/dot.png'
import VerticalLine from './VerticalLine'
import CenterVerticalLine from'./CenterVerticalLine'
import { Markup } from 'interweave';

/**
 * Component, renders a single activity.
 * @memberof Component
 * @param {Object} value: details of the activity
 * @param {number} displayIndex: index to show in website
 * @param {number} index: index of activity
 */
class ResultDirection extends Component{
	state = {
		showDirection: false,
		classNameEnter: "animate__animated animate__lightSpeedInLeft animate__faster",
		classNameExit: "animate__animated animate__lightSpeedOutRight animate__faster",
		className: "animate__animated animate__lightSpeedInLeft animate__faster",
	}
	
	showDirectionsHandler = () => {
		this.setState({showDirection: !this.state.showDirection})
		this.props.mapAddDirections(this.props.direction);
	}


	render() {
		if (!(this.props.direction && this.props.direction.routes)) {
			return null;		
		}
		return(
			<React.Fragment>
			<div className="directionBox">
				<img className="busIcon" alt="bus" onClick={this.showDirectionsHandler}src={Bus}/>
				{this.props.direction && <p className="travelTime"> {this.props.direction.routes[0].legs[0].duration.text} </p>} 
			</div>
			
			{
				this.state.showDirection && <div className={this.state.className}>
					<VerticalLine/>
					<div className="detailedDirectionsBox">
						{
							this.props.direction.routes[0].legs[0].steps.map((value, index) => {
								return (
									<div className="instructionBox">
										<img alt="marker" className="markerIcon" src={Vehicle}/>
										<Markup content={value.instructions}/>
										<img alt="dot" className="dotIcon" src={Dot}/> 
										<CenterVerticalLine value={value}/>

									</div>)
							})
						}
					</div>
				</div>
			}
			</React.Fragment>
		)
	}
}

export default ResultDirection;