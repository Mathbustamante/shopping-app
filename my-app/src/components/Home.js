import React, { Component } from "react";

class Home extends Component {
  //Home page with a path to the login page
    render() {
      return (
        <div className="text-center-landing text-center">
          <div className="main-box">
            <h1>Welcome to our shopping app!</h1>
            <h6>Please log in to continue and shop with us</h6>
            <a href="/login" className="btn btn-lg btn btn-light btn-block" >Log in</a>
          </div>
        </div>
      );
    }
  }
  export default Home;