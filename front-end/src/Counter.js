import React, { Component } from 'react';
import QrReader from 'react-qr-reader';
import './Counter.css';
import ReactDOM from 'react-dom';
import axios from 'axios';

class Counter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fittingRoomNumber: '',
      showQR: false,
      cart: [],
      scannedIds: [],
      showConfirmation: false
    }

    this.showQR = this.showQR.bind(this);
    this.handleError = this.handleError.bind(this);
    this.offQR = this.offQR.bind(this);
    this.appendToCart = this.appendToCart.bind(this);
    this.clearCart = this.clearCart.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  offQR() {
    this.setState({
      showQR: false
    })
  }

  showQR() {
    this.setState({
      showQR: true
    });
  }

  handleError(err) {
    console.error(err);
  }

  appendToCart(data) {
    if (data != null && !this.state.scannedIds.includes(data)) {
      var audio = new Audio('http://freesound.org/data/previews/144/144418_62484-lq.mp3');
      audio.play();
      var url = 'http://localhost:3001/apparel/' + data
      axios.get(url).then(response =>
        this.setState({
          scannedIds: this.state.scannedIds.concat(data),
          cart: this.state.cart.concat("Name: " + response.data.name + ". Colour: " + response.data.color + ". Size: " + response.data.size),
          showConfirmation: false
        }))
    }
    console.log(this.state.cart);
  }

  clearCart() {
    this.setState({
      cart: [],
      scannedIds: []
    })
  }

  handleSubmit() {
    var fittingRoomNumber = ReactDOM.findDOMNode(this.refs.dropdown).value;
    var url = "http://localhost:3001/fitting_room/" + fittingRoomNumber + "/";
    this.state.scannedIds.forEach(x => (url = url.concat(x + "/")));
    url = url.substring(0, url.length - 1);
    console.log(url);
    axios.post(url);
    this.clearCart();
    this.setState({
      showConfirmation: true
    })

  }

  deleteItem(item) {
    //delete scannedId that corresponds with item description, then delete item that matches description from cart
    this.setState({
      scannedIds: this.state.scannedIds.filter(id => this.state.scannedIds.indexOf(id) !== this.state.cart.indexOf(item)),
      cart: this.state.cart.filter(cartItem => cartItem !== item),
    })
    console.log(this.state.cart);
  }

  render() {

    var cart = this.state.cart.map(x => <li key={x}> {x} <button onClick={() => this.deleteItem(x)}>Delete</button></li>);

    return (
      <div className="App">
        <h1> Scan customer's items, then select fitting room </h1>
        <button className="btn btn-primary" onClick={this.showQR}>Scan QR Code of Item</button>
        <button className="btn btn-primary" onClick={this.offQR}>Close Scanner</button>
        <div ref="QR">
          {this.state.showQR ?
            <div>
              <QrReader
                delay={100}
                onScan={this.appendToCart}
                style={{ width: '15em' }}
                onError={this.handleError}
                className="QRcam"
              />
            </div> : ''
          }
        </div>
        <ol>
          {cart}
        </ol>
        <select className="form-control" ref="dropdown" required>
          <option value="" disabled selected>Select a fitting room</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        {this.state.cart.length > 0 ? <button className="btn btn-primary" onClick={this.handleSubmit}>Submit</button>:''}
        <button className="btn btn-primary" onClick={this.clearCart}>Clear cart</button>
        <h2>{this.state.showConfirmation ? "Items successfully submitted!" : "Pending new submission..."}</h2>
      </div>
    );
  }
}

export default Counter;
