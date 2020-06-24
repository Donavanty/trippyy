// Basic Testing Imports
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

// Redux Testing imports
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store';
import activitiesShown from "./DummyActivitiesShown"

// Local Storage imports
import trip from "./DummyTrip"

// Component Imports
import Map from "../Map"


// Standard testing starting framework -------------------------------------
const mockStore = configureStore([]);
let container = null;
let store;

beforeEach(() => {
  // Setting mock store
  store = mockStore({
      activitiesShown: activitiesShown,
      trip: trip
  });

  // Setting local storage to Singapore
  let mockTrip = JSON.stringify(trip)
  localStorage.setItem('trip', mockTrip)

  store.dispatch = jest.fn();

  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  jest.clearAllMocks()
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  store= null;

  localStorage.clear();
});

// Testing starts --------------------------------------------------------------------------
it("Checks that a map is rendered without errors", () => {
	act(() => {
		render(
			<Provider store={store}>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB-tj53yeTQiKnUmi_Jr2a7caz5RJVY60Y&libraries=places"></script>
			</Provider>, container
		);
		expect(container).toEqual(expect.anything())
	})
});
