import React, { Component } from 'react';
import Axios from 'axios';

//Responsible for sending a put request to the database in order to edit the product
class Edit extends Component {
    constructor() {
        super();
        this.state = {
            title: '',
            image: '',
            price: '',
            info: '',
            category: ''
        }
    }

    //get the current information of the product and display for eddition
    componentDidMount(){
        this.setState({
            title: this.props.product.product.title,
            image: this.props.product.product.image,
            price: this.props.product.product.price, 
            info: this.props.product.product.info,
            category: this.props.product.product.category
        })
    }

    //Handles the change for each different input
    handleTitleChange = (e) => {
        this.setState({title: e.target.value});
     }

     handleImageChange = (e) => {
        this.setState({image: e.target.value});
     }

     handlePriceChange = (e) => {
        this.setState({price: e.target.value});
     }

     handleInfoChange = (e) => {
        this.setState({info: e.target.value});
     }

     handleCategoryChange = (e) => {
        this.setState({category: e.target.value});
     }

    //Hanldes the submit of the form and updates the product with the current input
    handleSubmit = (e) => {
        e.preventDefault();
        Axios({ method: 'PUT', url: '/api/products/' + this.props.product.product._id, data: { 
            title: this.state.title,
            image: this.state.image,
            price: this.state.price,
            info: this.state.info,
            category: this.state.category,
            user: this.props.user.user

        }})
        .then(function (response) {
            alert("Your item was updated!");
        })
        .then(window.location.href = "/products");
    }

    //Renders the HTML with all the functionalities
    render(){
        return(
            <div className="form">
            <h3>Edit your product!</h3>
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Enter product title:</label>
                    <input id="title" name="title"  className="form-control" defaultValue={this.props.product.product.title} type="text" onChange={this.handleTitleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Enter the link for an image of your product:</label>
                    <textarea id="image" name="image" className="md-textarea form-control" defaultValue={this.props.product.product.image} type="text" rows="3" onChange={this.handleImageChange} ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price:</label>
                    <input id="price" name="price" className="form-control" defaultValue={this.props.product.product.price} type="text" onChange={this.handlePriceChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="info">Details:</label>
                    <textarea id="info" name="info" className="md-textarea form-control" defaultValue={this.props.product.product.info} type="text" rows="3" onChange={this.handleInfoChange} ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="category">Categoria:</label>
                    <input id="category" name="category" className="form-control" defaultValue={this.props.product.product.category} type="text" onChange={this.handleCategoryChange} />
                </div>
                <button className="btn btn-primary">Send data!</button>
            </form>
        </div>
        );
    }
}

export default Edit;