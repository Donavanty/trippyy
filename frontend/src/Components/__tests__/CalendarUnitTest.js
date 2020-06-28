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
it("Checks that a calendar renders.", () => {
	act(() => {
		const updateDates = jest.fn()
		window.scrollTo = jest.fn()
		render(
			<div>
				<Calendar updateDates={updateDates}/>
			</div> , container
		)
	})

	const calendar = container.querySelector("div[class='DateRangePickerInput DateRangePickerInput_1 DateRangePickerInput__withBorder DateRangePickerInput__withBorder_2']");
	expect(calendar).toEqual(expect.anything());
});
