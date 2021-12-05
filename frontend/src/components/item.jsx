import React, { useState, useEffect } from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Typography } from '@material-ui/core';

import axios from 'axios'

// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
    return { id, date, name, shipTo, paymentMethod, amount };
}

const rows = [
    createData(
        0,
        '16 Mar, 2019',
        'Elvis Presley',
        'Tupelo, MS',
        'VISA ⠀•••• 3719',
        312.44,
    ),
    createData(
        1,
        '16 Mar, 2019',
        'Paul McCartney',
        'London, UK',
        'VISA ⠀•••• 2574',
        866.99,
    ),
    createData(2, '16 Mar, 2019', 'Tom Scholz', 'Boston, MA', 'MC ⠀•••• 1253', 100.81),
    createData(
        3,
        '16 Mar, 2019',
        'Michael Jackson',
        'Gary, IN',
        'AMEX ⠀•••• 2000',
        654.39,
    ),
    createData(
        4,
        '15 Mar, 2019',
        'Bruce Springsteen',
        'Long Branch, NJ',
        'VISA ⠀•••• 5919',
        212.79,
    ),
];

function preventDefault(event) {
    event.preventDefault();
}

export default function Item() {
    //DataFetching()

    const [tweets, setTweets] = useState([])

    useEffect(() => {
        axios.get('/api/twitter/kolstimeline')
            .then(res => {
                //console.log("DataFetching : ",res.data)
                setTweets(res.data)
            })
            .catch(err => {
                console.log(err)
            })

    }, [])

    return (
        <React.Fragment>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Timeline
            </Typography>

            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Author ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Url</TableCell>
                        <TableCell>Tweet ID</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tweets.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.author_id}</TableCell>

                            <TableCell>{row.name}</TableCell>
                            <TableCell><a href={row.url}> {row.url} </a></TableCell>

                            <TableCell>{row.id}</TableCell>


                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
                See more orders
            </Link>
        </React.Fragment>
    );
}