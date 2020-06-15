// Basic Imports
import React, { Component, Fragment } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import axios from "axios"
import { Button , Spinner} from 'react-bootstrap'
import "./CSS/SelectedActivityList.css";
import Popup from "reactjs-popup";

class SelectedActivityList extends Component{
    componentDidMount() {
    }

    state = {
        open: false,
        iti :[],
        localLoading : false
    }

    getItinerary = () => {
        this.setState({localLoading: true})
        const data = {
            lengthOfTrip: 5,
            activitiesAdded: this.props.trip.activitiesAdded
        }
        axios.post("https://trippyy-backend.herokuapp.com/api/algo/", data).then( (res) => {
            this.setState({ iti: JSON.parse(res.data)});
            this.setState({localLoading: false})
        })

        this.setState({open: true})
    }

    closeModal = () => {
        this.setState({open: false})
    }

    render() {
        return (
            <Fragment>
                <Button variant="info" className="customButton" onClick={this.getItinerary} value="general">Get Itinerary</Button>
            	<div id="selectedActivityList">
            		{
            			this.props.trip["activitiesAdded"].map( (value, index) => <p key={index}> {value.name} </p>)
            		}
            	</div>;

                <Popup
                    open={this.state.open}
                    closeOnDocumentClick
                    onClose={this.closeModal}
                >
                    <div>
                        <button className="close" onClick={this.closeModal}>
                            CLOSE
                        </button>
                        <h2> NOTE: CURRENT LENGTH OF TRIP HARD-CODED TO 5 </h2>

                        {
                            this.state.localLoading ? 
                                <Spinner animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </Spinner> 
                            :
                                this.state.iti.map((value,index) => 
                                <div key={index}>
                                    <h2> Day {index+1} </h2>
                                {
                                    value.map((value,index) => 
                                        <p key={index}> {JSON.parse(value)["name"]} </p>
                                    )
                                }

                            </div>)
                        }

                    </div>
                </Popup>
            </Fragment>)
    }
}

const mapStateToProps = (state) => {
    return {
        trip: state.trip,
    }
}

const mapDispatchToProps = dispatch => {
    return {
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SelectedActivityList);