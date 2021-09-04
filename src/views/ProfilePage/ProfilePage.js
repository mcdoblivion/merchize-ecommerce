import React, { useState, useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";

// core components
import Header from "components/Header/Header.js";
import LeftLinks from "components/Header/LeftLinks.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import styles from "assets/jss/material-kit-react/views/loginPage.js";

import image from "assets/img/bg-home.png";
// @material-ui/icons
import {
  HomeRounded,
  PhoneRounded,
  TextFormatRounded,
  AccountCircleRounded,
  Check,
} from "@material-ui/icons";
import axiosInstance from "axiosInstance";

const useStyles = makeStyles(styles);

export default function ProfilePage(props) {
  const [cartAnimation, setCardAnimation] = React.useState("cardHidden");
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    username: "",
  });
  const [alert, setAlert] = useState({ show: false, msg: "", success: false });

  const handleUpdateProfile = async () => {
    try {
      const { firstName, lastName, phoneNumber, address } = user;
      const response = await axiosInstance.put(
        process.env.REACT_APP_API_URL + "/users/account",
        { firstName, lastName, phoneNumber, address }
      );

      if (response.status >= 200 && response.status <= 299) {
        setAlert({
          show: true,
          success: true,
          msg: response.data.msg,
        });

        setTimeout(() => {
          setAlert({ ...alert, show: false });
        }, 2000);
      }
    } catch (error) {
      console.log(error.response.data);
      setAlert({
        show: true,
        success: false,
        msg: error.response.data.msg,
      });

      setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 2000);
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/users/jwt-info");
      setUser(response.data.user);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  setTimeout(function () {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();
  const { ...rest } = props;

  return (
    <div>
      <Header
        leftLinks={<LeftLinks />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 150,
          color: "white",
        }}
        {...rest}
      />
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
        <div className={classes.container}>
          <GridContainer justifyContent="center">
            <GridItem xs={12} sm={12}>
              <Card className={classes[cartAnimation]}>
                <form className={classes.form}>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h3>Profile</h3>
                  </CardHeader>
                  <CardBody>
                    <CustomInput
                      labelText="Username"
                      id="username"
                      formControlProps={{
                        required: true,
                        fullWidth: true,
                      }}
                      inputProps={{
                        disabled: true,
                        name: "username",
                        value: user.username,
                        type: "text",
                        endAdornment: (
                          <InputAdornment position="end">
                            <AccountCircleRounded
                              className={classes.inputIconsColor}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <CustomInput
                      labelText="First name"
                      id="first-name"
                      formControlProps={{
                        required: true,
                        fullWidth: true,
                      }}
                      inputProps={{
                        name: "firstName",
                        value: user.firstName,
                        onChange: handleChange,
                        type: "text",
                        endAdornment: (
                          <InputAdornment position="end">
                            <TextFormatRounded
                              className={classes.inputIconsColor}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <CustomInput
                      labelText="Last name"
                      id="last-name"
                      formControlProps={{
                        required: true,
                        fullWidth: true,
                      }}
                      inputProps={{
                        name: "lastName",
                        value: user.lastName,
                        onChange: handleChange,
                        type: "text",
                        endAdornment: (
                          <InputAdornment position="end">
                            <TextFormatRounded
                              className={classes.inputIconsColor}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <CustomInput
                      labelText="Phone number"
                      id="phone-number"
                      formControlProps={{
                        required: true,
                        fullWidth: true,
                      }}
                      inputProps={{
                        name: "phoneNumber",
                        value: user.phoneNumber,
                        onChange: handleChange,
                        type: "text",
                        endAdornment: (
                          <InputAdornment position="end">
                            <PhoneRounded className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <CustomInput
                      labelText="Address"
                      id="address"
                      formControlProps={{
                        required: true,
                        fullWidth: true,
                      }}
                      inputProps={{
                        name: "address",
                        value: user.address,
                        onChange: handleChange,
                        type: "text",
                        endAdornment: (
                          <InputAdornment position="end">
                            <HomeRounded className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </CardBody>
                  {alert.show && (
                    <SnackbarContent
                      message={<span>{alert.msg}</span>}
                      color={alert.success ? "success" : "danger"}
                      icon={alert.success ? Check : "info_outline"}
                    />
                  )}
                  <CardFooter className={classes.cardFooter}>
                    <Button
                      color="primary"
                      size="lg"
                      onClick={handleUpdateProfile}
                    >
                      Update profile
                    </Button>
                    <Button href="/" size="lg">
                      Back to home
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </div>
  );
}
