import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import Home from './Home';
import "./css/style.css";
import "./css/bootstrap.css";

class Layout extends Component {

    render() {
        return (
            <div className="container">
                <header className="header clearfix">
                    <nav>
                        <ul className="nav nav-pills float-right">
                            <li className="nav-item">
                                <a className="nav-link" href="/">Dashboard <span className="sr-only">(current)</span></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/register">Signup</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/login">Login</a>
                            </li>

                        </ul>
                    </nav>
                    <h3 className="text-muted">CMPE273 LoginApp</h3>
                </header>
                <main role="main">
                    <div class="row ">
                        <Home />
                    </div>
                </main>

                <footer className="footer">
                    <p>&copy; MongoDB-PassportJs Demo</p>
                </footer>

            </div>
        );
    }
}

export default withRouter(Layout);