import React, { Component } from 'react';
import './FittingRoom.css';


class FittingRoom extends Component {
  constructor(props){
    super(props);

    this.state = {
      customersItems: [],
      selectedRecommendations: [],
      fittingRoomNumber: props.roomNumber
    }

  }



  render() {
    return (
      <div className='container'>
        <h1>{"Room Number " + this.state.fittingRoomNumber}</h1>
      </div>
    );
  }
}

export default FittingRoom;
