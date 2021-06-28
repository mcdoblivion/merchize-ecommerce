/*eslint-disable*/
import React from "react";

// react components for routing our app without refresh
import { Link } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";
import GridItem from "components/Grid/GridItem";
import CustomInput from "components/CustomInput/CustomInput";
import { InputAdornment } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import GridContainer from "components/Grid/GridContainer";

const useStyles = makeStyles(styles);

export default function LeftLinks(props) {
  const classes = useStyles();
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={4}>
        <CustomInput
          labelText="Search some products?"
          id="material"
          formControlProps={{
            fullWidth: true,
          }}
          inputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </GridItem>
    </GridContainer>
  );
}
