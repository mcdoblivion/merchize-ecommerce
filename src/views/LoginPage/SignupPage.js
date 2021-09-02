import React, { useState } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";

// core components
import Header from "components/Header/Header.js";
import LeftLinks from "components/Header/LeftLinks.js";
import Footer from "components/Footer/Footer.js";
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
import { useHistory } from "react-router-dom";
import axiosInstance from "axiosInstance";

const useStyles = makeStyles(styles);

export default function SignupPage(props) {
  const [cartAnimation, setCardAnimation] = React.useState("cardHidden");
  const history = useHistory();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    username: "",
    password: "",
  });
  const [alert, setAlert] = useState({ show: false, msg: "", success: false });

  const handleSignup = async () => {
    try {
      const response = await axiosInstance.post(
        process.env.REACT_APP_API_URL + "/users/account",
        user
      );

      if (response.status >= 200 && response.status <= 299) {
        setAlert({
          show: true,
          success: true,
          msg: response.data.msg,
        });

        setTimeout(() => {
          setAlert({ ...alert, show: false });
          history.push("/login");
        }, 1000);
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
          height: 500,
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
          <GridContainer justify="center">
            <GridItem xs={12} sm={6}>
              <Card className={classes[cartAnimation]}>
                <form className={classes.form}>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h4>Login with</h4>
                    <div className={classes.socialLine}>
                      <Button
                        justIcon
                        href="#pablo"
                        target="_blank"
                        color="transparent"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className={"fab fa-twitter"} />
                      </Button>
                      <Button
                        justIcon
                        href="#pablo"
                        target="_blank"
                        color="transparent"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className={"fab fa-facebook"} />
                      </Button>
                      <Button
                        justIcon
                        href="#pablo"
                        target="_blank"
                        color="transparent"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className={"fab fa-google-plus-g"} />
                      </Button>
                    </div>
                  </CardHeader>
                  <p className={classes.divider}>Or Be Classical</p>
                  <CardBody>
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
                    <CustomInput
                      labelText="Username"
                      id="username"
                      formControlProps={{
                        required: true,
                        fullWidth: true,
                      }}
                      inputProps={{
                        name: "username",
                        value: user.username,
                        onChange: handleChange,
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
                      labelText="Password"
                      id="password"
                      formControlProps={{
                        required: true,
                        fullWidth: true,
                      }}
                      inputProps={{
                        name: "password",
                        value: user.password,
                        onChange: handleChange,
                        type: "password",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className={classes.inputIconsColor}>
                              lock_outline
                            </Icon>
                          </InputAdornment>
                        ),
                        autoComplete: "off",
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
                    <Button color="primary" size="lg" onClick={handleSignup}>
                      Signup
                    </Button>
                    Have an account?
                    <Button href="/login" size="lg">
                      Login
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
        <Footer whiteFont />
      </div>
    </div>
  );
}
