// Basic Imports
import React, { Component } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from "../store/actions/actions";
import { connect } from "react-redux";
// -------------------------------------------------------------------------
import { Link } from "react-router-dom";
import "./CSS/navBar.css";
import LogoWord from '../assets/logoWord.png'

/**
 * Component, renders the Navigation Bar
 * Should be able to show whether a user is logged in from here.
 * @memberof Component
 * @param {ReduxState}. user: Contains information about user if logged in. (e.g. token, username)
 */
class NavBar extends Component {
  render() {
    return (
      <nav className="navbar fixed-top" id="nav1">
        {(this.props.from === "/") ? <div/> : 
          <a to="/"  href="/">
              <img className="navbar-brand" src={LogoWord} alt="trippyy-word-logo" />
          </a>
        }
        <div className="navbar-items"> 
            <Link to="/" className="nav-item nav-link">
              {" "}
              Home{" "}
            </Link>

            <Link to="/mytrips" className="nav-item nav-link">
              My Trips
            </Link>

          {this.props.isAuthenticated ? (
            <React.Fragment>
                <Link
                  to="/"
                  className="nav-item nav-link"
                  onClick={this.props.logout}
                >
                  Logout
                </Link>

                <Link to="/mytrips" className="nav-item nav-link" id="accountLink">
                  Account: {this.props.user.username}
                </Link>
            </React.Fragment>
          ) : (
            <React.Fragment>
                <Link
                  to={{
                    pathname: "/login",
                    state: { from: this.props.from },
                  }}
                  className="nav-item nav-link"
                  id="loginLink"
                >
                  {" "}
                  Login{" "}
                </Link>

                <Link to="/signup" className="nav-item nav-link" id="signupLink">
                  {" "}
                  Signup{" "}
                </Link>
            </React.Fragment>
          )}
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
