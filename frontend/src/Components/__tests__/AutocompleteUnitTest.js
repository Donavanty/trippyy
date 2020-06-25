// Basic Testing Imports
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import userEvent from '@testing-library/user-event'

// Component Imports
import Autocomplete from "../Autocomplete"


// Standard testing starting framework -------------------------------------
let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);

  // Mock google object.
  window.google = {
    maps:{
        Marker:class{},
        Map:class{ setTilt(){} fitBounds(){}},
        LatLngBounds:class{},
        places:{
            Autocomplete: class {},
            AutocompleteService:class{},
            PlacesServiceStatus: {
                INVALID_REQUEST: 'INVALID_REQUEST',
                NOT_FOUND: 'NOT_FOUND',
                OK: 'OK',
                OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
                REQUEST_DENIED: 'REQUEST_DENIED',
                UNKNOWN_ERROR: 'UNKNOWN_ERROR',
                ZERO_RESULTS: 'ZERO_RESULTS',
            },
            PlacesAutocomplete:{
                INVALID_REQUEST: 'INVALID_REQUEST',
                NOT_FOUND: 'NOT_FOUND',
                OK: 'OK',
                OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
                REQUEST_DENIED: 'REQUEST_DENIED',
                UNKNOWN_ERROR: 'UNKNOWN_ERROR',
                ZERO_RESULTS: 'ZERO_RESULTS',
            }
        },

        MarkerClusterer:class{},
        Geocoder:class{},
    }
};
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

// Testing starts --------------------------------------------------------------------------
it("Checks that an input field is rendered, and calls a method upon every character input", () => {
	act(() => {		
		const updateCountry = jest.fn()
		render(
			<div>
				<Autocomplete updateCountry={updateCountry}/>
			</div> , container
		)
		const inputField = (container.querySelector("input"))
		userEvent.type(inputField, 'TEST')

		expect(inputField).toEqual(expect.anything());
		expect(updateCountry).toHaveBeenCalledTimes(4);
	})
});
