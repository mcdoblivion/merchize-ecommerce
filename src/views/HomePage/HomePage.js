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
import LeftLinks from "components/Header/LeftLinks.js";
import styles from "assets/jss/material-kit-react/views/components.js";
import axiosInstance from "axiosInstance";
// import { useHistory } from "react-router-dom";
import CustomInput from "components/CustomInput/CustomInput";
import { InputAdornment } from "@material-ui/core";
import { Search } from "@material-ui/icons";

const useStyles = makeStyles(styles);
const scrollHeight = window.innerHeight;

const HomePage = (props) => {
  // const history = useHistory();
  const classes = useStyles();
  const { ...rest } = props;

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const getProducts = async (search) => {
    try {
      const response = await axiosInstance.get(
        search !== "" ? `/products?search=${search}` : "/products"
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
        leftLinks={<LeftLinks />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: scrollHeight * 0.7,
          color: "white",
        }}
        {...rest}
      />

      <Parallax image={require("assets/img/bg-home.png").default} />

      <div
        style={{
          position: "fixed",
          top: "1rem",
          right: "3rem",
          zIndex: "9999",
        }}
      >
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

      <div
        className={classNames(classes.main, classes.mainRaised)}
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "start",
          padding: "1rem",
        }}
      >
        {products.map((product) => {
          const {
            _id,
            name,
            images,
            description,
            price,
            category,
            rating,
            numberInStock,
          } = product;
          return (
            numberInStock > 0 && (
              <div
                key={_id}
                style={{
                  padding: "1rem",
                  width: "25%",
                }}
              >
                <Card
                  id={_id}
                  style={{
                    height: "25rem",
                    margin: "0",
                    flex: "0 0 25%",
                  }}
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
                    <p
                      style={{
                        maxHeight: "3.6rem",
                        lineHeight: "1.2rem",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {description}
                    </p>
                  </CardBody>
                </Card>
              </div>
            )
          );
        })}
      </div>

      <Footer />
    </React.Fragment>
  );
};

export default HomePage;
