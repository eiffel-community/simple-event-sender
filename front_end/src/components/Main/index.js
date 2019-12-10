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
import App from "../App";
import "./index.css";
import headerImage from "../../static/logo.png";
import footerImage from "../../static/logo_white.png";

class Main extends Component {
  state = {};
  render() {
    return (
      <div>
        <div
          className="container-fluid no-padding"
          style={{ backgroundColor: "#bdd8ef" }}
        >
          <img className="img-fluid mx-auto d-block" src={headerImage} />
          <App />
        </div>
        <div>
          <footer>
            <div className="row" style={{ paddingTop: "20px" }}>
              <div className="col-md-4">
                <ul className="list-group-flush">
                  <li className="list-group-item">
                    <a
                      style={{ color: "#000000" }}
                      href="https://evsent.wordpress.com/"
                    >
                      Evsent Company Website
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a
                      style={{ color: "#000000" }}
                      href="https://github.com/eiffel-community"
                    >
                      Eiffel Community GitHub
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-md-5"></div>
              <div className="col-md-3 text-center">
                <img
                  style={{ width: "200px", height: "220px" }}
                  src={footerImage}
                />
              </div>
            </div>
          </footer>
        </div>
      </div>
    );
  }
}

export default Main;
