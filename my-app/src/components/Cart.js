import React, {Component} from 'react';
import Axios from 'axios';
import Popup from "reactjs-popup";
import Checkout from './Checkout';
import {connect} from "react-redux";

import {Link} from 'react-router-dom';
import '../App.css';

//Style for the popped message to checkout
const contentStyle = {
    maxWidth: "600px",
    width: "90%"
};


class Cart extends Component {
    constructor() {
        super();
        this.state = {
            products: [],
            total: 0
        }
    }

    //Loads all the products on the cart if user is authenticated
    componentDidMount() {
        if (!this.props.auth.isAuthenticated) {
            console.log('not authenticated');
            return window.location.href = "/login";
        }
        Axios.get('/api/cart')
            .then(res => {
                this.setState({
                    products: res.data
                })
            });
    }

    //Delete product from cart. Sending a delete request to the database
    deleteProduct = (id, price) => {
        const products = this.state.products.filter(product => {
            return product._id !== id
        });
        this.setState({
            products,
            total: this.state.quantity - 1
        });

        Axios({method: 'DELETE', url: '/api/cart/' + id})
            .then(res => {
            });
    };

    updateQuantity(e) {
        this.setState({
            quantity: e.target.value
        })
    }

    //Logic for the cart page, displaying the product related to the logged in user
    render() {
        console.log(this.props);
        if (this.props.auth.isAuthenticated) {
            return (
                <div>
                    <div className="container cart-table">
                        <h1>{this.props.auth.user.name}'s Cart</h1>
                        <table className="table">
                            <thead>
                            <tr>
                                <th scope="col">Product</th>
                                <th scope="col">Price</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Total</th>
                                <th scope="col"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.products.map(product => {
                                    if (product.userid === this.props.auth.user.id) {
                                        this.state.total = this.state.total + (product.price * product.quantity);
                                        return (
                                            <tr key={product._id}>
                                                <th scope="row"><img src={product.image} alt="cart-product"
                                                                     height="70"/> {product.title}</th>
                                                <td><i className="fas fa-dollar-sign"></i> {product.price}</td>
                                                <td><input type="text" className="form-control quantity"
                                                           defaultValue={product.quantity}/>
                                                </td>
                                                <td><i
                                                    className="fas fa-dollar-sign"></i> {product.price * product.quantity}
                                                </td>
                                                <td>
                                                    <span className="btn btn-danger" onClick={() => {
                                                        this.deleteProduct(product._id, product.price)
                                                    }}><i className="fas fa-trash-alt"></i>  Remove</span>
                                                </td>
                                            </tr>
                                        );
                                    }
                                    return null;
                                }
                            )}
                            </tbody>
                        </table>
                        <div className="total-price">
                            <span>Total: </span><span className="total-price">
                            <i className="fas fa-dollar-sign"></i> {this.state.total}</span>
                        </div>

                        <div className="backbtn">
                            <Link to={'/products'}>
                                <button type="button" className="btn btn-secondary"><i
                                    className="fas fa-long-arrow-alt-left"></i> Continue shopping
                                </button>
                            </Link>
                        </div>
                        <div className="totals-table action suggestion">
                            <Popup trigger={
                                <button type="button" className="btn btn-product add-cart"><i
                                    className="fas fa-shopping-cart"></i> Checkout</button>} modal
                                   contentStyle={contentStyle}>
                                {close => (
                                    <div>
                                        <Checkout user={this.props.auth.user} product={this.state}/>
                                    </div>
                                )}
                            </Popup>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div className="container">
                        <p>You do not have permissions, please login</p>
                    </div>
                </div>
            );
        }

    }
}

//this function plucks a small/required data from the big store json and make it usable in the current class
function mapStateToProps(state, ownProps) {
    return {
        auth: state.auth,
    }
}

//we export the default class after connecting mapStateToProps with the class
export default connect(mapStateToProps, '')(Cart);