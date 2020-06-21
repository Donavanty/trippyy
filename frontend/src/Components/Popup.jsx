// Basic Imports
import React, { Component, Fragment } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import Popup from "reactjs-popup";

class Popup2 extends Component {

    render() {

        return (<Popup
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
        </Popup>)
    }
}

export default Popup2

