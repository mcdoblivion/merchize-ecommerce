import React, { useState, useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react components for routing our app without refresh
// import { Link } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
// @material-ui/icons
// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import Button from "components/CustomButtons/Button.js";
import Parallax from "components/Parallax/Parallax.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
// sections for this page
import RightLinks from "components/Header/RightLinks.js";
import styles from "assets/jss/material-kit-react/views/components.js";
import LeftLinks from "components/Header/LeftLinks";
import axios from "axios";

const useStyles = makeStyles(styles);

const HomePage = (props) => {
  const classes = useStyles();
  const { ...rest } = props;

  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_BASE_URL + "/products"
      );
      if (response.status >= 200 && response.status <= 299) {
        console.log(response.data.data);
        const products = response.data.data;
        setProducts(products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);
  return (
    <React.Fragment>
      <Header
        leftLinks={<LeftLinks />}
        rightLinks={<RightLinks />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 500,
          color: "white",
        }}
        {...rest}
      />

      <Parallax image={require("assets/img/bg-home.png").default}></Parallax>

      <div
        className={classNames(classes.main, classes.mainRaised)}
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        {products.map((product) => {
          const { _id, name, images, description, price, comments, category } =
            product;
          return (
            <Card
              key={_id}
              style={{ width: "20rem", margin: "1rem", flex: "0 0 22%" }}
            >
              <img
                style={{ height: "180px", width: "100%", display: "block" }}
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
                <Rating
                  value={
                    comments.reduce((acc, c) => acc + c.rating, 0) /
                      comments.length || 2.5
                  }
                  precision={0.5}
                  readOnly
                ></Rating>
                <p style={{ height: "7rem" }}>{description.slice(0, 100)}</p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-around",
                    position: "absolute",
                    bottom: "0.5rem",
                  }}
                >
                  <Button color="info">Add to cart</Button>
                  <Button color="primary">Buy</Button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Footer />
    </React.Fragment>
  );
};

export default HomePage;
