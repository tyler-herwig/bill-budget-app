import './App.css';
import React, { Component } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Container, Grid, Paper } from '@mui/material';
import { AccountBalance, Payments } from '@mui/icons-material';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import Paychecks from './components/Paychecks';
import { BillsProvider } from './components/BillsContext';
import { PaychecksProvider } from './components/PaychecksContext';
import Bills from './components/Bills';
import BasicSpeedDial from './components/BasicSpeedDial';
import UserIntroSection from './components/UserIntroSection';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

class App extends Component {
    render() {
        return (
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <div className="App">
                    <PaychecksProvider>
                        <BillsProvider>
                            <ResponsiveAppBar />
                            <Container maxWidth="100%" style={{ marginTop: 15 }}>

                                <Box sx={{ flexGrow: 1 }}>
                                    <UserIntroSection/>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} lg={5}>
                                            <Item>
                                                <h2 align="left">
                                                    <AccountBalance /> Paychecks
                                                </h2>
                                                <Paychecks />
                                            </Item>
                                        </Grid>
                                        <Grid item xs={12} lg={7}>
                                            <Item>
                                                <h2 align="left">
                                                    <Payments /> Bills
                                                </h2>
                                                <Bills />
                                            </Item>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Container>
                            <BasicSpeedDial/>
                        </BillsProvider>
                    </PaychecksProvider>
                </div>
            </ThemeProvider>
        );
    }
}

export default App;