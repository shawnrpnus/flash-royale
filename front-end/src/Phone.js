import React, { Component } from 'react';
import './Phone.css';
import axios from 'axios';
import uniqid from 'uniqid';

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
    this.getInTransit = this.getInTransit.bind(this);
  }

  getPendingRequests(){
    axios.get("http://localhost:3001/phone_update").then(response => 
      this.setState({
        pendingRequests: response.data
      })
    ).then(() => console.log("pendingRequests" + this.state.pendingRequests));
  }

  shiftFromPendingToTransit(request){
    var url = 'http://localhost:3001/accept_request/' + request.fittingRoomNumber + "/" + request.item.id;
    axios.post(url).then(response => console.log(response));
  }

  getInTransit(){
    axios.get('http://localhost:3001/check_transit_items').then(response => {
      this.setState({
        inTransit: response.data
      })
    }).then(()=> console.log("in transit" + this.state.inTransit));
  }

  markAsDelivered(inTransit){
    var url = 'http://localhost:3001/delivered/' + inTransit.fittingRoomNumber + "/" + inTransit.item.id;
    axios.post(url).then(response => console.log(response));
  }

  componentDidMount(){
    setInterval(this.getPendingRequests, 1000);
    setInterval(this.getInTransit, 1000);
  }

  render() {
    var recommendationRequests = this.state.pendingRequests.map(x => {
      var imageUrl = 'https://hackathon2019sg.blob.core.windows.net/images/' + x.item.image +  '.jpg';
      return (
        <div key={uniqid()} className="col-sm-3">
          <div className="card">
            <img className="card-image-top card-image" src={imageUrl} alt="apparel"/>
            <div className="card-body">
              <h4 className="card-title">{x.item.color + " " + x.item.name + " " + x.item.size + " for fitting room " + x.fittingRoomNumber + ". Location: " + x.item.location_in_store}</h4>
              <button className="btn btn-primary" onClick={() => this.shiftFromPendingToTransit(x)}>Fetch for customer</button>
            </div>
          </div>
        </div>
      )
    });

    var itemsInTransit = this.state.inTransit.map(x => {
      var imageUrl = 'https://hackathon2019sg.blob.core.windows.net/images/' + x.item.image +  '.jpg';
      return (
        <div key={uniqid()} className="col-sm-3">
          <div className="card">
            <img className="card-image-top card-image" src={imageUrl} alt="apparel"/>
            <div className="card-body">
              <h4 className="card-title">{x.item.color + " " + x.item.name + " " + x.item.size + " for fitting room " + x.fittingRoomNumber + ". Location: " + x.item.location_in_store}</h4>
              <button className="btn btn-primary" onClick={() => this.markAsDelivered(x)}>Delivered</button>
            </div>
          </div>
        </div>
      )
    });

    return (
      <div className='container'>
        <h1>List of Current Requests:</h1>
        <div className='container row'>
          {recommendationRequests}
        </div>
      <div className='container'>
        <h1>List of Items In Transit:</h1>
        <div className='container row'>
          {itemsInTransit}
        </div>
        </div>
      </div>
    );
  }
}

export default Phone;
