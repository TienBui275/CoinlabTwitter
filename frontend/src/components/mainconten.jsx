import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Item from './item';




const MainContent = () => {

    return (

        <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Item />
            </Paper>
        </Grid>

    );
};

export default MainContent;