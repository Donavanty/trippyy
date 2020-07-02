// Basic Testing Imports
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { screen} from '@testing-library/react'
// Component Imports
import Activity from "../Activity"


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
it("Renders with index < 10, added is true, checks for className, id, and text content", () => {
	act(() => {
		const testValue = {
			added: true,
			name : "ActivityTest",
			types : ["park"]
		}
		const testIndex = 9
		render(
			<Activity
				value={testValue}
				displayIndex={testIndex}
				index={testIndex}
			/> , container
		)
		expect(container.textContent).toContain("ActivityTest")
		expect(container.querySelector("button[id='added']")).toEqual(expect.anything())
	})
});


it("Renders with index > 10, added is false, checks for className, id, and text content", () => {
	// If it activity is added, render
	act(() => {
		const testValue = {
			added: false,
			name : "ActivityTest",
			types : ["park"]
		}
		const testIndex = 20
		render(
			<Activity
				value={testValue}
				displayIndex={testIndex}
				index={testIndex}
			/> , container
		)

		expect(container.textContent).toContain("ActivityTest")
		expect(container.querySelector("button[id='notAdded']")).toEqual(expect.anything())
	})
});
