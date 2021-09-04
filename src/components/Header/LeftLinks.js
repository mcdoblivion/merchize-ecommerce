/*eslint-disable*/
import React, { useState, useEffect } from 'react';

// react components for routing our app without refresh
import { Link } from 'react-router-dom';

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import Button from 'components/CustomButtons/Button.js';

import styles from 'assets/jss/material-kit-react/components/headerLinksStyle.js';
import CustomDropdown from 'components/CustomDropdown/CustomDropdown';
import checkLogin from 'checkLogin';

const useStyles = makeStyles(styles);

export default function LeftLinks(props) {
  const [account, setAccount] = useState({});

  useEffect(async () => {
    const loginInfo = await checkLogin.loggedIn();
    if (loginInfo.success) {
      setAccount({ ...account, loggedIn: true, text: loginInfo.name });
    } else {
      setAccount({ ...account, loggedIn: false, text: 'Account' });
    }
  }, []);
  const classes = useStyles();
  return (
    <div style={{ position: 'fixed', top: '1rem', left: '2rem' }}>
      <List className={classes.list}>
        <ListItem className={classes.listItem}>
          <Button href='/' color='transparent' className={classes.navLink}>
            <h4 style={{ fontWeight: '400' }}>Home</h4>
          </Button>
        </ListItem>
        <ListItem className={classes.listItem}>
          <Button href='/seller/products' color='transparent' className={classes.navLink}>
            <h4 style={{ fontWeight: '400' }}>Sell</h4>
          </Button>
        </ListItem>
        <ListItem className={classes.listItem}>
          <Button href='/cart' color='transparent' className={classes.navLink}>
            <h4 style={{ fontWeight: '400' }}>Cart</h4>
          </Button>
        </ListItem>
        <ListItem className={classes.listItem}>
          <Button href='/orders' color='transparent' className={classes.navLink}>
            <h4 style={{ fontWeight: '400' }}>Order</h4>
          </Button>
        </ListItem>
        <ListItem className={classes.listItem}>
          <CustomDropdown
            hoverColor='black'
            buttonText={<h4 style={{ fontWeight: '400' }}>{account.text}</h4>}
            buttonProps={{
              color: 'transparent',
              className: classes.navLink,
            }}
            dropdownList={
              account.loggedIn
                ? [
                    <Link to='/profile'>
                      <p>Profile</p>
                    </Link>,
                    <Link to='/logout'>
                      <p>Logout</p>
                    </Link>,
                  ]
                : [
                    <Link to='/login'>
                      <p>Login</p>
                    </Link>,
                    <Link to='/signup'>
                      <p>Signup</p>
                    </Link>,
                  ]
            }
          />
        </ListItem>
      </List>
    </div>
  );
}
