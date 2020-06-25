import React, { Component } from 'react';


import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import { DateRangePicker } from 'react-dates';

/**
 * Component, renders calendar for entering dates of trip.
 * @memberof Component
 * @param {updateDates} Method: passed from parent to update date information.
 * @returns Rendered calendar to input dates easily
 */
class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null,
      focusedInput: null,
    };
  }

  render() {
    return (
        <DateRangePicker
          startDateId="startDate"
          endDateId="endDate"
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          onDatesChange={({ startDate, endDate }) => 
            { 
              this.setState({ startDate, endDate });
              console.log("Start: ");
              console.log(startDate);
              console.log("End: ")
              console.log(endDate);
              if (endDate !== null && startDate !== null) {
                this.props.updateDates(startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD"));
              }
            }
          }
          focusedInput={this.state.focusedInput}
          onFocusChange={(focusedInput) => { this.setState({ focusedInput })}}
        />
    );
  }
}

export default Calendar;
