import React, { Component } from 'react';
import './App.css';
import Counter from './Counter.js';
import FittingRoom from './FittingRoom.js';
import Phone from './Phone.js';
import ReactDOM from 'react-dom';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      showCounter: false,
      showFittingRoomSelection: false, 
      showFittingRoom: false,
      showPhone: false,
      fittingRoomSelection: ''
    }
    this.showCounter = this.showCounter.bind(this);
    this.showFittingRoom = this.showFittingRoom.bind(this);
    this.showPhone = this.showPhone.bind(this);
    this.showFittingRoomSelection = this.showFittingRoomSelection.bind(this);
  }

  showCounter(){
    this.setState({
        showCounter: true
    })
  }

  showFittingRoomSelection(){
    this.setState({
        showFittingRoomSelection: true
    })
  }

  showPhone(){
    this.setState({
        showPhone: true
    })
  }

  showFittingRoom(){
    this.setState({
      showFittingRoom: true,
      fittingRoomSelection: ReactDOM.findDOMNode(this.refs.dropdown).value
    })
    console.log(this.state.fittingRoomSelection);
  }
  

  render() {
    return (
      <div className="jumbotron jumbotron-fluid">
        <div className='container text-center'>
          {!(this.state.showCounter || this.state.showFittingRoom || this.state.showPhone || this.state.showFittingRoomSelection) ? 
              <div>
                <h1 className="display-4"> Greetings, human! </h1>
                <p className="lead">Welcome to <strong>FlashFit</strong>, the retail solution that changes your life.</p>
                <hr></hr>
                <p>Begin by selecting your screen below.</p>
                <div className="btn-group">
                  <button className="btn btn-primary" onClick={this.showCounter}>Counter</button>
                  <button className="btn btn-primary" onClick={this.showFittingRoomSelection}>Fitting Room</button>
                  <button className="btn btn-primary" onClick={this.showPhone}>Phone</button>
                </div>
      
              </div> : <div></div>
          }
          {this.state.showCounter && <Counter/>}

          {this.state.showFittingRoom ? <FittingRoom roomNumber={this.state.fittingRoomSelection}/>
              :
              this.state.showFittingRoomSelection ?
                <div>
                  <p className="lead">Select fitting room number</p>
                  <select className="form-control" ref="dropdown">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                  <button className="btn btn-primary" onClick={this.showFittingRoom}>Submit</button>
                </div>
                : <div></div>
          }

          {this.state.showPhone && <Phone/>}
        </div>
      </div>
    );
  }
}

export default App;
