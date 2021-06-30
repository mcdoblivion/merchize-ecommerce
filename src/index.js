import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import "assets/scss/material-kit-react.scss?v=1.10.0";

// pages for this product
import LoginPage from "views/LoginPage/LoginPage.js";
import SignupPage from "views/LoginPage/SignupPage.js";
import HomePage from "views/HomePage/HomePage";
import Logout from "views/LoginPage/Logout";
import ProductDetail from "views/Products/ProductDetail";
var hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/" component={HomePage} exact />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/logout" component={Logout} />
      <Route path="/products/" component={ProductDetail} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
