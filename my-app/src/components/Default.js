import React, { Component } from 'react';

//In case a route is not found, this page will display informing that the page was not found
class Default extends Component {
    render() {
      return (
        <div className="App">
          <h1>Page not found</h1>
        </div>
      );
    }
  }
  
  export default Default;