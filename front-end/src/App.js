import React, { Component } from 'react';
import './App.css';
import Counter from './Counter.js';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      showCounter: false,
      showFittingRoom: false, 
      showPhone: false
    }
    this.showCounter = this.showCounter.bind(this);
    this.showFittingRoom = this.showFittingRoom.bind(this);
    this.showPhone = this.showPhone.bind(this);
  }

  showCounter(){
    this.setState({
        showCounter: true
    })
  }

  showFittingRoom(){
    this.setState({
        showFittingRoom: true
    })
  }

  showPhone(){
    this.setState({
        showPhone: true
    })
  }

  render() {
    return (
      <div className='button__container'>
        {!(this.state.showCounter || this.state.showFittingRoom || this.state.showPhone) ? 
            <div>
                <h1> Hello, select screen: </h1>
                <button onClick={this.showCounter}>Counter</button>
                <button onClick={this.showFittingRoom}>Fitting Room</button>
                <button onClick={this.showPhone}>Phone</button>
            </div> : <div></div>
        }
        {this.state.showCounter && <Counter/>}
      </div>
    );
  }
}

export default App;
