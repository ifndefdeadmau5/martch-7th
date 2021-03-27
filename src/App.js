import { useReactiveVar } from "@apollo/client";
import {
  AppBar,
  Box,
  Container,
  createMuiTheme,
  IconButton,
  makeStyles,
  ThemeProvider,
  Toolbar,
  Typography,
  Switch,
  Badge,
} from "@material-ui/core";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch as RouterSwitch,
} from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import MenuIcon from "@material-ui/icons/Menu";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { useState } from "react";
import { cartItemsVar } from "./cache";
import ProductList from "./ProductList";
import Cart from "./Cart";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function App() {
  const classes = useStyles();
  const [dark, setDark] = useState(true);
  const items = useReactiveVar(cartItemsVar);

  const theme = createMuiTheme({
    palette: {
      type: dark ? "dark" : "light",
      primary: {
        main: "#e91e63",
      },
      secondary: {
        main: "#ffc400",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className="button lg xs"
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              <Link to="/">Home</Link>
            </Typography>
            <Switch
              value={dark}
              onChange={(event, checked) => setDark(checked)}
            />
            <Link to="/cart">
              <IconButton aria-label="cart">
                <Badge badgeContent={items.length} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Link>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg">
          <Box pt={7}>
            <RouterSwitch>
              <Route path="/" exact>
                <ProductList />
              </Route>
              <Route path="/Cart">
                <Cart />
              </Route>
            </RouterSwitch>
          </Box>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
