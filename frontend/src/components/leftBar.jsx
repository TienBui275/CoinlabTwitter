import { Container, Divider, makeStyles, Typography } from "@material-ui/core";
import {
    Bookmark,
    List,
    ExitToApp,
    Home,
    Person,
    PhotoCamera,
    PlayCircleOutline,
    Settings,
    Storefront,
    TabletMac,
} from "@material-ui/icons";
import axios from 'axios'

import { useState, useEffect } from 'react';



const useStyles = makeStyles((theme) => ({
    container: {
        height: "100vh",
        color: "white",
        paddingTop: theme.spacing(10),
        backgroundColor: theme.palette.primary.main,
        position: "sticky",
        top: 0,
        [theme.breakpoints.up("sm")]: {
            backgroundColor: "white",
            color: "#555",
            border: "1px solid #ece7e7",
        },
    },
    item: {
        display: "flex",
        alignItems: "center",
        marginBottom: theme.spacing(4),
        [theme.breakpoints.up("sm")]: {
            marginBottom: theme.spacing(3),
            cursor: "pointer",
        },
    },
    icon: {
        marginRight: theme.spacing(1),
        [theme.breakpoints.up("sm")]: {
            fontSize: "18px",
        },
    },
    text: {
        fontWeight: 500,
        [theme.breakpoints.down("sm")]: {
            display: "none",
        },
    },
}));

const Leftbar = () => {

    const [kols, setKols] = useState([])

    useEffect(() => {
        axios
            .get('/api/twitter/kols')
            .then(res => {
                //console.log(res.data)
                setKols(res.data)


            })
            .catch(err => {
                console.log(err)
            })

    }, [])
    // console.log(kols)
    const classes = useStyles();
    return (
        <Container className={classes.container}>
            <div className={classes.item}>
                <Home className={classes.icon} />
                <Typography className={classes.text}

                    onClick={() => {
                        alert('clicked');
                    }}


                >Homepage</Typography>
            </div>
            <div className={classes.item}>
                <Person className={classes.icon} />
                <Typography className={classes.text}>Friends</Typography>
            </div>
            <Divider />

            <div className={classes.item}>
                <ul>

                    {kols.map((row) => (
                        <li key={row.id}>
                            {row.name}

                        </li>

                    ))}


                </ul>
            </div>

        </Container>
    );
};

export default Leftbar;