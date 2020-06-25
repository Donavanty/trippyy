// Basic Testing Imports
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import userEvent from '@testing-library/user-event'
import { screen} from '@testing-library/react'

// Component Imports
import Calendar from "../Calendar"


// Standard testing starting framework -------------------------------------
let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

// Testing starts --------------------------------------------------------------------------
it("Checks that a calendar renders, and calls a method when dates are inputted", () => {
	act(() => {
		const updateDates = jest.fn()
		render(
			<div>
				<Calendar updateDates={updateDates}/>
			</div> , container
		)

		const startDate = (container.querySelector("input[id='startDate']"))	
		// console.log(screen.debug())

		const endDate = (container.querySelector("input[id='endDate']"))
		// userEvent.click(endDate);
		// console.log(screen.debug())
		userEvent.type(startDate, '10/10/2025')
		userEvent.click(endDate);
		userEvent.type(endDate, '10/12/2025')
		// console.log(screen.debug())
		

		expect(updateDates).toHaveBeenCalledTimes(0);
	})
});
