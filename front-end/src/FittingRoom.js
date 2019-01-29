import React, { Component } from 'react';
import './FittingRoom.css';
import axios from 'axios';


class FittingRoom extends Component {
  constructor(props){
    super(props);

    this.state = {
      customerItems: [],
      requestedRecommendations: [],
      fittingRoomNumber: props.roomNumber,
      shownRecommendations: [],
      selectedItemForRecommendations: null,
      isOccupied: false
    }

    this.getItems = this.getItems.bind(this);
    this.getInstructions = this.getInstructions.bind(this);
    this.getRecommendations = this.getRecommendations.bind(this);
    this.requestItem = this.requestItem.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.requestedRecommendationsContains = this.requestedRecommendationsContains.bind(this);
    this.shouldEmptyRoom = this.shouldEmptyRoom.bind(this);
  }

  getItems(){
    var url = 'http://207.46.230.56/fitting_room/' + this.state.fittingRoomNumber
    axios.get(url).then(response => {
      this.setState({
        customerItems: response.data
      })
    }).catch(error => console.error("No items in room!"));
  }
  
  getInstructions(){
    var url = 'http://207.46.230.56/action/' + this.state.fittingRoomNumber
    axios.get(url).then(response => {
      if (response.data !== "") {
        console.log(response.data)
      }
      return;
    });
  }
  
  getRecommendations(apparel){
    var url = "http://207.46.230.56/recommendations/" + apparel.id;
    axios.get(url).then(response => {
      this.setState({
        selectedItemForRecommendations: apparel,
        shownRecommendations: response.data,
      })
      console.log(response);
    })
  }

  requestItem(recommendation){
    var url = "http://207.46.230.56/reco_request/" + this.state.fittingRoomNumber + "/" + recommendation.id;
    this.setState({
      requestedRecommendations: this.state.requestedRecommendations.concat(recommendation)
    })
    axios.post(url).then(response => console.log(response));
    console.log(this.state.requestedRecommendations);
  }

  leaveRoom(){
    this.setState({
      customerItems:[],
      requestedRecommendations: [],
      shownRecommendations: [],
      selectedItemForRecommendations: null,
      isOccupied: false, 
    })
    var url = 'http://207.46.230.56/empty_room/' + this.state.fittingRoomNumber;
    axios.post(url).then(response => console.log(response));
  }

  componentDidMount(){
    setInterval(this.getItems, 1000);
    setInterval(this.getInstructions, 1000);
    setInterval(this.shouldEmptyRoom, 5000);
  }

  requestedRecommendationsContains(rec){
    for (var i = 0; i < this.state.requestedRecommendations.length; i++){
      if (this.state.requestedRecommendations[i].id === rec.id){
        return true;
      }
    }
    return false;
  }

  shouldEmptyRoom(){
    var url = 'https://sense.singteliot.com/api/sensor_records/presence_count';
    var headers = new Headers();
    headers.append('X-Api-Key', '95A9DABA170B6FEFDEE15E5BD3905E19');
    var formData = new FormData();
    formData.append('company_id', 26);
    formData.append('device_id', 1);
  
    return fetch(url, {
      method: 'POST',
      body: formData,
      headers: headers
    }).then(response => response.json()).then(response => {
      
      var jsonResponse = JSON.stringify(response);
      console.log(jsonResponse);
      var count = response.data[0].count;
      console.log("Count: " + count);
      var isOccupiedNow = count > 0;
      var previousOccupied = this.state.isOccupied;
      this.setState({
        isOccupied: isOccupiedNow
      })
      console.log(this.state.isOccupied);
      if (previousOccupied && !isOccupiedNow){
        this.leaveRoom();
      }
    }).catch(error => console.error('Error:', error));
  }
  /*
  shouldEmptyRoom(){
    this.setState({
      after: this.isOccupied()
    })

    if (!this.before && !this.after) {
      this.leaveRoom();
      return true;
    } else {
      this.setState({
        before: this.isOccupied()
      })
      return false;
    }
  }
  */
  

  render() {
    var itemsInFittingRoom = this.state.customerItems.map(x => {
      var imageUrl = 'https://hackathon2019sg.blob.core.windows.net/images/' + x.image +  '.jpg';
      return (
        <div key={x.id} className="col-sm-3">
          <div className="card">
            <img className="card-image-top card-image" src={imageUrl} alt="apparel"/>
            <div className="card-body">
              <h5 className="card-title">{x.color + " " + x.name + " \n" + x.size + "\n" + "$" + x.price}</h5>
              <button className="btn btn-primary" onClick={() => this.getRecommendations(x)}>See Recommendations</button>
            </div>
          </div>
        </div>
      )
    });

    var addedRecoIds = [];
    var currentlyShowingRecommendations = this.state.shownRecommendations.map(x => {
      var imageUrl = 'https://hackathon2019sg.blob.core.windows.net/images/' + x.image +  '.jpg';
      if (!addedRecoIds.includes(x.image)){
        addedRecoIds = addedRecoIds.concat(x.image);
        return (
          <div key={x.id} className="col-sm-3">
            <div className="card">
              <img className="card-image-top card-image" src={imageUrl} alt="apparel"/>
              <div className="card-body">
                <h5 className="card-title">{x.color + " " + x.name + " $" + x.price}</h5>
                <h5 className="card-text">Select size: </h5>
                {this.requestedRecommendationsContains(x) 
                  ? <p className="card-text">Item is on its way!</p>
                  : <button className="btn btn-primary" onClick={()=> this.requestItem(x)}>Request item</button>}
              </div>
            </div>
          </div>
        )
      } else {
        return null;
      }
    });

    return (
      <div className='container'>
        <h1>{"Room Number " + this.state.fittingRoomNumber}</h1>
        <button onClick={this.leaveRoom}>Leave Room</button>
        <button onClick={this.isOccupied}>Iot Sense</button>
        <div className="container row">
          {itemsInFittingRoom}
        </div>
        <h1>{this.state.selectedItemForRecommendations!==null
              ? "Recommendations for: " + this.state.selectedItemForRecommendations.name
              : "Select an item to view recommendations"}
        </h1>
        <div className="container row">
          {currentlyShowingRecommendations}
        </div>
      </div>
    );
  }
}

export default FittingRoom;
