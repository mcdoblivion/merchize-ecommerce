import React, { useState, useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Header from "components/Header/Header.js";
import RightLinks from "components/Header/RightLinks.js";
import LeftLinks from "components/Header/LeftLinks";
import Footer from "components/Footer/Footer.js";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";

import Card from "components/Card/Card.js";
import Carousel from "react-slick";

import styles from "assets/jss/material-kit-react/views/profilePage.js";

import CardBody from "components/Card/CardBody";
import { Rating } from "@material-ui/lab";
import axiosInstance from "axiosInstance";
import CustomInput from "components/CustomInput/CustomInput";
import { AddRounded, CommentRounded, RemoveRounded } from "@material-ui/icons";
import { Input, InputAdornment } from "@material-ui/core";

const useStyles = makeStyles(styles);

export default function ProductDetail(props) {
  const { ...rest } = props;
  const productId = rest.location.state.productId;

  const [product, setProduct] = useState({});
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(2.5);
  const [quantity, setQuantity] = useState("1");

  const getProduct = async () => {
    try {
      const response = await axiosInstance.get("/products/" + productId);
      if (response.status >= 200 && response.status <= 299) {
        console.log("Product:", response.data.data);
        const product = response.data.data;
        setProduct(product);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getComments = async () => {
    try {
      const response = await axiosInstance.get(
        `/products/${productId}/comments`
      );
      if (response.status >= 200 && response.status <= 299) {
        console.log("Comments:", response.data.data);
        const comments = response.data.data;
        setComments(comments);
        const finalRating =
          comments.reduce((acc, c) => acc + c.rating, 0) / comments.length;
        setRating(finalRating);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeQuantity = (e, value) => {
    if (value === 1 || value === -1) {
      if (Number(quantity) + value > 0)
        setQuantity((Number(quantity) + value).toString());
    } else if (value === 0) {
      console.log(e.target);
      console.log(e);
      if (
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        (e.keyCode >= 96 && e.keyCode <= 105)
      ) {
        setQuantity(Number(e.target.value + e.key).toString());
      }
      if (e.keyCode === 8) {
        setQuantity(parseInt(Number(quantity) / 10).toString());
      }
    }
  };

  useEffect(() => {
    getProduct();
    getComments();
  }, []);

  const classes = useStyles();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };
  return (
    <div>
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
      <Parallax
        small
        filter
        image={require("assets/img/bg-home.png").default}
      />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className="product">
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12}>
                <Card>
                  <Carousel {...settings}>
                    {product.images &&
                      product.images.map((image, index) => {
                        return (
                          <div key={index}>
                            <img
                              src={process.env.REACT_APP_BASE_URL + image}
                              alt={product.name}
                              className="slick-image"
                            />
                          </div>
                        );
                      })}
                  </Carousel>
                  <CardBody>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                      }}
                    >
                      <h4 style={{ margin: "0" }} className={classes.cardTitle}>
                        {product.name}
                      </h4>
                      <h4 style={{ margin: "0" }}>
                        ${(1.0 * product.price) / 100}
                      </h4>
                    </div>
                    <p style={{ margin: "0" }}>#{product.category}</p>
                    <Rating
                      value={rating || 2.5}
                      precision={0.5}
                      readOnly
                    ></Rating>
                    <p>{product.description}</p>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem>
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button color="transparent">
                      <RemoveRounded onClick={(e) => changeQuantity(e, -1)} />
                    </Button>
                    <Input
                      inputProps={{ style: { textAlign: "center" } }}
                      value={quantity}
                      onKeyUp={(e) => changeQuantity(e, 0)}
                    />
                    <Button color="transparent">
                      <AddRounded onClick={(e) => changeQuantity(e, 1)} />
                    </Button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    <Button style={{ marginRight: "2rem" }} color="info">
                      Add to cart
                    </Button>
                    <Button style={{ marginLeft: "2rem" }} color="primary">
                      Buy
                    </Button>
                  </div>
                </div>
              </GridItem>
              <GridItem>
                {comments &&
                  comments.map((comment) => {
                    return (
                      <Card key={comment._id} style={{ padding: "0 1rem" }}>
                        <h4>
                          {comment.author.firstName +
                            " " +
                            comment.author.lastName}
                        </h4>
                        <Rating
                          value={rating || 2.5}
                          precision={0.5}
                          readOnly
                        ></Rating>
                        <p>{comment.comment}</p>
                      </Card>
                    );
                  })}
              </GridItem>
              <GridItem xs={12} sm={8}>
                <Card style={{ padding: "1rem" }}>
                  <Rating name="final-rating" defaultValue={5}></Rating>
                  <CustomInput
                    labelText="Write comment"
                    id="material"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <CommentRounded />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Card>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
