import React, { Component } from 'react';
import './Phone.css';

class Phone extends Component {
  constructor(props){
    super(props);

    this.state = {
      pendingRequests: [],
      inTransit: []
    }
    this.getPendingRequests = this.getPendingRequests.bind(this);
    this.shiftFromPendingToTransit = this.shiftFromPendingToTransit.bind(this);
    this.markAsDelivered = this.markAsDelivered.bind(this);
  }

  getPendingRequests(){

  }

  shiftFromPendingToTransit(item){

  }

  markAsDelivered(item){

  }

  render() {
    var listOfCurrentRequests = this.state.pendingRequests.map(x => <li key={x}>{x}</li>);
    var listOfInTransitItems = this.state.inTransit.map(x => <li key={x}>{x}</li>);
    return (
      <div className='container'>
        <h1>List of Current Requests:</h1>
        <div>
          <ol>
            {listOfCurrentRequests}
          </ol>
        </div>
        <h1>List of Items In Transit:</h1>
        <div>
          <ol>
            {listOfInTransitItems}
          </ol>
        </div>
      </div>
    );
  }
}

export default Phone;
