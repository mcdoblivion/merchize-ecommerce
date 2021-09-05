import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";

import Header from "components/Header/Header.js";
import LeftLinks from "components/Header/LeftLinks";
import Parallax from "components/Parallax/Parallax.js";

// import Checkbox from "@material-ui/core/Checkbox";
import styles from "assets/jss/material-kit-react/views/components.js";
import classNames from "classnames";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Rating from "@material-ui/lab/Rating";
import Button from "components/CustomButtons/Button.js";
import Checkbox from "@material-ui/core/Checkbox";
import {
  Check,
  Close,
  TextFormatRounded,
  ImageRounded,
  AttachMoneyRounded,
  LocalOfferRounded,
  Filter1Rounded,
  ChatRounded,
} from "@material-ui/icons";
import SnackbarContent from "components/Snackbar/SnackbarContent";
import InputAdornment from "@material-ui/core/InputAdornment";
import CustomInput from "components/CustomInput/CustomInput.js";

import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";

import axiosInstance from "axiosInstance";
import Bluebird from "bluebird";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(styles);
const scrollHeight = window.innerHeight;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function SellPage(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const history = useHistory();

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showModalModifyProduct, setShowModalModifyProduct] = useState(false);
  const [addProduct, setAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ images: [] });
  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    success: false,
  });

  const handleChangeNewProduct = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setNewProduct({ ...newProduct, [name]: value });
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

  const handleRemoveProducts = async () => {
    try {
      const response = await axiosInstance.delete("/products", {
        data: [...selectedProducts],
      });
      console.log(response.data);
      getProducts();

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

  const getProducts = async () => {
    try {
      const response = await axiosInstance.get("/products/own-products");
      if (response.status >= 200 && response.status <= 299) {
        console.log("Own products:", response.data.data);
        const products = response.data.data;
        setProducts(products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createProduct = async () => {
    try {
      const response = await axiosInstance.post("/products", {
        ...newProduct,
      });
      console.log(response.data);
      getProducts();
      setShowModalModifyProduct(false);
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

  const updateProduct = async (productId) => {
    try {
      const response = await axiosInstance.put(`/products/${productId}`, {
        name: newProduct.name,
        description: newProduct.description,
        images: newProduct.images,
        category: newProduct.category,
        price: newProduct.price,
        numberInStock: newProduct.numberInStock,
      });
      console.log(response.data);
      getProducts();
      setShowModalModifyProduct(false);
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

  const uploadImage = async (e) => {
    try {
      const formData = new FormData();
      formData.append(e.target.name, e.target.files[0]);
      const response = await axiosInstance.post("/images", formData);
      console.log(response.data);
      const newProductTemp = { ...newProduct };
      if (newProductTemp.images) {
        newProductTemp.images.push(response.data.path);
      } else {
        newProductTemp.images = [response.data.path];
      }
      setNewProduct(newProductTemp);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveImage = async (e, imagePath) => {
    try {
      if (addProduct) {
        const arr = imagePath.split("/");
        const imageName = arr[arr.length - 1];
        await axiosInstance.delete(`/images/${imageName}`);
      }
      const newImages = newProduct.images.filter(
        (image) => image !== imagePath
      );
      setNewProduct({ ...newProduct, images: newImages });
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleModifyProduct = async () => {
    try {
      const images = addProduct
        ? newProduct.images
        : newProduct.images.filter((img) => {
            const imagesBefore = products.find(
              (p) => p._id === newProduct._id
            ).images;
            return !imagesBefore.includes(img);
          });

      const imageNames = images.map((image) => {
        const arr = image.split("/");
        return arr[arr.length - 1];
      });

      await Bluebird.map(
        imageNames,
        async (imageName) => {
          const vResponse = await axiosInstance.delete(`/images/${imageName}`);
          return vResponse.data;
        },
        { concurrency: imageNames.length }
      );
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    getProducts();
    setAlert({
      show: false,
      msg: "",
      success: false,
    });
  }, []);

  return (
    <div>
      <Header
        leftLinks={<LeftLinks />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: scrollHeight * 0.2,
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
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={() => history.push("/seller/orders")}
            color="primary"
            style={{ margin: "1rem" }}
          >
            Go to sell orders
          </Button>
          <Button
            onClick={() => {
              setNewProduct({});
              setAddProduct(true);
              setShowModalModifyProduct(true);
            }}
            color="primary"
            style={{ margin: "1rem" }}
          >
            Add new product
          </Button>
          <Dialog
            classes={{
              root: classes.center,
              paper: classes.modal,
            }}
            open={showModalModifyProduct}
            TransitionComponent={Transition}
            keepMounted
            onClose={async () => {
              setShowModalModifyProduct(false);
              await handleModifyProduct();
              setNewProduct({});
            }}
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
                {addProduct ? "Create new product" : "Edit product"}
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
                onClick={async () => {
                  setShowModalModifyProduct(false);
                  await handleModifyProduct();
                  setNewProduct({});
                }}
              >
                <Close className={classes.modalClose} />
              </IconButton>
            </DialogTitle>
            <DialogContent
              id="modal-slide-description"
              className={classes.modalBody}
            >
              <CustomInput
                labelText="Product name"
                id="product-name"
                formControlProps={{
                  required: true,
                  fullWidth: true,
                }}
                inputProps={{
                  name: "name",
                  value: newProduct.name || "",
                  onChange: handleChangeNewProduct,
                  type: "text",
                  endAdornment: (
                    <InputAdornment position="end">
                      <TextFormatRounded className={classes.inputIconsColor} />
                    </InputAdornment>
                  ),
                }}
              />
              <CustomInput
                labelText="Product description"
                id="product-description"
                formControlProps={{
                  required: true,
                  fullWidth: true,
                }}
                inputProps={{
                  name: "description",
                  value: newProduct.description || "",
                  onChange: handleChangeNewProduct,
                  type: "text",
                  endAdornment: (
                    <InputAdornment position="end">
                      <ChatRounded className={classes.inputIconsColor} />
                    </InputAdornment>
                  ),
                }}
              />
              <div>
                <p>Images</p>
                {newProduct.images && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "start",
                    }}
                  >
                    {newProduct.images.map((image, index) => (
                      <div style={{ position: "relative" }} key={index}>
                        <img
                          src={process.env.REACT_APP_BASE_URL + image}
                          alt={image}
                          style={{
                            width: "auto",
                            height: "7rem",
                            borderRadius: "1rem",
                            margin: "0 0.5rem",
                          }}
                        />
                        <IconButton
                          style={{
                            position: "absolute",
                            top: "0",
                            right: "0",
                            margin: "0",
                            padding: "0",
                          }}
                          key="remove-image"
                          onClick={(e) => handleRemoveImage(e, image)}
                        >
                          <Close />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <CustomInput
                labelText="Add image"
                id="product-images"
                formControlProps={{
                  required: true,
                  fullWidth: true,
                }}
                inputProps={{
                  name: "imageFile",
                  type: "file",
                  onChange: uploadImage,
                  endAdornment: (
                    <InputAdornment position="end">
                      <ImageRounded className={classes.inputIconsColor} />
                    </InputAdornment>
                  ),
                }}
              />
              <CustomInput
                labelText="Category"
                id="product-category"
                formControlProps={{
                  required: true,
                  fullWidth: true,
                }}
                inputProps={{
                  name: "category",
                  value: newProduct.category || "",
                  onChange: handleChangeNewProduct,
                  type: "text",
                  endAdornment: (
                    <InputAdornment position="end">
                      <LocalOfferRounded className={classes.inputIconsColor} />
                    </InputAdornment>
                  ),
                }}
              />
              <CustomInput
                labelText="Price"
                id="product-price"
                formControlProps={{
                  required: true,
                  fullWidth: true,
                }}
                inputProps={{
                  name: "price",
                  value: newProduct.price || "",
                  onChange: handleChangeNewProduct,
                  type: "text",
                  endAdornment: (
                    <InputAdornment position="end">
                      <AttachMoneyRounded className={classes.inputIconsColor} />
                    </InputAdornment>
                  ),
                }}
              />
              <CustomInput
                labelText="Number in stock"
                id="product-number-in-stock"
                formControlProps={{
                  required: true,
                  fullWidth: true,
                }}
                inputProps={{
                  name: "numberInStock",
                  value: newProduct.numberInStock || "",
                  onChange: handleChangeNewProduct,
                  type: "text",
                  endAdornment: (
                    <InputAdornment position="end">
                      <Filter1Rounded className={classes.inputIconsColor} />
                    </InputAdornment>
                  ),
                }}
              />
            </DialogContent>
            {alert.show && (
              <SnackbarContent
                message={<span>{alert.msg}</span>}
                color={alert.success ? "success" : "danger"}
                icon={alert.success ? Check : "info_outline"}
              />
            )}
            <DialogActions
              className={classes.modalFooter + " " + classes.modalFooterCenter}
            >
              <Button
                onClick={async () => {
                  setShowModalModifyProduct(false);
                  await handleModifyProduct();
                  setNewProduct({});
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  addProduct ? createProduct() : updateProduct(newProduct._id);
                }}
                color="success"
              >
                {addProduct ? "Create product" : "Update product"}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        {alert.show && (
          <SnackbarContent
            message={<span>{alert.msg}</span>}
            color={alert.success ? "success" : "danger"}
            icon={alert.success ? Check : "info_outline"}
          />
        )}
        <div
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
              <React.Fragment key={_id}>
                <div style={{ width: "25%", padding: "0.5rem" }}>
                  <Card
                    id={_id}
                    style={{
                      height: "25rem",
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
                          justifyContent: "space-between",
                        }}
                      >
                        <h4
                          style={{
                            margin: "0",
                            maxHeight: "1rem",
                            lineHeight: "1rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          className={classes.cardTitle}
                        >
                          {name}
                        </h4>
                        <h4 style={{ margin: "0" }}>${(1.0 * price) / 100}</h4>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                        }}
                      >
                        <p style={{ margin: "0" }}>#{category}</p>
                        <h5 style={{ margin: "0" }}>Stock: {numberInStock}</h5>
                      </div>
                      <Rating value={rating || 3} readOnly></Rating>
                      <p
                        style={{
                          height: "2rem",
                          lineHeight: "1rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {description}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setNewProduct({
                              _id: _id,
                              name: name,
                              description: description,
                              category: category,
                              price: ((price * 1.0) / 100).toString(),
                              numberInStock: numberInStock,
                              images: [...images],
                            });
                            setAddProduct(false);
                            setShowModalModifyProduct(true);
                          }}
                          color="primary"
                          style={{ position: "absolute", bottom: "0.3rem" }}
                        >
                          Edit product
                        </Button>
                        <Checkbox
                          onClick={(e) => handleSelectProduct(e, _id)}
                          style={{
                            position: "absolute",
                            right: "0",
                            bottom: "0",
                          }}
                        />
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        {selectedProducts.length ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "2rem",
            }}
          >
            <Button onClick={handleRemoveProducts} color="primary">
              Remove products
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
