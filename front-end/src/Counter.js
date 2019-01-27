import React, { Component } from 'react';
import QrReader from 'react-qr-reader';
import './Counter.css';
import ReactDOM from 'react-dom';
import axios from 'axios';

class Counter extends Component {
  constructor(props){
    super(props);

    this.state = {
      fittingRoomNumber: '',
      showQR: false,
      cart: [],
      scannedIds: []
    }

    this.showQR = this.showQR.bind(this);
    this.handleError = this.handleError.bind(this);
    this.offQR = this.offQR.bind(this);
    this.appendToCart = this.appendToCart.bind(this);
    this.clearCart = this.clearCart.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  offQR(){
    this.setState({
      showQR: false
    })
  }

  showQR(){
    this.setState({
      showQR: true
    });
  }
  
  handleError(err){
    console.error(err);
  }

  appendToCart(data){
    if (data != null && !this.state.scannedIds.includes(data)){
      var url = 'http://localhost:3000/apparel/' + data
      axios.get(url).then(response =>
      this.setState({
        scannedIds: this.state.scannedIds.concat(data),
        cart: this.state.cart.concat("Name: " + response.data.name + ". Colour: " + response.data.color + ". Size: " + response.data.size)
     }))
    }
    console.log(this.state.cart);
  }

  clearCart(){
    this.setState({
      cart: []
    })
  }

  handleSubmit(){
    var fittingRoomNumber = ReactDOM.findDOMNode(this.refs.dropdown).value;
    console.log(fittingRoomNumber);

    this.clearCart();

  }

  deleteItem(item){
    this.setState({
      cart: this.state.cart.filter(cartItem => cartItem !== item)
    })
    console.log(this.state.cart);
  }

  render() {
    
    var cart = this.state.cart.map(x => <li key={x}> {x} <button onClick={()=>this.deleteItem(x)}>Delete</button></li>);
    
    return (
      <div className="App">
        <h1> Scan customer items, then enter fitting room </h1>
        <button className="btn btn-primary" onClick={this.showQR}>Scan QR Code of Item</button>
        <button className="btn btn-primary" onClick={this.offQR}>Close Scanner</button>
					<div ref="QR">
						{this.state.showQR?
							<div>
								<QrReader
									delay={100}
									onScan={this.appendToCart}
									style={{width: '15em'}}
									onError={this.handleError}
									className="QRcam"
								/>
							</div>: ''
						}
					</div>
          <ol>
            {cart}
          </ol>
          <select className="form-control" ref="dropdown">
            <option value="" disabled selected>Select a fitting room</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
         </select>
         <button className="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
          <button className="btn btn-primary" onClick={this.clearCart}>Clear cart</button>
          
      </div>
    );
  }
}

export default Counter;
