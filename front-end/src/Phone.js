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
    axios.get("http://207.46.230.56/phone_update").then(response => 
      this.setState({
        pendingRequests: response.data
      })
    ).then(() => console.log("pendingRequests" + this.state.pendingRequests));
  }

  shiftFromPendingToTransit(request){
    var url = 'http://207.46.230.56/accept_request/' + request.fittingRoomNumber + "/" + request.item.id;
    axios.post(url).then(response => console.log(response));
  }

  getInTransit(){
    axios.get('http://207.46.230.56/check_transit_items').then(response => {
      this.setState({
        inTransit: response.data
      })
    }).then(()=> console.log("in transit" + this.state.inTransit));
  }

  markAsDelivered(inTransit){
    var url = 'http://207.46.230.56/delivered/' + inTransit.fittingRoomNumber + "/" + inTransit.item.id;
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
        <div key={uniqid()} className="row current-req-row">
          <div className="card">
            <img className="card-image-top card-image" src={imageUrl} alt="apparel"/>
            <div className="card-body">
              <h5 className="card-title">{x.item.color + " " + x.item.name + " (" + x.item.size + ") for fitting room " + x.fittingRoomNumber + ". Location: " + x.item.location_in_store}</h5>
              <div className="row text-center">
                <button className="btn btn-primary" onClick={() => this.
                  shiftFromPendingToTransit(x)}><h5>Fetch for customer</h5></button>
              </div>
            </div>
          </div>
        </div>
      )
    });

    var itemsInTransit = this.state.inTransit.map(x => {
      var imageUrl = 'https://hackathon2019sg.blob.core.windows.net/images/' + x.item.image +  '.jpg';
      return (
        <div key={uniqid()} className="row current-req-row">
          <div className="card">
            <img className="card-image-top card-image" src={imageUrl} alt="apparel"/>
            <div className="card-body">
              <h5 className="card-title">{x.item.color + " " + x.item.name + " " + x.item.size + " for fitting room " + x.fittingRoomNumber + ". Location: " + x.item.location_in_store}</h5>
              <div className="row text-center">
                <button className="btn btn-primary" onClick={() => this.markAsDelivered(x)}><h5>Delivered</h5></button>
              </div>
            </div>
          </div>
        </div>
      )
    });

    return (
      <div className='container'>
        <h3 className="phone-text">Current Requests:</h3>
        <hr className='hr-black'></hr>
        <div className='container'>
          <div className='col-sm'>
            {recommendationRequests}
          </div>
        </div>
        <h3 className="phone-text">Items In Transit:</h3>
        <hr className='hr-black'></hr>
        <div className='container'>
          <div className='col-sm'>
            {itemsInTransit}
          </div>
        </div>
      </div>
    );
  }
}

export default Phone;
