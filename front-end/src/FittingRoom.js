import React, { Component } from 'react';
import './FittingRoom.css';
import axios from 'axios';
import scrollToComponent from 'react-scroll-to-component';

class FittingRoom extends Component {
  constructor(props){
    super(props);

    this.state = {
      customerItems: [],
      requestedRecommendations: [],
      fittingRoomNumber: props.roomNumber,
      shownRecommendations: [],
      selectedItemForRecommendations: null,
      isOccupied: false,
      highlightItem1: false,
      highlightItem2: false,
      highlightItem3: false,
      highlightReco1: false,
      highlightReco2: false,
      highlightReco3: false,
      requestedSize: ''
    }

    this.getItems = this.getItems.bind(this);
    this.getInstructions = this.getInstructions.bind(this);
    this.getRecommendations = this.getRecommendations.bind(this);
    this.requestItem = this.requestItem.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.requestedRecommendationsContains = this.requestedRecommendationsContains.bind(this);
    this.shouldEmptyRoom = this.shouldEmptyRoom.bind(this);
    this.getRecoFromSizeAndItemNumber = this.getRecoFromSizeAndItemNumber.bind(this);
    this.convertShownRecosToUniqRecos = this.convertShownRecosToUniqRecos.bind(this);
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
        console.log(response.data);
        switch(response.data.action){
          case "item one":
            this.setState({
              highlightItem1: true
            })
            this.getRecommendations(this.state.customerItems[0]);
            break;
          case "item two":
            this.setState({
              highlightItem2: true
            })
            this.getRecommendations(this.state.customerItems[1]);
            break;
          case "item three":
            this.setState({
              highlightItem3: true
            })
            this.getRecommendations(this.state.customerItems[2]);
            break;
          case "first item":
            this.setState({
              highlightReco1: true
            })
            break;
          case "second item":
            this.setState({
              highlightReco2: true
            })
            console.log(this.state.highlightReco2);
            break;
          case "third item":
            this.setState({
              highlightReco3: true
            })
            break;
          case "size small":
            this.setState({
              requestedSize: "S"
            })
            break;
          case "size medium":
            this.setState({
              requestedSize: "M"
            })
            break;
          case "size large":
            this.setState({
              requestedSize: "L"
            })
            break;
          case "yes confirm":
            if (this.state.highlightReco1){
              this.requestItem(this.getRecoFromSizeAndItemNumber(this.state.requestedSize, "first item"));
            } else if (this.state.highlightReco2){
              this.requestItem(this.getRecoFromSizeAndItemNumber(this.state.requestedSize, "second item"));
            } else if (this.state.highlightReco2){
              this.requestItem(this.getRecoFromSizeAndItemNumber(this.state.requestedSize, "third item"));
            }
            break;
          default:
            console.log("Unavailable command");
        }
      }
    });
  }
  
  getRecommendations(apparel){
    if (apparel !== null){
      var url = "http://207.46.230.56/recommendations/" + apparel.id;
      axios.get(url).then(response => {
        this.setState({
          selectedItemForRecommendations: apparel,
          shownRecommendations: response.data,
        })
        console.log(response);
        if (this.state.shownRecommendations.length > 0){
          scrollToComponent(this.refs.bottom,{offset:260});
        }
      })
    }
  }

  getRecoFromSizeAndItemNumber(size, itemNumString){
    var index;
    switch(itemNumString){
      case "first item":
        index = 0;
        break;
      case "second item":
        index = 1;
        break;
      case "third item":
        index = 2;
        break;
      default:
    }
    let uniqRecoArr = this.convertShownRecosToUniqRecos();
    let uniqReco = uniqRecoArr[index];
    let image = uniqReco.image;
    for (var i = 0; i < this.state.shownRecommendations.length; i++){
      if (this.state.shownRecommendations[i].image === image && this.state.shownRecommendations[i].size === size){
        return this.state.shownRecommendations[i];
      }
    }
  }

  convertShownRecosToUniqRecos(){
    const recommendations = []
    this.state.shownRecommendations.forEach(reco => {
      let found = false
      recommendations.forEach(existingReco => {
        if (existingReco.image === reco.image) {
          found = true
        }
      })
      if (found === true) {
        return
      }
      recommendations.push(reco)
    })
    return recommendations; 
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
      highlightItem1: false,
      highlightItem2: false,
      highlightItem3: false,
      highlightReco1: false,
      highlightReco2: false,
      highlightReco3: false,
      requestedSize: ''
    })
    var url = 'http://207.46.230.56/empty_room/' + this.state.fittingRoomNumber;
    axios.post(url).then(response => console.log(response));
  }

  componentDidMount(){
    setInterval(this.getItems, 1000);
    setInterval(this.getInstructions, 500);
    setInterval(this.shouldEmptyRoom, 1000);
  }


  requestedRecommendationsContains(rec){
    for (var i = 0; i < this.state.requestedRecommendations.length; i++){
      if (this.state.requestedRecommendations[i].image === rec.image){
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
      //var jsonResponse = JSON.stringify(response);
      //console.log(jsonResponse);
      var count = response.data[0].count;
      console.log("Count: " + count);
      var isOccupiedNow = count > 0;
      var previousOccupied = this.state.isOccupied;
      this.setState({
        isOccupied: isOccupiedNow
      })
      //console.log(this.state.isOccupied);
      if (previousOccupied && !isOccupiedNow){
        this.leaveRoom();
      }
    }).catch(error => console.error('Error:', error));
  }
  
  render() {
    var itemsInFittingRoom = this.state.customerItems.map(x => {
      var imageUrl = 'https://hackathon2019sg.blob.core.windows.net/images/' + x.image +  '.jpg';
      var index = this.state.customerItems.indexOf(x);
      //console.log(index);
      return (
        <div key={x.id} className="col-sm-3" style={{marginBottom: "1rem"}}>
          <div className={"card " + 
            ((index === 0 && this.state.highlightItem1) 
            || (index === 1 && this.state.highlightItem2) 
            || (index === 2 && this.state.highlightItem3) ? "bgyellow" : '')}>
            <img className="card-image-top card-image" src={imageUrl} alt="apparel"/>
            <div className="card-body" style={{textAlign: "center", alignItem: "center", justifyContent: "center"}}>
              <h5 className="card-title">{x.color + " " + x.name + " (" + x.size + ") $" + x.price}</h5>
              <button className="btn btn-primary" onClick={() => this.getRecommendations(x)}>See Recommendations</button>
            </div>
          </div>
        </div>
      )
    });

    var addedRecoIds = [];
    // map distinct recommendations to the sizes
    const recommendations = []
    const sizes = []
    this.state.shownRecommendations.forEach(reco => {
      let found = false
      recommendations.forEach(existingReco => {
        if (existingReco.image === reco.image) {
          found = true
        }
      })
      if (found === true) {
        return
      }
      recommendations.push(reco)
    })

    recommendations.forEach(reco => {
      const size = []
      this.state.shownRecommendations.forEach(sreco => {
        if (sreco.image === reco.image) {
          size.push(sreco.size)
        }
      })
      sizes.push(size + " ")
    })

    let fuck = -1
    var currentlyShowingRecommendations = recommendations.map(reco => {
      fuck++
      var imageUrl = 'https://hackathon2019sg.blob.core.windows.net/images/' + reco.image + '.jpg';
      var index = recommendations.indexOf(reco);
      if (!addedRecoIds.includes(reco.image)){
        addedRecoIds = addedRecoIds.concat(reco.image);
        return (
          <div key={reco.id} className="col-sm-3">
            <div className={"card " + 
              (((index === 0 && this.state.highlightReco1) 
              || (index === 1 && this.state.highlightReco2) 
              || (index === 2 && this.state.highlightReco3)) ? "bgyellow" : '')}>
              <img className="card-image-top card-image" src={imageUrl} alt="apparel" />
              <div className="card-body">
                <h5 className="card-title">{reco.color + " " + reco.name + " $" + reco.price}</h5>
                <h5 className="card-text">Available Sizes: </h5>
                <p style={{color: "black", fontSize: "1.5vw"}}>{sizes[fuck]}</p>
                {this.requestedRecommendationsContains(reco)
                  ? <p className="card-text" style={{color: "black"}}>Item is on its way!</p>
                  : <button className="btn btn-primary" onClick={() => this.requestItem(reco)}>Request item</button>}
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
        <h1 style={{marginBottom: "1rem"}}>{"Fitting Room " + this.state.fittingRoomNumber}</h1>
        <hr/>
        <div className="container row">
          {itemsInFittingRoom}
        </div>
        <h1 ref={"bottom"} style={{marginBottom: "1rem"}}>{this.state.selectedItemForRecommendations!==null
              ? "Showing recommendations for: " + this.state.selectedItemForRecommendations.color + " " + this.state.selectedItemForRecommendations.name + " (" + this.state.selectedItemForRecommendations.size + ")"
              : "Select an item to view recommendations"}
        </h1>
        <hr/>
        <div className="container row">
          {currentlyShowingRecommendations}
        </div>
      </div>
    );
  }
}

export default FittingRoom;
