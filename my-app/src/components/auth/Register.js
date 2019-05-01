import React, {Component} from "react";
import {withRouter} from "react-router-dom";

import PropTypes from "prop-types";
import {connect} from "react-redux";
import {registerUser} from "../../actions/authActions";
import classnames from "classnames";

class Register extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            password2: "",
            errors: {}
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/products");
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    onChange = e => {
        this.setState({[e.target.id]: e.target.value});
    };

    onSubmit = e => {
        e.preventDefault();
        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
        };
        this.props.registerUser(newUser, this.props.history);
    };

    render() {
        const {errors} = this.state;
        return (
            <div className="main-box text-center">
                <form className="form-signin" noValidate onSubmit={this.onSubmit}>
                    <h1 className="h3 mb-3 font-weight-normal">Register</h1>
                    <div className="">
                        <input onChange={this.onChange} value={this.state.name} error={errors.name} id="name"
                               type="text" placeholder="Name"
                               className={classnames("form-control", {invalid: errors.name})}/>

                        <span className="red-text">{errors.name}</span>
                    </div>
                    <div className="">
                        <input onChange={this.onChange} value={this.state.email} error={errors.email} id="email"
                               type="email" placeholder="Email"
                               className={classnames("form-control", {invalid: errors.email})}/>
                        <span className="red-text">{errors.email}</span>
                    </div>

                    <div className="">
                        <input onChange={this.onChange} value={this.state.password} error={errors.password}
                               id="password" type="password" placeholder="Password"
                               className={classnames("form-control", {invalid: errors.password})}/>
                        <span className="red-text">{errors.password}</span>
                    </div>

                    <div className="">
                        <input onChange={this.onChange} value={this.state.password2} error={errors.password2}
                               id="password2" type="password" placeholder="Confirm passwors"
                               className={classnames("form-control", {invalid: errors.password2})}/>

                        <span className="red-text">{errors.password2}</span>
                    </div>

                    <div className="">
                        <button type="submit" className="btn btn-lg btn btn-light btn-block"> Sign up</button>
                    </div>
                </form>
            </div>
        );
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    {registerUser}
)(withRouter(Register));