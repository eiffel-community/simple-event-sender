/*Copyright 2019 Evsent

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.*/
import React, { Component } from "react";
import Axios from "axios";
import "./index.css";

class Login extends Component {
  state = {
    name: "",
    password: ""
  };
  handleUsernameChange = e => {
    this.setState({
      name: e.target.value
    });
  };

  handlePasswordChange = e => {
    this.setState({
      password: e.target.value
    });
  };

  handleSubmit = async e => {
    e.preventDefault();
    let tmp_u = this.state.name;
    let tmp_p = this.state.password;

    await Axios.post("http://127.0.0.1:9000/login", {
      name: tmp_u,
      password: tmp_p
    })
      .then(response => {
        alert("Successfully logged in!");
        this.props.handleTokenChange(response.headers["auth-token"]);
      })
      .catch(error => {
        alert("Wrong username or password");
      });
  };
  render() {
    return (
      <div id="toppad">
        <div className="container">
          <form onSubmit={this.handleSubmit} id="form">
            <label>
              <p id="field_title">Username:</p>
              <input
                type="text"
                name="username"
                id="form_field"
                placeholder="Enter username"
                onChange={this.handleUsernameChange}
              />
            </label>
            <br></br>
            <label>
              <p id="field_title">Password:</p>
              <input
                type="password"
                name="password"
                id="form_field"
                placeholder="Enter password"
                onChange={this.handlePasswordChange}
              />
            </label>
            <br></br>
            <input type="submit" value="Log in" className="btn" id="loginbtn" />
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
