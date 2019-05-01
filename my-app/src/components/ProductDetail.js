import React, {Component} from 'react';
import Comments from './Comments'
import Axios from 'axios';
import Popup from "reactjs-popup";
import Edit from './Edit';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import {connect} from "react-redux";

const contentStyle = {
    maxWidth: "600px",
    width: "90%"
};


class ProductDetail extends Component {
    constructor() {
        super();
        this.state = {
            product: null,
            comment: [],
            suggestions: [],
            show: false,
            modalTitle: 'N/A',
            modalMessage: 'initial',
            type: 'success'
        };
    }

    //Loads the product details and all the comments when the page is loaded
    componentDidMount() {
        if (!this.props.auth.isAuthenticated) {
            return window.location.href = "/login";
        }
        let {id} = this.props;
        Axios.get('/api/products/' + id)
            .then(res => {
                this.setState({
                    product: res.data,
                })
            });

        Axios.get('/api/comments/')
            .then(res => {
                this.setState({
                    comment: res.data,
                })
            });
    }


    //When add to cart button is clicked, the product will be added to the database on cart
    handleClick = (e) => {
        e.preventDefault();
        Axios({
            method: 'POST', url: '/api/cart', data: {
                title: this.state.product.title,
                image: this.state.product.image,
                price: this.state.product.price,
                info: this.state.product.info,
                id: this.state.product._id,
                quantity: 1,
                userid: this.props.auth.user.id,

            }
        }).then((response) => {
            this.setState({
                show: true,
                modalTitle: response.data.status,
                modalMessage: response.data.message,
                type: response.data.status
            });
        })
    };

    //When posting a comment
    handleChange = (e) => {
        this.setState({
            text: e.target.value,
            author: this.props.auth.user.name,
            userid: this.props.auth.user.id,
            productid: this.state.product._id
        })
    };

    //Submit the comment to the database
    handleSubmit = (e) => {
        e.preventDefault();
        this.addComment(this.state)
        this.setState({
            text: ""
        })
    };

    //Inherits for the submit methid and post the comment on the database
    addComment(comment) {
        Axios({
            method: 'POST', url: '/api/comments', data: {
                text: comment.text,
                author: comment.author,
                userid: comment.userid,
                productid: comment.productid
            }
        });

        let data = {
            text: comment.text,
            author: comment.author,
            userid: comment.userid,
            productid: comment.productid
        }

        let comments = [...this.state.comment, data];
        this.setState({
            comment: comments,
            text: ""
        });
    }

    //Calls the method to add a suggestion to the main page
    handleSuggestion = (e) => {
        this.addSuggestion(this.state);
    };

    //Delete the product from the database
    handleDelete = (e) => {
        this.deleteProduct(this.state);
    };

    //Iherits from handleDelete and deletes from the database
    deleteProduct(product) {
        Axios({method: 'DELETE', url: '/api/products/' + product.product._id})
            .then(alert("Your product was deleted from the product list"))
            .then(window.location.href = "/products");
    };

    //iherits from handleSuggestion and posts the suggestion on the main page
    addSuggestion(suggestion) {
        Axios({
            method: 'POST', url: '/api/suggestions', data: {
                title: suggestion.product.title,
                image: suggestion.product.image,
                username: this.props.auth.user.name,
                userid: this.props.auth.user.id,
                productid: suggestion.product._id
            }
        });
        alert("Suggestion added");
    }

    //Post to the wishList page
    handleWishlist = (id) => {
        this.addToWishList({product_id: id, user_id: this.props.auth.user.id});
    };

    //iherits from handleWishlist and post the product to the wishlist database
    addToWishList(data) {
        Axios({
            method: 'POST', url: '/api/wishlist', data: data
        }).then((response) => {
            let data = response.data;
            this.setState({show: true, modalTitle: data.status, modalMessage: data.message, type: data.status});
        });
    };

    //Delets the comment from the database
    deleteComment = (id) => {
        const comments = this.state.comment.filter(comment => {
            return comment._id !== id
        });

        this.setState({
            comment: comments
        });

        Axios({method: 'DELETE', url: '/api/comments/' + id})
            .then(res => {
            });
    };

