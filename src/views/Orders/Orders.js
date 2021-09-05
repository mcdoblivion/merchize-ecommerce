import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";

import Header from "components/Header/Header.js";
import LeftLinks from "components/Header/LeftLinks";
import Parallax from "components/Parallax/Parallax.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import Checkbox from "@material-ui/core/Checkbox";
import styles from "assets/jss/material-kit-react/views/components.js";
import classNames from "classnames";
import Card from "components/Card/Card.js";

import Button from "components/CustomButtons/Button.js";
import { Check } from "@material-ui/icons";
import SnackbarContent from "components/Snackbar/SnackbarContent";

import axiosInstance from "axiosInstance";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(styles);
const scrollHeight = window.innerHeight;

export default function Orders(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const history = useHistory();

  const isSellOrder = rest.isSellOrder || "false";

  const [orders, setOrders] = useState([]);
  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    success: false,
  });

  const getOrders = async (status) => {
    try {
      let response = null;
      if (status != null) {
        response = await axiosInstance.get(
          `/orders?status=${status}&sellOrder=${isSellOrder}`
        );
      } else {
        response = await axiosInstance.get(`/orders?sellOrder=${isSellOrder}`);
      }
      console.log(response.data);
      setOrders(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelOrder = (orderId) => async () => {
    try {
      const response = await axiosInstance.put(
        `orders/${orderId}?operation=cancel`
      );
      console.log(response.data);

      getOrders(-1);

      setAlert({
        show: true,
        success: true,
        msg: response.data.msg,
      });

      setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 3000);
    } catch (error) {
      console.log(error.response.data);
      setAlert({
        show: true,
        success: false,
        msg: error.response.data.msg,
      });

      setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 3000);
    }
  };

  const handleConfirmOrder = (orderId) => async () => {
    try {
      const response = await axiosInstance.put(
        `orders/${orderId}?operation=confirm`
      );
      console.log(response.data);

      getOrders(1);

      setAlert({
        show: true,
        success: true,
        msg: response.data.msg,
      });

      setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 3000);
    } catch (error) {
      console.log(error.response.data);
      setAlert({
        show: true,
        success: false,
        msg: error.response.data.msg,
      });

      setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 3000);
    }
  };

  useEffect(() => {
    setAlert({
      show: false,
      msg: "",
      success: false,
    });
    getOrders(null);
  }, []);

  return (
    <div>
      <Header
        leftLinks={<LeftLinks />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: scrollHeight * 0.15,
          color: "white",
        }}
        {...rest}
      />
      <Parallax
        small
        filter
        image={require("assets/img/bg-home.png").default}
        style={{ height: "15rem" }}
      />
      <div className={classNames(classes.main, classes.mainRaised)}>
        {isSellOrder === "true" && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "start",
            }}
          >
            <Button
              onClick={() => history.push("/seller/products")}
              color="primary"
              style={{ margin: "1rem" }}
            >
              Back to products
            </Button>
          </div>
        )}
        <Card>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Button onClick={() => getOrders(null)} color="success">
              All orders
            </Button>
            <Button onClick={() => getOrders(0)} color="success">
              Waiting orders
            </Button>
            <Button onClick={() => getOrders(1)} color="success">
              Received orders
            </Button>
            <Button onClick={() => getOrders(-1)} color="success">
              Canceled orders
            </Button>
          </div>
        </Card>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "start",
            paddingLeft: "1.5rem",
          }}
        >
          {orders &&
            orders.map((order) => {
              const { _id, customer, seller, orderItems, status } = order;
              return (
                <GridContainer key={_id}>
                  <Card style={{ width: "90vw" }}>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                      }}
                    >
                      {alert.show && (
                        <SnackbarContent
                          message={<span>{alert.msg}</span>}
                          color={alert.success ? "success" : "danger"}
                          icon={alert.success ? Check : "info_outline"}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        padding: "0 1rem",
                      }}
                    >
                      {isSellOrder === "true" ? (
                        <div>
                          <h4 style={{ fontWeight: "bold" }}>
                            Customer:{" "}
                            {customer.firstName + " " + customer.lastName}
                          </h4>
                          <h6>
                            Address: {customer.address}, Phone:{" "}
                            {customer.phoneNumber}
                          </h6>
                        </div>
                      ) : (
                        <h4 style={{ fontWeight: "bold" }}>
                          Seller: {seller.firstName + " " + seller.lastName}
                        </h4>
                      )}
                      <h4>
                        Status:{" "}
                        {status == -1
                          ? "Canceled"
                          : status == 0
                          ? "Waiting for seller confirm"
                          : "Received"}
                      </h4>
                      {status == 0 && (
                        <Button
                          onClick={handleCancelOrder(_id)}
                          color="primary"
                          style={{ height: "2.5rem" }}
                        >
                          Cancel order
                        </Button>
                      )}
                      {isSellOrder === "true" && status == 0 && (
                        <Button
                          style={{ height: "2.5rem" }}
                          onClick={handleConfirmOrder(_id)}
                          color="primary"
                        >
                          Confirm order
                        </Button>
                      )}
                    </div>
                    {orderItems.map((item, index) => {
                      const { product, quantity } = item;
                      if (product) {
                        return (
                          <GridItem key={product._id}>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "start",
                                border: "1px solid black",
                                borderRadius: "0.5rem",
                                padding: "0.5rem",
                                marginBottom: "0.5rem",
                              }}
                            >
                              <div
                                style={{
                                  alignSelf: "center",
                                  marginRight: "1rem",
                                }}
                              >
                                <h4>{index + 1}</h4>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  justifyContent: "start",
                                }}
                              >
                                <div>
                                  <h4>Product: {product.name}</h4>
                                  <h4>Quantity: {quantity}</h4>
                                  <h4>Price: ${(1.0 * product.price) / 100}</h4>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between",
                                    marginLeft: "2rem",
                                  }}
                                >
                                  {product.images.map((image, index) => (
                                    <img
                                      key={index}
                                      src={
                                        process.env.REACT_APP_BASE_URL + image
                                      }
                                      alt={product.name}
                                      style={{
                                        width: "auto",
                                        height: "7rem",
                                        borderRadius: "1rem",
                                        margin: "0 0.5rem",
                                      }}
                                    />
                                  ))}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    position: "absolute",
                                    right: "2rem",
                                    top: "2rem",
                                  }}
                                >
                                  <h3 style={{ alignSelf: "center" }}>
                                    ${(1.0 * product.price * quantity) / 100}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          </GridItem>
                        );
                      } else {
                        return (
                          <h4 key={index}>
                            This product has been removed from shop!
                          </h4>
                        );
                      }
                    })}
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <h3>
                        Total: $
                        {orderItems.reduce(
                          (sum, item) =>
                            item.product
                              ? sum + item.quantity * item.product.price * 1.0
                              : 0,
                          0
                        ) / 100}
                      </h3>
                    </div>
                  </Card>
                </GridContainer>
              );
            })}
        </div>
      </div>
    </div>
  );
}
