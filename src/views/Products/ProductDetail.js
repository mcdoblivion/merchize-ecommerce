import React, { useState, useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Header from "components/Header/Header.js";
import LeftLinks from "components/Header/LeftLinks";
import Footer from "components/Footer/Footer.js";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";

import Card from "components/Card/Card.js";
import Carousel from "react-slick";

import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";

import styles from "assets/jss/material-kit-react/views/profilePage.js";

import CardBody from "components/Card/CardBody";
import { Rating } from "@material-ui/lab";
import axiosInstance from "axiosInstance";
import CustomInput from "components/CustomInput/CustomInput";
import {
  AddRounded,
  Check,
  CommentRounded,
  RemoveRounded,
  Close,
} from "@material-ui/icons";
import { Input, InputAdornment } from "@material-ui/core";
import SnackbarContent from "components/Snackbar/SnackbarContent";

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function ProductDetail(props) {
  const { ...rest } = props;
  const productId = rest.location.state.productId;

  const [userId, setUserId] = useState("");
  const [product, setProduct] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ rating: 5, comment: "" });
  const [ownComment, setOwnComment] = useState({
    _id: "",
    rating: 5,
    comment: "",
  });
  const [quantity, setQuantity] = useState("1");
  const [showModalUpdateComment, setShowModalUpdateComment] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    success: false,
  });

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/users/jwt-info");
      console.log(response.data);
      setUserId(response.data.user._id);
    } catch (error) {
      console.log(error.response.data);
    }
  };

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
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getOwnComment = async (commentId) => {
    try {
      const response = await axiosInstance.get(
        `/products/comments/${commentId}`
      );
      const foundComment = response.data.data;
      console.log("Own comment:", foundComment);
      if (foundComment)
        setOwnComment({
          _id: foundComment._id,
          comment: foundComment.comment,
          rating: foundComment.rating,
        });
    } catch (error) {
      console.log(error);
    }
  };

  const createCart = async () => {
    try {
      const response = await axiosInstance.post("/carts", {
        product: product._id,
        quantity: Number(quantity),
      });

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

  const createOrder = async () => {
    try {
      const response = await axiosInstance.post("/orders", [
        {
          seller: product.seller._id,
          product: product._id,
          quantity: quantity,
        },
      ]);
      getProduct();

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

  const createComment = async () => {
    try {
      const response = await axiosInstance.post(
        `/products/${productId}/comments`,
        { ...newComment }
      );
      console.log(response.data);

      getComments();
      getProduct();

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

  const updateComment = async (commentId) => {
    try {
      const response = await axiosInstance.put(
        `/products/${productId}/comments/${commentId}`,
        { comment: ownComment.comment, rating: ownComment.rating }
      );
      console.log(response.data);
      getComments();
      getProduct();
      setShowModalUpdateComment(false);
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

  const handleNewComment = (e) => {
    setNewComment({ ...newComment, comment: e.target.value });
    if (e.keyCode === 13 && newComment.comment) {
      createComment();
      setNewComment({ rating: 5, comment: "" });
    }
  };

  const handleOwnComment = (e) => {
    setOwnComment({ ...ownComment, comment: e.target.value });
    if (e.keyCode === 13 && ownComment.comment) {
      updateComment(ownComment._id);
      setOwnComment({ id: "", rating: 5, comment: "" });
      getComments();
      setShowModalUpdateComment(false);
    }
  };

  const handleDeleteComment = (commentId) => async () => {
    try {
      const response = await axiosInstance.delete(
        `/products/${productId}/comments/${commentId}`
      );
      console.log(response.data);
      getComments();
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
    getUserInfo();
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
                              style={{
                                height: "30rem",
                                objectFit: "scale-down",
                                display: "block",
                              }}
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
                      <h3 style={{ margin: "0" }} className={classes.cardTitle}>
                        {product.name}
                      </h3>
                      <h3 style={{ margin: "0" }}>
                        ${(1.0 * product.price) / 100}
                      </h3>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                      }}
                    >
                      <h4>
                        Seller:
                        {product.seller
                          ? " " +
                            product.seller.firstName +
                            " " +
                            product.seller.lastName
                          : "null"}
                      </h4>
                      <h4>Number in stock:{" " + product.numberInStock}</h4>
                    </div>
                    <p style={{ margin: "0" }}>#{product.category}</p>
                    <Rating
                      value={product.rating || 2.5}
                      precision={0.5}
                      readOnly
                    ></Rating>
                    <p>{product.description}</p>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem>
                <div>
                  <div>
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
                    <Button
                      onClick={createCart}
                      style={{ marginRight: "2rem" }}
                      color="info"
                    >
                      Add to cart
                    </Button>
                    <Button
                      onClick={createOrder}
                      style={{ marginLeft: "2rem" }}
                      color="primary"
                    >
                      Buy
                    </Button>
                  </div>
                </div>
              </GridItem>
              <GridItem>
                {comments &&
                  comments.map((pComment) => {
                    const { _id, author, rating, comment } = pComment;
                    return (
                      <Card key={_id}>
                        <div
                          style={{
                            padding: "0 1rem",
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            <h4>{author.firstName + " " + author.lastName}</h4>
                            <Rating value={rating} readOnly></Rating>
                            <p>{comment}</p>
                          </div>
                          {userId === author._id && (
                            <div>
                              <Dialog
                                classes={{
                                  root: classes.center,
                                  paper: classes.modal,
                                }}
                                open={showModalUpdateComment}
                                TransitionComponent={Transition}
                                keepMounted
                                onClose={() => setShowModalUpdateComment(false)}
                                aria-labelledby="modal-slide-title"
                                aria-describedby="modal-slide-description"
                              >
                                <DialogTitle
                                  id="classic-modal-slide-title"
                                  disableTypography
                                  className={classes.modalHeader}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <h4 style={{ fontWeight: "bold" }}>
                                    Edit comment
                                  </h4>
                                  <IconButton
                                    style={{
                                      position: "absolute",
                                      top: "0",
                                      right: "0",
                                    }}
                                    key="close"
                                    aria-label="Close"
                                    color="inherit"
                                    onClick={() =>
                                      setShowModalUpdateComment(false)
                                    }
                                  >
                                    <Close className={classes.modalClose} />
                                  </IconButton>
                                </DialogTitle>
                                <DialogContent
                                  id="modal-slide-description"
                                  className={classes.modalBody}
                                >
                                  <Card style={{ padding: "1rem" }}>
                                    <Rating
                                      onChange={(e, updateRating) =>
                                        setOwnComment({
                                          ...ownComment,
                                          rating: updateRating,
                                        })
                                      }
                                      name="update-rating"
                                      value={ownComment.rating}
                                    ></Rating>
                                    <CustomInput
                                      id="update-comment"
                                      formControlProps={{
                                        fullWidth: true,
                                      }}
                                      inputProps={{
                                        endAdornment: (
                                          <InputAdornment position="end">
                                            <CommentRounded />
                                          </InputAdornment>
                                        ),
                                        value: ownComment.comment,
                                        onChange: handleOwnComment,
                                        onKeyUp: handleOwnComment,
                                      }}
                                    />
                                  </Card>
                                </DialogContent>
                                {alert.show && (
                                  <SnackbarContent
                                    message={<span>{alert.msg}</span>}
                                    color={alert.success ? "success" : "danger"}
                                    icon={
                                      alert.success ? Check : "info_outline"
                                    }
                                  />
                                )}
                                <DialogActions
                                  className={
                                    classes.modalFooter +
                                    " " +
                                    classes.modalFooterCenter
                                  }
                                >
                                  <Button
                                    onClick={() =>
                                      setShowModalUpdateComment(false)
                                    }
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      updateComment(ownComment._id);
                                    }}
                                    color="success"
                                  >
                                    Update comment
                                  </Button>
                                </DialogActions>
                              </Dialog>
                              <Button
                                onClick={() => {
                                  getOwnComment(_id);
                                  setShowModalUpdateComment(true);
                                }}
                                style={{ margin: "0" }}
                                color="transparent"
                              >
                                Edit
                              </Button>
                              <br />
                              <Button
                                onClick={handleDeleteComment(_id)}
                                style={{ margin: "0" }}
                                color="transparent"
                              >
                                Delete
                              </Button>
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
              </GridItem>
              <GridItem xs={12} sm={8}>
                <Card style={{ padding: "1rem" }}>
                  <Rating
                    onChange={(e, newRating) =>
                      setNewComment({ ...newComment, rating: newRating })
                    }
                    name="new-rating"
                    value={newComment.rating}
                  ></Rating>
                  <CustomInput
                    labelText="Write comment"
                    id="new-comment"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <CommentRounded />
                        </InputAdornment>
                      ),
                      value: newComment.comment,
                      onChange: handleNewComment,
                      onKeyUp: handleNewComment,
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
