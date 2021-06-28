/*eslint-disable*/
import React from "react";

// react components for routing our app without refresh
import { Link } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

export default function RightLinks(props) {
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
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button href="/order" color="transparent" className={classes.navLink}>
          <h4>Order</h4>
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button href="/login" color="transparent" className={classes.navLink}>
          <h4>Login</h4>
        </Button>
      </ListItem>
    </List>
  );
}
