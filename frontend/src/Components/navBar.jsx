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
import Folder from '../assets/folder.png'
import User from '../assets/user.png'
import Logout from '../assets/logout.png'

/**
 * Component, renders the Navigation Bar
 * Should be able to show whether a user is logged in from here.
 * @memberof Component
 * @param {ReduxState}. user: Contains information about user if logged in. (e.g. token, username)
 */
class NavBar extends Component {
  state = {
    accountBoxOpen: false,
  }

  logout = () => {
    this.setState({accountBoxOpen: false});
    this.props.logout();
  }
  render() {
    return (
      <div className="navbarContainer">
        { /** <div className="announcementBox">
          Hi, our free trial for Google Maps API ran out and we are in the process of renewing it by 1Aug. Please be patient with us and try again tomorrow!
        </div> **/}
        <div>
          <nav className="navbar fixed-top" id="nav1">
            {(this.props.from === "/") ? <div/> : 
              <div className="navbar-items-left">
                <a to="/"  href="/">
                    <img className="navbar-brand" src={LogoWord} alt="trippyy-word-logo" />
                </a>
                { this.props.isAuthenticated &&
                  (this.props.saving ? <p className="saveText"> Saving ... </p> : <p className="saveText"> Saved to account!</p>)
                }
              </div>

            }
            <div className="navbar-items"> 
                <Link to="/" className="nav-item nav-link">
                  {" "}
                  Home{" "}
                </Link>

              {this.props.isAuthenticated ? (
                <React.Fragment>

                  <div className="accountLink nav-link" id="accountLink" onClick={() => this.setState({accountBoxOpen: !this.state.accountBoxOpen})}>
                    Account: {this.props.user.username}
                  </div>
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

          {this.state.accountBoxOpen &&
            <div className="accountScreen">
              <div className="accountFiller" onClick={() => this.setState({accountBoxOpen: false})}>
              </div>
              <div className="accountBox">
                  <Link to="/mytrips" className="option" >
                    <img src={Folder} alt="folder" className="navIcon"/>
                    <p className="optionText"> My Trips </p>
                  </Link>

                  <Link className="option" to="/"> 
                    <img src={User} alt="user" className="navIcon"/>
                    <p className="optionText"> My Account </p>
                  </Link>

                  <Link
                    to="/"
                    onClick={this.logout}
                    className="option" 
                  >
                    <img src={Logout} alt="logout" className="navIcon logoutIcon"/>
                    <p className="optionText"> Logout </p>
                  </Link>
              </div>
            </div>
          }

          </div>
        </div>
      
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
    saving: state.saving,
    // Basic stats needed for NAV ------------
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(actions.logout()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
