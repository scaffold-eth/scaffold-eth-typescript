import {Box, Typography, useTheme} from "@mui/material";
import React from "react";

function Logo(){
    const theme = useTheme()
    return (
        <Box p={3} sx={{textAlign: "center"}}>
            <Typography sx={{color: theme.palette.primary.main}} component="h1">Car Story</Typography>
        </Box>
    );
}
export default Logo;
