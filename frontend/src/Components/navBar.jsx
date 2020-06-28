// Basic Imports
import React, { Component } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from "../store/actions/actions";
import { connect } from "react-redux";
// -------------------------------------------------------------------------
import { Link } from "react-router-dom";
import "./CSS/navBar.css";

/**
 * Component, renders the Navigation Bar
 * Should be able to show whether a user is logged in from here.
 * @memberof Component
 * @param {ReduxState} user: Contains information about user if logged in. (e.g. token, username)
 */
class NavBar extends Component {
  render() {
    return (
      <nav className="navbar fixed-top navbar-expand-lg" id="nav1">
        <div className="navbar-nav" id="navbar-nav">
          <div className="table">
            <ul className="navbar-ul">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  {" "}
                  Home{" "}
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/mytrips" className="nav-link">
                  {" "}
                  My Trips<span className="sr-only">(current)</span>
                </Link>
              </li>

              {this.props.isAuthenticated ? (
                <React.Fragment>
                  <li className="nav-item">
                    <Link
                      to="/"
                      className="nav-link"
                      onClick={this.props.logout}
                    >
                      Logout
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link to="/mytrips" className="nav-link" id="accountLink">
                      Account: {this.props.user.username}
                    </Link>
                  </li>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <li className="nav-item">
                    <Link
                      to={{
                        pathname: "/login",
                        state: { from: this.props.from },
                      }}
                      className="nav-link"
                      id="loginLink"
                    >
                      {" "}
                      Login{" "}
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link to="/signup" className="nav-link" id="signupLink">
                      {" "}
                      Signup{" "}
                    </Link>
                  </li>
                </React.Fragment>
              )}
            

            <li className="nav-item-right" id="right">
              <React.Fragment>
                <Link to="/" className="navbar-brand" href="#">
                  trippyy
                </Link>
              </React.Fragment>
			  </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

/* <button
className="navbar-toggler"
type="button"
data-toggle="collapse"
data-target="#navbarNav"
aria-controls="navbarNav"
aria-expanded="false"
aria-label="Toggle navigation"
>
<span className="navbar-toggler-icon"></span>
</button> */

const mapStateToProps = (state) => {
  return {
    // Basic stats needed for NAV ------------
    isAuthenticated: state.user !== null,
    user: state.user,
    // Basic stats needed for NAV ------------
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(actions.logout()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
