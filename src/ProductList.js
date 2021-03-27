import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  makeStyles,
  Typography,
  Button,
  DialogTitle,
  DialogContent,
  Dialog,
  TextField,
  Box,
  DialogActions,
} from "@material-ui/core";
import { gql, useMutation, useQuery } from "@apollo/client";
import { cartItemsVar } from "./cache";
import { useState } from "react";

const useStyles = makeStyles({
  media: {
    height: 140,
  },
});

const GET_PRODUCTS = gql`
  query Products {
    products {
      id
      name
      price
      imgUrl
    }
  }
`;

const ADD_PRODUCT = gql`
  mutation AddProduct($input: ProductInput!) {
    addProduct(input: $input) {
      id
      name
      price
      imgUrl
    }
  }
`;

const ProductList = () => {
  const { data, loading } = useQuery(GET_PRODUCTS, {
    onError: () => {},
    onCompleted: () => {},
  });

  const [addProduct, { loading: addProductLoading }] = useMutation(
    ADD_PRODUCT,
    {
      update(cache, { data: { addProduct } }) {
        cache.modify({
          fields: {
            products(existingProducts = []) {
              const newProductRef = cache.writeFragment({
                data: addProduct,
                fragment: gql`
                  fragment NewProduct on Product {
                    id
                    name
                    price
                    imgUrl
                  }
                `,
              });
              return [...existingProducts, newProductRef];
            },
          },
        });
      },
      onCompleted: () => {
        setOpen(false);
      },
      onError: () => {},
    }
  );
  const classes = useStyles();
  const [formValues, setFormValues] = useState({
    name: "",
    price: 0,
    imgUrl: "",
  });

  const [open, setOpen] = useState(false);
  const prev = cartItemsVar();

  const handleChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    addProduct({
      variables: {
        input: {
          ...formValues,
          price: Number(formValues.price),
        },
      },
    });
  };

  return (
    <>
      <Grid container justify="center" spacing={6}>
        {data &&
          data.products.map(({ name, price, imgUrl, id }) => (
            <Grid key={id} item xs={4}>
              <Card
                onClick={() => {
                  cartItemsVar([...prev, { name, price, imgUrl, amount: 1 }]);
                }}
              >
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={imgUrl}
                    title="Product Thumbnail"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      ${price}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
      </Grid>
      <Dialog maxWidth="xs" fullWidth open={open} onClose={handleClose}>
        <DialogTitle>상품 추가</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" p={3}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  placeholder="상품명"
                  value={formValues.name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="price"
                  placeholder="가격"
                  value={formValues.price}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="imgUrl"
                  placeholder="썸네일 주소"
                  value={formValues.imgUrl}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Button onClick={handleOpen}>ADD</Button>
    </>
  );
};

export default ProductList;
