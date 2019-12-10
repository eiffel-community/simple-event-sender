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
import ReactJson from "react-json-view";

class Submit_Form extends Component {
  state = {
    eiffelDataObj: "",
    lookupObj: "",
    data: {},
    edition: "",
    sendToMessageBus: true,
    response: {}
  };
  handleEiffelInputChange = e => {
    this.setState({
      eiffelDataObj: e.target.value
    });
  };

  handleLookupChange = e => {
    this.setState({
      lookupObj: e.target.value
    });
  };

  handleEditionChange = e => {
    this.setState({
      edition: e.target.value
    });
  };

  handleSTMBChange = e => {
    this.setState(prevState => {
      return { sendToMessageBus: !prevState.sendToMessageBus };
    });
  };

  handleSubmit = async e => {
    let config = {
      headers: { "auth-token": this.props.auth_token }
    };
    e.preventDefault();
    try {
      var eiffelDataObj = JSON.parse(this.state.eiffelDataObj);
    } catch {
      alert("Incorrect syntax in eiffelDataObject");
      return;
    }

    let parameterObj = {
      edition: this.state.edition,
      sendToMessageBus: this.state.sendToMessageBus
    };
    var data = {};
    if (this.state.lookupObj.length === 0) {
      data = {
        eiffelDataObj,
        parameterObj
      };
      await Axios.post("http://127.0.0.1:9000/submitevent", data, config)
        .then(response => {
          alert("Successfully posted event!\nSee repsonse for details.");
          this.setState({ response: response.data.event });
        })
        .catch(error => {
          alert("Error in submitted event\nSee response for details.");
          this.setState({ response: error.response.data });
        });
    } else {
      try {
        var lookupObj = JSON.parse(this.state.lookupObj);
        data = {
          eiffelDataObj,
          parameterObj,
          lookupObj
        };
        await Axios.post("http://127.0.0.1:9000/submitevent", data, config)
          .then(response => {
            alert("Successfully posted event!\nSee repsonse for details.");
            this.setState({ response: response.data.event });
          })
          .catch(error => {
            alert("Error in submitted event.\nSee response for details.");
            this.setState({ response: error.response.data });
          });
      } catch {
        alert("Incorrect syntax in lookupobject");
      }
    }
  };

  renderJSONResponse = () => {
    return (
      <ReactJson
        src={this.state.response}
        collapsed={false}
        onEdit={edit => {
          console.log(edit);
        }}
      />
    );
  };

  render() {
    return (
      <div>
        <div id="toppad">
          <div className="container">
            <form onSubmit={this.handleSubmit} className="form">
              <label>
                <h4>Eiffeldata Object</h4>
                <br></br>
                <textarea
                  name="eiffeldata"
                  id="eiffeldata"
                  onChange={this.handleEiffelInputChange}
                  required
                  rows="10"
                  cols="50"
                ></textarea>
              </label>
              <br></br>
              <h4>ParameterObj</h4>
              <label>
                Edition
                <br></br>
                <input
                  required
                  type="text"
                  onChange={this.handleEditionChange}
                ></input>
              </label>
              <br></br>
              <label>
                Send to message bus:
                <input
                  type="checkbox"
                  defaultChecked={this.state.sendToMessageBus}
                  id="heckbox"
                  onChange={this.handleSTMBChange}
                ></input>
              </label>
              <br></br>
              <label>
                <h4>Lookup Object</h4>
                <textarea
                  name="lookup"
                  id="lookup"
                  onChange={this.handleLookupChange}
                  rows="5"
                  cols="50"
                ></textarea>
              </label>
              <br></br>
              <input
                type="submit"
                value="Submit event"
                className="btn"
                id="submitbtn"
              />
            </form>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4"></div>
          <div
            className="text-center col-md-4"
            style={{ paddingBottom: "100px" }}
          >
            <h4>Response from server</h4>
            <div style={{ backgroundColor: "#ffffff" }} align="left">
              <div>{this.renderJSONResponse()}</div>
            </div>
          </div>
          <div className="col-md-4"></div>
        </div>
      </div>
    );
  }
}

export default Submit_Form;
