import './App.css';
import { Grid, makeStyles } from "@material-ui/core";
import Leftbar from "./components/leftBar";
import Navbar from './components/navBar';
import MainContent from './components/mainconten';


const useStyles = makeStyles((theme) => ({
  right: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <div className="App">
      <Navbar />
      <Grid container>

        <Grid item sm={2} xs={2}>
          <Leftbar />
        </Grid>

        <Grid item sm={7} xs={10}>
              <MainContent />
        </Grid>
       
      </Grid>
    </div>
  );
}

export default App;
