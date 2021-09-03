import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";

import Header from "components/Header/Header.js";
import LeftLinks from "components/Header/LeftLinks";
import Parallax from "components/Parallax/Parallax.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Rating from "@material-ui/lab/Rating";
import Checkbox from "@material-ui/core/Checkbox";
import styles from "assets/jss/material-kit-react/views/components.js";
import classNames from "classnames";

import Button from "components/CustomButtons/Button.js";
import { Check, AddRounded, RemoveRounded } from "@material-ui/icons";
import { Input } from "@material-ui/core";
import SnackbarContent from "components/Snackbar/SnackbarContent";

import axiosInstance from "axiosInstance";

const useStyles = makeStyles(styles);

export default function Cart(props) {
  const classes = useStyles();
  const { ...rest } = props;

  const [cartItems, setCartItems] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    success: false,
  });

  const getCartItems = async () => {
    try {
      const response = await axiosInstance.get("/carts");
      setCartItems(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const changeProductQuantity = (productId, newQuantity) => async () => {
    try {
      const response = await axiosInstance.put("/carts/" + productId, {
        quantity: newQuantity,
      });
      console.log(response.data);
      getCartItems();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectProduct = (e, productId) => {
    e.stopPropagation();
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(
        selectedProducts.filter((product) => product != productId)
      );
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleRemoveFromCart = async () => {
    try {
      const response = await axiosInstance.delete("/carts", {
        data: [...selectedProducts],
      });
      console.log(response.data);
      getCartItems();

      setAlert({
        show: true,
        success: true,
        msg: response.data.msg,
      });

      setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 3000);
    } catch (error) {
      console.log(error.response);
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

  const handleOrder = async () => {
    try {
      const response = await axiosInstance.post(
        "/orders",
        selectedProducts.map((item) => {
          return {
            seller: cartItems.find(
              (cartItem) => cartItem.product._id.toString() === item
            ).product.seller,
            product: item,
            quantity: cartItems.find(
              (cartItem) => cartItem.product._id.toString() === item
            ).quantity,
          };
        })
      );

      getCartItems();

      console.log(response);

      setAlert({
        show: true,
        success: true,
        msg: response.data.msg,
      });

      setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 3000);
    } catch (error) {
      console.log(error.response);
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
    getCartItems();
  }, []);

  return (
    <div>
      <Header
        leftLinks={<LeftLinks />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 200,
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
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "start",
            paddingLeft: "1.5rem",
          }}
        >
          {cartItems &&
            cartItems.map((item) => {
              const {
                _id,
                name,
                images,
                description,
                price,
                category,
                rating,
              } = item.product;
              let quantity = item.quantity;
              return (
                <Card
                  id={_id}
                  key={_id}
                  style={{ width: "20rem", margin: "1rem", flex: "0 0 22%" }}
                  onClick={() =>
                    rest.history.push({
                      pathname: "/products/" + _id,
                      state: { productId: _id },
                    })
                  }
                  onMouseOver={() =>
                    (document.getElementById(_id).style.cursor = "pointer")
                  }
                >
                  <img
                    style={{
                      height: "50%",
                      objectFit: "scale-down",
                      display: "block",
                    }}
                    className={classes.imgCardTop}
                    src={process.env.REACT_APP_BASE_URL + images[0]}
                    alt={name}
                  />
                  <CardBody>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                      }}
                    >
                      <h4 style={{ margin: "0" }} className={classes.cardTitle}>
                        {name}
                      </h4>
                      <h4 style={{ margin: "0" }}>${(1.0 * price) / 100}</h4>
                    </div>
                    <p style={{ margin: "0" }}>#{category}</p>
                    <Rating value={rating || 3} readOnly></Rating>
                    <p>{description.slice(0, 100)}</p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button color="transparent">
                        <RemoveRounded
                          onClick={changeProductQuantity(_id, quantity - 1)}
                        />
                      </Button>
                      <Input
                        inputProps={{ style: { textAlign: "center" } }}
                        value={quantity}
                      />
                      <Button color="transparent">
                        <AddRounded
                          onClick={changeProductQuantity(_id, quantity + 1)}
                        />
                      </Button>
                    </div>
                    <Checkbox
                      onClick={(e) => handleSelectProduct(e, _id)}
                      style={{
                        position: "absolute",
                        right: "0.5rem",
                        bottom: "0.5rem",
                      }}
                    />
                  </CardBody>
                </Card>
              );
            })}
        </div>
        <div>
          {alert.show && (
            <SnackbarContent
              message={<span>{alert.msg}</span>}
              color={alert.success ? "success" : "danger"}
              icon={alert.success ? Check : "info_outline"}
            />
          )}
        </div>
        {selectedProducts.length ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Button
              onClick={handleRemoveFromCart}
              style={{ marginRight: "2rem" }}
              color="info"
            >
              Remove from cart
            </Button>
            <Button
              onClick={handleOrder}
              style={{ marginLeft: "2rem" }}
              color="primary"
            >
              Buy now
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
