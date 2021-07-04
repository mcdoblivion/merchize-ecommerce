/*eslint-disable*/
import React, { useState, useEffect } from "react";

// react components for routing our app without refresh
import { Link, useHistory } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";
import CustomDropdown from "components/CustomDropdown/CustomDropdown";
import checkLogin from "checkLogin";
import { Badge } from "@material-ui/core";
import axiosInstance from "axiosInstance";

const useStyles = makeStyles(styles);

export default function RightLinks(props) {
  const [account, setAccount] = useState({});
  const [cartItems, setCardItems] = useState(0);

  const getCart = async () => {
    try {
      if (account.loggedIn) {
        const cartItems = await axiosInstance.get("/carts");
        console.log("Cart:", cartItems);
        setCardItems(cartItems.data.data.length);
      } else return;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(async () => {
    const loginInfo = await checkLogin.loggedIn();
    if (loginInfo.success) {
      setAccount({ ...account, loggedIn: true, text: loginInfo.name });
    } else {
      setAccount({ ...account, loggedIn: false, text: "Account" });
    }

    getCart();
  }, []);
  const classes = useStyles();
  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Button href="/" color="transparent" className={classes.navLink}>
          <h4>Home</h4>
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button href="/seller" color="transparent" className={classes.navLink}>
          <h4>Sell</h4>
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button href="/cart" color="transparent" className={classes.navLink}>
          <h4>Cart</h4>
          <Badge color="primary">
            <h4>({cartItems})</h4>
          </Badge>
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button href="/orders" color="transparent" className={classes.navLink}>
          <h4>Order</h4>
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <CustomDropdown
          hoverColor="black"
          buttonText={<h4>{account.text}</h4>}
          buttonProps={{
            color: "transparent",
            className: classes.navLink,
          }}
          dropdownList={
            account.loggedIn
              ? [
                  <Link to="#">
                    <p>Profile</p>
                  </Link>,
                  <Link to="/logout">
                    <p>Logout</p>
                  </Link>,
                ]
              : [
                  <Link to="/login">
                    <p>Login</p>
                  </Link>,
                  <Link to="/signup">
                    <p>Signup</p>
                  </Link>,
                ]
          }
        />
      </ListItem>
    </List>
  );
}
