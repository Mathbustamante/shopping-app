import React, {Component} from 'react';
import Axios from 'axios';
import SweetAlert from "sweetalert-react";
import {Redirect} from 'react-router-dom'

class Checkout extends Component {

    constructor() {
        super();
        this.state = {
            discount: 'DISCOUNT',
            discounttext: '',
            total: '',
            discountNumber: 0,
            reviewProduct: true,
            cardDetails: false,
            card: {
                number: '',
                name: '',
                cvv: '',
                expiry: ''
            },
            show: false,
            modalTitle: 'N/A',
            modalMessage: 'initial',
            type: 'success',
            redirect: false
        }
    }

    componentDidMount() {
        this.setState({
            total: this.props.product.total
        })
    }

    //Logic to implement a discount when user types DISCOUNT
    handleDiscount = (e) => {
        if (this.state.discount === e.target.value) {
            this.setState({
                discountNumber: -3.99,
                total: this.state.total - 3.99
            })
        }
    };

    handleClick = (e) => {
        e.preventDefault();
        this.setState({reviewProduct: false, cardDetails: true})
    };

    //Make payment iteration 
    makePayment = () => {
        Axios({
            method: 'POST', url: '/api/checkout', data: {
                card: this.state.card,
                userid: this.props.user.id,
                products: this.props.product.products
            }
        }).then((response) => {
            console.log(response);
            this.setState({
                show: true,
                modalTitle: response.data.status,
                modalMessage: response.data.message,
                type: response.data.status
            });
        })
    };

    cardChange = (e) => {
        let newCard = this.state.card;
        let id = e.target.id;
        newCard[id] = e.target.value;
        this.setState({card: newCard});
    };

    //Displays the correct product for each individual user
    reviewProducts = () => {
        return (
            <div className="form">
                <h3>Ready to checkout!</h3>
                <div className="checkout-list">
                    {this.props.product.products.map(product => {
                        if (product.userid === this.props.user.id) {
                            return (
                                <div key={product._id}>
                                    <li className="li-checkout"><img src={product.image} alt="cart-product"
                                                                    height="70"/>{product.title}</li>
                                </div>
                            )
                        }
                    })}
                    <div>
                        <p>Discount: <i className="fas fa-dollar-sign"></i> <span
                            className="discount-number">{this.state.discountNumber}</span></p>
                        <p><strong>Total:</strong> <i className="fas fa-dollar-sign"></i> {this.state.total}</p>
                    </div>
                </div>
                <form className="discount-form" onSubmit={this.handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="promo">Enter promo code:</label>
                        <input id="promo" name="promo" className="form-control" type="text"
                               onChange={this.handleDiscount}/>
                    </div>
                    <button className="btn btn-primary" onClick={this.handleClick}>Proceed to payment</button>
                </form>
            </div>
        )
    };

    
    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/products'/>
        }
    };

    //Payment logic implemented
    cardDetails = () => {
        return (
            <div className="form">
                <h3>Payment</h3>
                <div className="form-group">
                    <input type="text" className="form-control" id="name" name="name" onChange={this.cardChange}
                           placeholder="Card holders name"/>
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" id="number" placeholder="Card Number"
                           onChange={this.cardChange}/>
                </div>

                <div className="row">
                    <div className="col-sm">
                        <div className="form-group">
                            <input type="text" className="form-control" id="expiry" placeholder="Expiry MM/YY"
                                   onChange={this.cardChange}/>
                        </div>
                    </div>

                    <div className="col-sm">
                        <div className="form-group">
                            <input type="text" className="form-control" id="cvv" placeholder="CVV"
                                   onChange={this.cardChange}/>
                        </div>
                    </div>

                </div>

                <div className="form-group">
                    <button className="btn btn-sm btn-success" onClick={this.makePayment}>Pay</button>
                </div>
            </div>
        )
    };

    render() {
        return (
            <div>
                {this.state.reviewProduct ? this.reviewProducts() : this.cardDetails()}
                <SweetAlert
                    show={this.state.show}
                    title={this.state.modalTitle}
                    text={this.state.modalMessage}
                    type={this.state.type}
                    onConfirm={() => this.setState({show: false, redirect: true})}
                />
            </div>
        );
    }
}

export default Checkout;