import React, { Component } from 'react';
/* global google */

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

/**
 * Component, renders input bar for entering destination city of trip.
 * @memberof Components
 * @param {updateCountry} Method: passed from parent to update country information.
 * @returns Rendered input bar with autocomplete functionality
 */
class Autocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = { address: '' };
  }

  /**
  * Called upon any character input/delete.
  * @param {String} address: Address inputted by user
  */
  handleChange = address => {
    this.setState({ address });
    this.props.updateCountry(address, null);
  };

  /**
  * Called when user selects a City, updateCountry called upon selection.
  * @param {updateCountry} Method: passed from parent to update country information.
  * @param {String} address: Address inputted by user
  */
  handleSelect = address => {
    this.setState({ address });
    geocodeByAddress(address)
    .then(results => getLatLng(results[0]))
    .then(latLng => this.props.updateCountry(address, latLng))
    .catch(error => console.log(error));
  };

  searchOptions = {
    types: ['(regions)']
  }

  render() {
    return (
      <PlacesAutocomplete
      value={this.state.address}
      onChange={this.handleChange}
      onSelect={this.handleSelect}
      searchOptions={this.searchOptions}
      highlightFirstSuggestion={true}
      >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
        <input
        {...getInputProps({
          placeholder: 'Search City',
          className: 'location-search-input',
        })}
        />
        <div className="autocomplete-dropdown-container">
        {loading}
        {suggestions.map(suggestion => {
          const className = suggestion.active
          ? 'suggestion-item--active'
          : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                  >
                  <span>{suggestion.description}</span>
                  </div>
                  );
              })}
        </div>
        </div>
        )}
      </PlacesAutocomplete>
      );
  }
}

export default Autocomplete