import React, {Component} from 'react';
import Axios from 'axios';

//This page will make a post request to the products database and add a new product to it
class New extends Component {
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

    componentDidMount() {
        if (this.props.user.auth === false) {
            return window.location.href = "/login";
            // this.props.history.push('/login'); 
        }
    }

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

    handleSubmit = (e) => {
        e.preventDefault();
        // console.log(this.state);
        // console.log(this.props.user);
        Axios({
            method: 'POST', url: '/api/products', data: {
                title: this.state.title,
                image: this.state.image,
                price: this.state.price,
                info: this.state.info,
                category: this.state.category,
                user: this.props.user.user

            }
        })
            .then(function (response) {
                alert("Item ready for sale!")
            })
            .then(window.location.href = "/products");
    }


    render() {
        if (this.props.user.auth === true) {
            return (
                <div className="form">
                    <h3>Thank you for selling with us!</h3>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="title">Enter product title:</label>
                            <input id="title" name="title" className="form-control" value={this.state.title} type="text"
                                   onChange={this.handleTitleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="image">Enter the link for an image of your product:</label>
                            <textarea id="image" name="image" className="md-textarea form-control"
                                      value={this.state.image} type="text" rows="3"
                                      onChange={this.handleImageChange}></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="price">Price:</label>
                            <input id="price" name="price" className="form-control" value={this.state.price} type="text"
                                   onChange={this.handlePriceChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="info">Details:</label>
                            <textarea id="info" name="info" className="md-textarea form-control" value={this.state.info}
                                      type="text" rows="3" onChange={this.handleInfoChange}></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Categoria:</label>
                            <input id="category" name="category" className="form-control" value={this.state.category}
                                   type="text" onChange={this.handleCategoryChange}/>
                        </div>
                        <button className="btn btn-primary">Send data!</button>
                    </form>
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

export default New;