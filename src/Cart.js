import { useReactiveVar } from "@apollo/client";
import {
  Avatar,
  Box,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { cartItemsVar } from "./cache";

const useStyles = makeStyles((theme) => ({
  avatar: {
    marginRight: theme.spacing(1),
  },
}));

const Cart = () => {
  const classes = useStyles();
  const items = useReactiveVar(cartItemsVar);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const reduced = items.reduce((acc, curr) => {
      const { name } = curr;
      if (acc[name]) {
        acc[name].amount += 1;
      } else {
        acc[name] = { ...curr };
      }
      return acc;
    }, {});
    setCartItems(Object.values(reduced));
  }, [items]);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.map((row, i) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row">
                  <Box display="flex" alignItems="center">
                    <Avatar src={row.imgUrl} className={classes.avatar} />
                    {row.name}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <TextField
                    type="number"
                    value={row.amount}
                    onChange={(event) => {
                      const newCartItems = [...cartItems];
                      const found = newCartItems.find(
                        (v) => v.name === row.name
                      );
                      found.amount = event.target.value;

                      setCartItems(newCartItems);
                    }}
                  />
                </TableCell>
                <TableCell align="right">{row.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h5" align="right">
        Total: $
        {cartItems.reduce((acc, curr) => curr.amount * curr.price + acc, 0)}
      </Typography>
    </div>
  );
};

export default Cart;
