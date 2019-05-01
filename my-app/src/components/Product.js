import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../App.css';

class Product extends Component {

    constructor() {
        super();
        this.state = {
            products: [],
            search: "",
            suggestions: [],
            category: ''
        }
    }

    //Loads all the products on the main products page
    componentDidMount() {
        fetch('/api/products')
            .then(res => res.json())
            .then(products => this.setState({products}))

        fetch('/api/suggestions')
            .then(res => res.json())
            .then(suggestions => this.setState({suggestions}))
    }

    //Implements the search functionality
    updateSearch(e) {
        this.setState({
            search: e.target.value,
            category: ''
        })
    }

    //Handles the sort by category
    handleClick = (e, data) => {
        e.preventDefault();
        this.setState({
            category: data
        })
    };

    //Depending on the filter given by the seach or category, it will display only the filtered products
    render() {
        let productSuggestions = this.state.suggestions;
        let filteredProducts = this.state.products.filter(
            (product) => {
                if (this.state.category !== '' && this.state.search !== '') {
                    return product.category.toLowerCase().indexOf(this.state.category.toLowerCase()) !== -1;

                } else if (this.state.category === '' && this.state.search !== '') {
                    return product.title.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;

                } else if (this.state.category === '' && this.state.search === '') {
                    return product.title.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
                } else if (this.state.category !== '' && this.state.search === '') {
                    return product.category.toLowerCase().indexOf(this.state.category.toLowerCase()) !== -1;
                }
                return {};
            }
        );

        //Renders the HTML with all the functionalities
        return (
            <div>
                <div className="container">
                    <div className="carousel slide" data-ride="carousel">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img className="d-block w-100"
                                     src="https://s3-ap-southeast-2.amazonaws.com/bettss3/images/WEBBDSALE17_w2400_h700.jpg"
                                     alt="First slide"/>
                            </div>

                        </div>
                    </div>
                    <div className="input-group input-group-lg product-box">
                        <div className="form-inline  searchbar">
                            <i className="fas fa-search" aria-hidden="true"></i>
                            <input type="text" className="form-control form-control-sm ml-3 w-75"
                                   value={this.state.search} onChange={this.updateSearch.bind(this)}
                                   placeholder="Search"/>
                        </div>
                    </div>

                    <div className="row">

                        <div className="col-sm-12 col-md-3 col-lg-3">
                            <div className="">
                                <h2 className="my-4">Sort by category:</h2>
                                <div className="list-group">
                                    <span className="list-group-item"
                                          onClick={(e) => this.handleClick(e, "")}>All</span>
                                    <span value="Electronics" className="list-group-item"
                                          onClick={(e) => this.handleClick(e, "Electronics")}>Electronics</span>
                                    <span className="list-group-item"
                                          onClick={(e) => this.handleClick(e, "Home & Garden")}>Home & Garden</span>
                                    <span className="list-group-item"
                                          onClick={(e) => this.handleClick(e, "Fashion")}>Fashion</span>
                                    <span className="list-group-item"
                                          onClick={(e) => this.handleClick(e, "Pet Supplies")}>Pet Supplies</span>
                                    <span className="list-group-item"
                                          onClick={(e) => this.handleClick(e, "Toys")}>Toys</span>
                                </div>
                            </div>
                            <div className="">
                                <h4 className="my-4">Suggestions by users:</h4>
                                {productSuggestions.map(suggestions =>
                                    <div className="suggestions" key={suggestions._id}>
                                        <div className="list-group">
                                            <Link className="link" to={'/products/' + suggestions.productid}>
                                                <span className="list-group-item"><strong>{suggestions.title}</strong> was suggested by {suggestions.username}</span>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-9 col-lg-9">

                            <div className="card-row">
                                {filteredProducts.map(product =>
                                    <div key={product._id} className="division">
                                        <div className="card align-items-stretch ">
                                            <Link to={'/products/' + product._id}>
                                                <img className="card-img-top" src={product.image} alt="Card cap"/>
                                            </Link>
                                            <div className="card-body">
                                                <h5 className="card-title">{product.title.substr(0, 30)}</h5>
                                                <p className="card-price"><i className="fas fa-dollar-sign"></i> {product.price}</p>
                                            </div>
                                            <div className="card-footer">
                                                <Link to={'/products/' + product._id}>
                                                    <span>See Details <i className="fas fa-long-arrow-alt-right"></i></span>

                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Product;