    //Reders the html of the page displaying all the functionalities. Different for when user is logged in as the on that posted the product
    render() {
        var product;
        if (this.state.product != null) {
            if (this.state.product.user === this.props.auth.user.name) {
                product = this.state.product ? (
                    <div className="container">
                        <div className="product-container">
                            <div className="row">
                                <div className="col-sm-12  col-md-6 col-lg-6">
                                    <img className="img-fluid" src={this.state.product.image} alt="Card cap"
                                         height="40"/>
                                </div>
                                <div className=" col-sm-12  col-md-6 col-lg-6">
                                    <div className="info-container">
                                        <div className="product-info">
                                            <h1 className="product-name">{this.state.product.title}</h1>
                                            <p className="product-text">This product was posted
                                                by: {this.state.product.user}</p>
                                            <p className="product-price">Price: <i
                                                className="fas fa-dollar-sign"/> {this.state.product.price}</p>
                                            <p className="product-text">{this.state.product.info}</p>
                                            <div className="action">
                                                <button onClick={this.handleClick} type="button"
                                                        className="btn btn-product add-cart">Add to Cart
                                                </button>
                                            </div>
                                            <div className="action suggestion">
                                                <button onClick={(e) => this.handleWishlist(this.state.product._id)}
                                                        type="button"
                                                        className="btn btn-sm btn-product add-wishlist"><i
                                                    className="fas fa-heart"/> Add to Wishlist
                                                </button>
                                            </div>
                                            <div className="action suggestion">
                                                <button type="button" onClick={this.handleSuggestion}
                                                        className="btn btn-product add-cart">Suggest to users
                                                </button>
                                            </div>
                                            <div className="action suggestion">
                                                <Popup trigger={
                                                    <button type="button" className="btn btn-product add-cart">Edit
                                                        Product Details</button>} modal contentStyle={contentStyle}>
                                                    {close => (
                                                        <div>
                                                            <Edit user={this.props.auth.user.id} product={this.state}/>
                                                        </div>
                                                    )}
                                                </Popup>
                                            </div>
                                            <div className="action suggestion">
                                                <button type="button" onClick={this.handleDelete}
                                                        className="btn btn-product add-cart">Delete Product
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="comment-container">
                            <div className="comments">
                                <h1>Leave a comment</h1>
                                <form onSubmit={this.handleSubmit} className="input-group input-group-md">
                                    <input type="text" onChange={this.handleChange} className="form-control"
                                           aria-label="Large" aria-describedby="inputGroup-sizing-sm"
                                           placeholder="Your comment"/>
                                </form>
                                <div className="comments-text">
                                    <Comments data={this.state} productid={window.location.pathname.split("/").pop()}
                                              deleteComment={this.deleteComment} loggedUser={this.props.auth.user.name}/>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div>Loading Details...</div>
                )
            } else {
                product = this.state.product ? (
                    <div className="container">
                        <div className="product-container">
                            <div className="row">
                                <div className="col col-lg-6">
                                    <img className="img-fluid" src={this.state.product.image} alt="Card cap"
                                         height="40"/>
                                </div>
                                <div className="col col-lg-6">
                                    <div className="info-container">
                                        <div className="product-info">
                                            <h1 className="product-name">{this.state.product.title}</h1>
                                            <p className="product-text">This product was posted
                                                by: {this.state.product.user}</p>
                                            <p className="product-price">Price: <i
                                                className="fas fa-dollar-sign"></i> {this.state.product.price}</p>
                                            <p className="product-text">{this.state.product.info}</p>
                                            <div className="action">
                                                <button onClick={this.handleClick} type="button"
                                                        className="btn btn-sm btn-product add-cart">Add to Cart
                                                </button>
                                            </div>
                                            <div className="action suggestion">
                                                <button onClick={(e) => this.handleWishlist(this.state.product._id)}
                                                        type="button"
                                                        className="btn btn-sm btn-product add-wishlist"><i
                                                    className="fas fa-heart"/> Add to Wishlist
                                                </button>
                                            </div>
                                            <div className="action suggestion">
                                                <button type="button" onClick={this.handleSuggestion}
                                                        className="btn btn-sm btn-product add-cart">Suggest to users
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="comment-container">
                            <div className="comments">
                                <h1>Leave a comment</h1>
                                <form onSubmit={this.handleSubmit} className="input-group input-group-md">
                                    <input type="text" onChange={this.handleChange} className="form-control"
                                           aria-label="Large" aria-describedby="inputGroup-sizing-sm"
                                           placeholder="Your comment"/>
                                </form>
                                <div className="comments-text">
                                    <Comments data={this.state} productid={window.location.pathname.split("/").pop()}
                                              deleteComment={this.deleteComment} loggedUser={this.props.auth.user.name}/>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div>Loading products...</div>
                )
            }
        }

        return (
            <div className="container">
                {product}
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

//this function plucks a small/required data from the big store json and make it usable in the current class
function mapStateToProps(state, ownProps) {
    let id = ownProps.match.params.id;
    return {
        auth: state.auth,
        id: id
    }
}

//we export the default class after connecting mapStateToProps with the class
export default connect(mapStateToProps, '')(ProductDetail);