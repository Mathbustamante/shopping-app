import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {loginUser} from "../../actions/authActions";
import classnames from "classnames";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            errors: {}
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Login page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            if (this.props.location.pathname === "/login") {
                this.props.history.push('/products');
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            window.location.href = "./products";
        }
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
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        this.props.loginUser(userData);
    };

    render() {
        const {errors} = this.state;
        return (
            <div className="main-box text-center">
                <form className="form-signin" noValidate onSubmit={this.onSubmit}>
                    <h1 className="h3 mb-3 font-weight-normal"> Please log in </h1>
                    <div className="form-group">
                        <label htmlFor="email" className="sr-only"> Email address </label>
                        <input
                            onChange={this.onChange}
                            value={this.state.email}
                            error={errors.email}
                            id="email"
                            type="email"
                            placeholder="Email address"
                            required
                            className={classnames("form-control",
                                {
                                    invalid: errors.email || errors.emailnotfound
                                })}
                        />
                        <span className="red-text"> {errors.email} {errors.emailnotfound}</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="sr-only"> Password </label>
                        <input
                            onChange={this.onChange}
                            value={this.state.password}
                            error={errors.password}
                            id="password"
                            type="password"
                            placeholder="Password"
                            required
                            className={classnames("form-control", {invalid: errors.password || errors.passwordincorrect})}
                        />
                        <span className="red-text"> {errors.password}{errors.passwordincorrect}</span>
                    </div>
                    <button className="btn btn-lg btn btn-info btn-block" type="submit"> Sign in</button>
                </form>
            </div>
        )
    }
}


Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    {loginUser}
)(Login);