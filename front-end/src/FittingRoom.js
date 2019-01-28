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
      selectedItemForRecommendations: null
    }

    this.getItems = this.getItems.bind(this);
    this.getRecommendations = this.getRecommendations.bind(this);
    this.requestItem = this.requestItem.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.requestedRecommendationsContains = this.requestedRecommendationsContains.bind(this);
  }

  getItems(){
    var url = 'http://localhost:3001/fitting_room/' + this.state.fittingRoomNumber
    axios.get(url).then(response => {
      this.setState({
        customerItems: response.data
      })
    });
  }
  
  
  getRecommendations(apparel){
    var url = "http://localhost:3001/recommendations/" + apparel.id;
    axios.get(url).then(response => {
      this.setState({
        selectedItemForRecommendations: apparel,
        shownRecommendations: response.data,
      })
    })
  }

  requestItem(recommendation){
    var url = "http://localhost:3001/reco_request/" + this.state.fittingRoomNumber + "/" + recommendation.id;
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
      selectedItemForRecommendations: null
    })
  }

  componentDidMount(){
    setInterval(this.getItems, 1000)
  }

  requestedRecommendationsContains(rec){
    for (var i = 0; i < this.state.requestedRecommendations.length; i++){
      if (this.state.requestedRecommendations[i].id === rec.id){
        return true;
      }
    }
    return false;
  }

  render() {
    var itemsInFittingRoom = this.state.customerItems.map(x => {
      var imageUrl = 'https://hackathon2019sg.blob.core.windows.net/images/' + x.image +  '.jpg';
      return (
        <div key={x.id} className="col-sm-3">
          <div className="card">
            <img className="card-image-top card-image" src={imageUrl} alt="apparel"/>
            <div className="card-body">
              <h4 className="card-title">{x.color + " " + x.name + " " + x.size + " $" + x.price}</h4>
              <button className="btn btn-primary" onClick={() => this.getRecommendations(x)}>See Recommendations</button>
            </div>
          </div>
        </div>
      )
    });

    var currentlyShowingRecommendations = this.state.shownRecommendations.map(x => {
      var imageUrl = 'https://hackathon2019sg.blob.core.windows.net/images/' + x.image +  '.jpg';
      return (
        <div key={x.id} className="col-sm-3">
          <div className="card">
            <img className="card-image-top card-image" src={imageUrl} alt="apparel"/>
            <div className="card-body">
              <h4 className="card-title">{x.color + " " + x.name + " " + x.size + " $" + x.price}</h4>
              {this.requestedRecommendationsContains(x) 
                ? <p className="card-text">Item is on its way!</p>
                : <button className="btn btn-primary" onClick={()=> this.requestItem(x)}>Request item</button>}
            </div>
          </div>
        </div>
      )
    });
    return (
      <div className='container'>
        <h1>{"Room Number " + this.state.fittingRoomNumber}</h1>
        <button onClick={this.leaveRoom}>Leave Room</button>
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
