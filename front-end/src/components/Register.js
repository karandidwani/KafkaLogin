import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Register extends Component {

    static propTypes = {
        handleSubmitRegister: PropTypes.func.isRequired
    };

    state = {
        username: '',
        password: '',
        firstname:'',
        lastname:''
    };

    componentWillMount(){
        this.setState({
            username: '',
            password: '',
            firstname:'',
            lastname:''
        });
    }

    render() {
        return (
            <div>
                <div className="row justify-content-md-center">
                    <div className="form-group">
                        <h1>Register</h1>
                    </div>
                </div>
                <div className="row justify-content-md-center">
                      <div className="col-md-2">
                           <form>

                                <div className="form-group RegisterLabels">
                                   First Name
                                </div>

                               <div className="form-group RegisterLabels">
                                   Last Name
                               </div>

                                <div className="form-group RegisterLabels">
                                    Username
                                </div>

                                <div className="form-group RegisterLabels">
                                    Password
                                </div>

                            </form>
                        </div>

                        <div className="col-md-3">
                            <form>

                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        label="Firstname"
                                        placeholder="Enter Firstname"
                                        value={this.state.firstname}
                                        onChange={(event) => {
                                            this.setState({
                                                firstname: event.target.value
                                            });
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        label="Lastname"
                                        placeholder="Enter Lastname"
                                        value={this.state.lastname}
                                        onChange={(event) => {
                                            this.setState({
                                                lastname: event.target.value
                                            });
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        label="Username"
                                        placeholder="Enter Username"
                                        value={this.state.username}
                                        onChange={(event) => {
                                            this.setState({
                                                username: event.target.value
                                            });
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="password"
                                        label="password"
                                        placeholder="Enter Password"
                                        value={this.state.password}
                                        onChange={(event) => {
                                            this.setState({
                                                password: event.target.value
                                            });
                                        }}
                                    />
                                </div>

                            </form>
                        </div>
                    </div>
                <div className="row justify-content-md-center">
                    <div className="form-group">
                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={() => this.props.handleSubmitRegister(this.state)}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;