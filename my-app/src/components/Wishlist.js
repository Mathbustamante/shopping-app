import React, {Component} from 'react';
import '../App.css';
import {connect} from "react-redux";
import Axios from "axios";
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';

class Wishlist extends Component {

    constructor() {
        super();
        this.state = {
            products: [],
            quantity: 1,
            total: 0,
            show: false,
            modalTitle: "Success",
            modalMessage: "Product moved to cart",
            type: "success"
        }
    }

    componentDidMount() {
        if (!this.props.auth.isAuthenticated) {
            return window.location.href = "/login";
        }
        Axios.get(`/api/wishlist/${this.props.auth.user.id}`)
            .then(res => {
                this.setState({
                    products: res.data
                });
            });
    }

    addToCart = (product) => {
        Axios({
            method: 'POST', url: '/api/cart', data: {
                title: product.title,
                image: product.image,
                price: product.price,
                info: product.info,
                id: product._id,
                quantity: 1,
                userid: this.props.auth.user.id,
            }
        }).then((response) => {
            Axios({method: 'DELETE', url: `/api/wishlist/${product._id}/${this.props.auth.user.id}`})
                .then((res) => {
                    if (res.data.status === 'success') {
                        this.setState({
                            products: this.state.products.filter((x, i) => x._id !== res.product_id)
                        });
                    }
                });
            this.setState({show: true, modalTitle: "Success", modalMessage: "Product moved to cart", type: "success"});
        })
    };

    noResults = () => {
        return (
            <h4>No products in wishlist</h4>
        )
    };

    deleteProduct(productId) {
        Axios({method: 'DELETE', url: `/api/wishlist/${productId}/${this.props.auth.user.id}`})
            .then(
                this.setState({
                    show: true,
                    modalTitle: "Success",
                    modalMessage: "Product moved to cart",
                    type: "success"
                })
            ).then(window.location.href = "/products");
    };

    wishlistGenerator = () => {
        return (
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
                        this.state.total = this.state.total + product.price;
                        return (
                            <tr key={product._id}>
                                <th scope="row">
                                    <img src={product.image} alt="cart-product" height="70"/> {product.title}</th>
                                <td><i className="fas fa-dollar-sign"></i> {product.price}</td>
                                <td><input type="text" className="form-control quantity" defaultValue="1"/>
                                </td>
                                <td><i className="fas fa-dollar-sign"></i> {product.price * this.state.quantity}
                                </td>
                                <td>
                                    <div className="form-group">
                                        <button className="btn btn-sm btn-danger"
                                                onClick={() => {
                                                    this.deleteProduct(product._id)
                                                }}>
                                            <i className="fas fa-trash-alt"></i> Remove
                                        </button>

                                        <button className="btn btn-sm btn-success ml-2"
                                                onClick={() => this.addToCart(product)}>
                                            <i className="fas fa-shopping-cart"></i> Add to cart
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    }
                )}
                </tbody>
            </table>
        );
    };

    render() {
        const {auth} = this.props;
        if (auth.isAuthenticated) {
            return (
                <div>
                    <div className="container cart-table mt-5">
                        <h1>{this.props.auth.user.name}'s Wishlist</h1>
                        {
                            (this.state.products.length > 0) ? this.wishlistGenerator() : this.noResults()
                        }
                    </div>
                    <SweetAlert
                        show={this.state.show}
                        title={this.state.modalTitle}
                        text={this.state.modalMessage}
                        type={this.state.type}
                        onConfirm={() => this.setState({show: false})}
                    />
                </div>
            )
        }
    }
}

//this function plucks a small/required data from the big store json and make it usable in the current class
function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}

//we export the default class after connecting mapStateToProps with the class
export default connect(mapStateToProps, '')(Wishlist);