import React, { Component , Fragment} from 'react';

// -------------------------------------------------------------------------
import "./CSS/ActivitySearchAutocomplete.css"
import PlacesAutocomplete, {
} from 'react-places-autocomplete';

/**
 * Component, renders input bar for entering destination city of trip.
 * @memberof Component
 * @param {updateCountry} Method: passed from parent to update country information.
 * @returns Rendered input bar with autocomplete functionality
 */
class ActivitySearchAutoComplete extends Component {

  componentDidMount() {
  	
  }
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
    // this.props.updateCountry(address, null);
  };

  /**
  * Called when user selects a City, updateCountry called upon selection.
  * @param {updateCountry} Method: passed from parent to update country information.
  * @param {String} address: Address inputted by user
  */
  handleSelect = (address, placeId, suggestion) => {
  	console.log(placeId)
    this.setState({ address });
    this.props.selectAddress(address, placeId);
    this.setState({address: ""})
  };

  searchOptions = {
    bounds: JSON.parse(localStorage.trip)["geometry"]["bounds"]
  }

  addSuggestions = (suggestions) => {
  	this.props.addSuggestions(suggestions);
  }

  loadItems = ({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
	         return (<div>
		        <input
		        {...getInputProps({
		          placeholder: 'Search',
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


			              return (
			                  <div
			                  {...getSuggestionItemProps(suggestion, {
			                    className,

			                  })}
			                  >
			                  <span>{suggestion.description}</span>
			                  </div>
			                  );
			              })}

	       		</div>
	        </div>)
	    }
        
  render() {
    return (
      <Fragment>
      <PlacesAutocomplete
      value={this.state.address}
      onChange={this.handleChange}
      onSelect={this.handleSelect}
      searchOptions={this.searchOptions}
      highlightFirstSuggestion={true}
      >
      	{this.loadItems}

      </PlacesAutocomplete>

      </Fragment>


      );
  }
}

export default ActivitySearchAutoComplete;
