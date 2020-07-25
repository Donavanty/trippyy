// Basic Testing Imports
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { BrowserRouter as Router} from 'react-router-dom';

// Redux Testing imports
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store';
import user from "./DummyUser"

// Component Imports
import NavBar from "../navBar"


// Standard testing starting framework -------------------------------------
const mockStore = configureStore([]);
let container = null;
let store;

beforeEach(() => {
  // Setting mock store
  store = mockStore({
    user: user
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
it("Checks when logged in, nav bar shows account logged in, and no login/signup button", () => {
  act(() => {
    render(
      <Provider store={store}>
        <Router>
          <NavBar from={"/"}/>
        </Router>
      </Provider>, container
    );
  })
  expect(container.querySelector("div[id='accountLink']").textContent).toEqual("Account: admin")
  expect(container.querySelector("a[id='loginLink']")).not.toEqual(expect.anything())
  expect(container.querySelector("a[id='signupLink']")).not.toEqual(expect.anything())
});

it("Checks when NOT logged in, nav bar shows login and signup button", () => {
  act(() => {
    store = mockStore({user: null});
    render(
      <Provider store={store}>
        <Router>
          <NavBar from={"/"}/>
        </Router>
      </Provider>, container
    );
  })
  expect(container.querySelector("a[id='accountLink']")).not.toEqual(expect.anything())
  expect(container.querySelector("a[id='loginLink']")).toEqual(expect.anything())
  expect(container.querySelector("a[id='signupLink']")).toEqual(expect.anything())
});
