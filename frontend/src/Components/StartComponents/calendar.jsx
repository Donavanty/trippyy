import React, { Component } from 'react';


import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import { DateRangePicker } from 'react-dates';

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