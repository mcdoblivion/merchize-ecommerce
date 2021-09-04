import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import "assets/scss/material-kit-react.scss?v=1.10.0";

// pages for this product
import LoginPage from "views/LoginPage/LoginPage.js";
import SignupPage from "views/LoginPage/SignupPage.js";
import ProfilePage from "views/ProfilePage/ProfilePage";
import HomePage from "views/HomePage/HomePage";
import Logout from "views/LoginPage/Logout";
import ProductDetail from "./views/Products/ProductDetail";
import Cart from "./views/Cart/Cart";
import Orders from "./views/Orders/Orders";
import SellPage from "./views/Seller/SellPage";
var hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/" component={HomePage} exact />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/logout" component={Logout} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/orders" component={Orders} />
      <Route
        path="/seller/orders"
        render={(props) => <Orders {...props} isSellOrder="true" />}
      />
      <Route path="/seller/products" component={SellPage} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
