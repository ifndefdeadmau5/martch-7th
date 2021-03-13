import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { cartItemsVar } from "./cache";
import data from "./data";

const useStyles = makeStyles({
  media: {
    height: 140,
  },
});

const ProductList = () => {
  const classes = useStyles();
  const prev = cartItemsVar();

  return (
    <>
      <Grid container justify="center" spacing={6}>
        {data.map(({ name, price, imgUrl }, index) => (
          <Grid key={index} item xs={4}>
            <Card
              onClick={() => {
                cartItemsVar([...prev, { name, price, imgUrl }]);
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
    </>
  );
};

export default ProductList;
