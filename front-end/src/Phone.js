import React, { Component } from 'react';
import './Phone.css';
import axios from 'axios';

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
    axios.get("http://localhost:3001/phone_update").then(response => 
      this.setState({
        pendingRequests: response.data
      })
    ).then(() => console.log(this.state.pendingRequests));
  }

  shiftFromPendingToTransit(item){

  }

  markAsDelivered(item){

  }

  componentDidMount(){
    setTimeout(this.getPendingRequests, 1000);
  }
  render() {
    var listOfCurrentRequests = this.state.pendingRequests.map(x => <li key={x.id}>{x.id}</li>);
    var listOfInTransitItems = this.state.inTransit.map(x => <li key={x.id}>{x.id}</li>);
    return (
      <div className='container row'>
        <h1>List of Current Requests:</h1>
        <div>
          <ol>
            {listOfCurrentRequests}
          </ol>
        </div>
      <div className='container row'>
        <h1>List of Items In Transit:</h1>
          <ol>
            {listOfInTransitItems}
          </ol>
        </div>
      </div>
    );
  }
}

export default Phone;
