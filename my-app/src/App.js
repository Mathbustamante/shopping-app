import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import {setCurrentUser, logoutUser} from "./actions/authActions";

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import New from './components/New';
import Cart from './components/Cart';
import Default from './components/Default';
import ProductDetail from './components/ProductDetail';
import Home from './components/Home';
import Wishlist from './components/Wishlist';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import PrivateRoute from "./components/private-route/PrivateRoute";
import {Provider} from "react-redux";
import store from "./store";


class App extends Component {

    state = {
        user: [],
        id: [],
        auth: false
    };

    componentDidMount() {
        if (localStorage.jwtToken) {

            const token = localStorage.jwtToken;
            setAuthToken(token);

            const decoded = jwt_decode(token);
            store.dispatch(setCurrentUser(decoded));

            this.setState({
                user: decoded.name,
                id: decoded.id,
                auth: true
            });

            const currentTime = Date.now() / 1000; // to get in milliseconds
            if (decoded.exp < currentTime) {
                store.dispatch(logoutUser());
                window.location.href = "./login";
            }
        }
    }

    render() {
        return (

            <Provider store={store}>
                <div className="App">
                    <Navbar user={this.state.user} auth={this.state.auth}/>
                    <Switch>
                        <Route exact path="/" component={Home}></Route>
                        <Route exact path="/register" component={Register}/>
                        <Route exact path="/login" component={Login}/>
                        <PrivateRoute exact path="/products" component={ProductList}/>
                        <PrivateRoute exact path="/wishlist" component={Wishlist}/>
                        <Route exact path="/products/new" render={() => <New user={this.state}/>}/>
                        <PrivateRoute path="/cart" component={Cart}/>
                        <PrivateRoute path="/products/:id" user={this.state} component={ProductDetail}/>
                        <Route component={Default}></Route>
                    </Switch>
                </div>
            </Provider>
        );
    }
}

export default App;
