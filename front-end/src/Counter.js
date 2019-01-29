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
      var url = 'http://207.46.230.56/apparel/' + data
      axios.get(url).then(response =>
        this.setState({
          scannedIds: this.state.scannedIds.concat(data),
          cart: this.state.cart.concat(response.data.color + " " + response.data.name + " (" + response.data.size + ") ---- "),
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
    var url = "http://207.46.230.56/fitting_room/" + fittingRoomNumber + "/";
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

    var cart = this.state.cart.map(x => <ol key={x}> {x} <div className="btn-group"><button className="btn btn-danger" onClick={() => this.deleteItem(x)}>Delete</button></div></ol>);

    return (
      <div className="App">
        <h1 className="display-4"> Changing Room Counter</h1>
        <p className="lead">Scan customer's items, then select fitting room</p>
        <div className="row justify-content-center">
          <div className="btn-group">
            <button className="btn btn-primary" onClick={this.showQR}>Scan QR Code of Item</button>
            <button className="btn btn-primary" onClick={this.offQR}>Close Scanner</button>
          </div>
        </div>
        <div ref="QR">
          {this.state.showQR ?
            <div className="jumbotron jumbotron-qr">
              <div className="row">
                <div className="col-sm">
                  <QrReader
                    delay={100}
                    onScan={this.appendToCart}
                    style={{ width: '15em' }}
                    onError={this.handleError}
                    className="QRcam"
                  />
                </div>
                <div className="col-sm">
                  <div className="item-cart text-right">
                    <h4>Your cart</h4>
                    <hr className="hr-black" align="right"></hr>
                    <ol className="item-list">
                      {cart}
                    </ol>
                  </div>
                  <div className="btn-group float-right cart-btns">
                    <button className="btn btn-primary" onClick={this.clearCart}>Clear cart</button>
                    {this.state.cart.length > 0 ? <button className="btn btn-primary" onClick={this.handleSubmit}>Submit</button>:''}
                  </div>
                </div>
              </div>
            </div> : ''
          }
        </div>
        <div className="container select-room">
          <select className="form-control dropdown-custom" ref="dropdown" required>
            <option value="" disabled selected>Select a fitting room</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          
          <h4 className="submission-state">{this.state.showConfirmation ? "Items successfully submitted!" : "Pending new submission..."}</h4>
        </div>
      </div>
    );
  }
}

export default Counter;
