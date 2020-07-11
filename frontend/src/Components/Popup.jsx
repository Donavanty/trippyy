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

        return (
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
                </div>
            </Popup>)
    }
}

export default Popup2

