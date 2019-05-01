import React from 'react';
import {logoutUser} from "../actions/authActions";
import {Link} from 'react-router-dom';

//The navbar implementation. It will display different things depending if the user is logged in or not
const Navbar = ({user, auth}) => {
    let loggedin;
    let registered;
    let loggedout;
    let product;
    let postProduct;
    let wishlist;
    if (auth) {
        product = <a className="nav-link" href="/products">Products <span className="sr-only">(current)</span></a>;
        loggedin = <li className="nav-item"><span className="nav-link">Welcome {user}!</span></li>;
        postProduct = <Link to={'/products/new'}>
            <li className="nav-item"><span className="nav-link">New Product</span></li>
        </Link>;
        registered = <Link to={'/cart'}>
            <li className="nav-item"><span className="nav-link">Cart</span></li>
        </Link>;
        wishlist = <Link to="/wishlist">
            <li className="nav-item"><span className="nav-link">Wishlist</span></li>
        </Link>
        loggedout = <li onClick={logoutUser()} className="nav-item"><a className="nav-link" href="/">Log Out</a></li>;
    } else {
        product = <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>;
        loggedin = <li className="nav-item"><a className="nav-link" href="/login">Log In</a></li>;
        registered = <li className="nav-item"><a className="nav-link" href="/register">Register</a></li>;
        loggedout = '';
        postProduct = '';
    }

    return (
        <div className="">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                    <a className="navbar-brand" href="/">ShopGo</a>
                    <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                        {product}
                        {postProduct}
                    </ul>
                    <ul className="navbar-nav  my-2 my-lg-0">
                        {loggedin}
                        {registered}
                        {wishlist}
                        {loggedout}
                    </ul>
                </div>
            </nav>
        </div>
    )
}


export default Navbar;