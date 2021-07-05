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
import Parallax from "components/Parallax/Parallax.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
// sections for this page
import RightLinks from "components/Header/RightLinks.js";
import styles from "assets/jss/material-kit-react/views/components.js";
import axiosInstance from "axiosInstance";
// import { useHistory } from "react-router-dom";
import CustomInput from "components/CustomInput/CustomInput";
import { InputAdornment } from "@material-ui/core";
import { Search } from "@material-ui/icons";

const useStyles = makeStyles(styles);

const HomePage = (props) => {
  // const history = useHistory();
  const classes = useStyles();
  const { ...rest } = props;

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const getProducts = async (search) => {
    try {
      const response = await axiosInstance.get(
        search != null ? `/products?search=${search}` : "/products"
      );
      if (response.status >= 200 && response.status <= 299) {
        console.log("Product:", response.data.data);
        const products = response.data.data;
        setProducts(products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchProduct = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    getProducts(search);
  }, [search]);

  return (
    <React.Fragment>
      <Header
        rightLinks={<RightLinks />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 500,
          color: "white",
        }}
        {...rest}
      />

      <Parallax image={require("assets/img/bg-home.png").default}>
        <div style={{ position: "absolute", top: "5rem", left: "3rem" }}>
          <CustomInput
            labelText="Search some products?"
            id="material"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              onChange: handleSearchProduct,
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </Parallax>

      <div
        className={classNames(classes.main, classes.mainRaised)}
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "start",
          paddingLeft: "1.5rem",
        }}
      >
        {products.map((product) => {
          const { _id, name, images, description, price, category, rating } =
            product;
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
                <Rating value={rating || 3} readOnly></Rating>
                <p>{description.slice(0, 100)}</p>
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
