import React, {Component} from 'react';
import axios from "axios";
import { connect } from 'react-redux';
import * as actions from '../store/actions/actions';
import NavBar from '../Components/navBar';
import "./CSS/global.css"

class Shopping extends Component {

    componentDidMount() {
      //Updates login status into redux.
      this.props.onTryAutoSignup();

      //Checks if logged in, redirect to mainpage.
      if (localStorage.country === null || localStorage.country === undefined) {
        this.props.history.push('/');
      }
    }

    //Happens upon receiving updated login information.
    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {
        return (
          <div className = "container-fluid align-items-center">
              <NavBar from={this.props.location.pathname}/>
              <div className = "jumbotron startBox">
                <h1> Shopping!</h1> 
              </div>
          </div>);

    }

}



const mapStateToProps = (state) => {
    return {
      isAuthenticated: state.token !== null,

      loading: state.loading,
      error: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckedState()),
        onAuth: (username, password) => dispatch(actions.authLogined(username, password)) 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Shopping);