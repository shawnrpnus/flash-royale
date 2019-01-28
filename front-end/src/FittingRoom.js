import React, { Component } from 'react';
import './FittingRoom.css';
import axios from 'axios';


class FittingRoom extends Component {
  constructor(props){
    super(props);

    this.state = {
      customersItems: [],
      selectedRecommendations: [],
      fittingRoomNumber: props.roomNumber
    }

    this.getItems = this.getItems.bind(this);
  }

  getItems(){
    var url = 'http://localhost:3000/fitting_room/' + this.state.fittingRoomNumber
    axios.get(url).then(response => {
      this.setState({
        customersItems: response.data
      })
    });
  }

  render() {
    var itemsInFittingRoom = this.state.customersItems.map(x => <li key={x}>{x}</li>);
    return (
      <div className='container'>
        <h1>{"Room Number " + this.state.fittingRoomNumber}</h1>
        <button onClick={this.getItems}>Get Items</button>
        <ul>
          {itemsInFittingRoom}
        </ul>
      </div>
    );
  }
}

export default FittingRoom;
