// Basic Testing Imports
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import configureStore from 'redux-mock-store';

// Component Imports
import { Provider } from 'react-redux'
import ActivityList from "../ActivityList"
import * as actions from '../../store/actions/actions';

// Importing dummy JSON files
import activitiesShown from "./DummyActivitiesShown"
import trip from "./DummyTrip"


// Standard testing starting framework ------------------------------------
const mockStore = configureStore([]);
let container = null;
let store;

beforeEach(() => {
  // Setting local storage to Singapore
  let mockTrip = JSON.stringify(trip)
  localStorage.setItem('trip', mockTrip)

  // Setting mock store
  store = mockStore({
      activitiesShown: activitiesShown,
      searchActivitiesShown: [],
      browsingToggle: true,
  });

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

  localStorage.clear();
  store= null;
});

// Testing starts --------------------------------------------------------------------------
it("Upon rendering, display 20 items and when click next page, call 2 redux actions.", () => {
	// Renders page
	act(() => {
		render(
			<Provider store={store}>
				<ActivityList/>
			</Provider>, container)
	});

	// Check for first, middle, and last location.
	expect(container.textContent).toContain("Singapore Botanic Gardens")
	expect(container.textContent).toContain("Cloud Forest")
	expect(container.textContent).toContain("Singapore Flyer")

	// Expects button to go to prev page to NOT APPEAR, and next page button to APPEAR!!
	expect(container.querySelector("button[id='prevPageButton']")).not.toEqual(expect.anything())
	expect(container.querySelector("button[id='nextPageButton']")).toEqual(expect.anything())

	// Clicks add activity button,
	act(() => {
		const nextPageButton = container.querySelector("button[id='nextPageButton']")
		nextPageButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});

	// Expects 2 redux actions, one to start loading, and one to load data.
	expect(store.dispatch).toHaveBeenCalledTimes(1);
});

