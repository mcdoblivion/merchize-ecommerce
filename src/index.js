import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import "assets/scss/material-kit-react.scss?v=1.10.0";

// pages for this product
import LoginPage from "views/LoginPage/LoginPage.js";
import HomePage from "views/HomePage/HomePage";

var hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/" component={HomePage} exact />
      <Route path="/login" component={LoginPage} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
