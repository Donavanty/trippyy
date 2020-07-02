// Basic Testing Imports
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { BrowserRouter as Router} from 'react-router-dom';

// Redux Testing imports
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store';
import trip from "./DummyTrip"

// Component Imports
import SelectedActivityList from "../SelectedActivityList"


// Standard testing starting framework ------------------------------------
const mockStore = configureStore([]);
let container = null;
let store;

beforeEach(() => {
  // Setting mock store
  store = mockStore({
    trip: trip
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
  store= null;
});

// Testing starts --------------------------------------------------------------------------
it("Check that selected activity list renders ONE activity from dummy, and redux action is called when get iti button is pressed", () => {
  act(() => {
    render(
      <Provider store={store}>
        <Router>
          <SelectedActivityList/>
        </Router>
      </Provider>, container
    );
  })

  // Check that the text content rendered is correct.
  expect(container.querySelector("div[id='selectedActivityList']").textContent).toEqual("1 : Singapore Flyer")

  // Find get iti button, and click it, and check that ONE redux action was called.
  act(() => {
    const getItineraryButton = container.querySelector("a[class='itiButton']")
    getItineraryButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(store.dispatch).toHaveBeenCalledTimes(1);
});
