import React from 'react';
import {Box, CssBaseline, Grid, Stack, ThemeProvider, Typography} from "@mui/material";
import Sidebar from "./components/navigation/Sidebar";
import Topbar from "./components/navigation/Topbar";
import styled from "@emotion/styled";
import {WhiteTheme} from "./whiteTheme";
import Logo from "./components/navigation/Logo";
import ResearchPane from "./components/research/ResearchPane";
import Web3Provider from "./components/web3/Web3Provider";
import AppProviders from "./components/AppProviders";

const RootView = styled(Grid)(({theme})=> ({
    backgroundColor: theme.palette.grey[100]
}))

const MainView = styled.div(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    height: "100%",
}))

const SidebarView = styled(Grid)(({theme})=> ({
    backgroundColor: theme.palette.grey[200]
}))

function App() {
    return (
        <AppProviders>
            <RootView container sx={{height: "100%"}}>
                <SidebarView item xs={2}>
                    <Stack justifyContent="space-between" sx={{height: "100%"}}>
                        <Logo/>
                        <Sidebar/>
                        <Box p={1} sx={{textAlign: "center"}}>
                            <Typography variant="caption" display="block" gutterBottom>This site is in Beta</Typography>
                        </Box>
                    </Stack>
                </SidebarView>
                <Grid item xs={10}>
                    <MainView>
                        <Topbar/>
                        <Box sx={{flexGrow: "1",}} p={2}>
                            <ResearchPane/>
                        </Box>
                    </MainView>
                </Grid>
            </RootView>
        </AppProviders>
    );
}

export default App;
