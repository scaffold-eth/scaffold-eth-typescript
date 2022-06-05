import React, {useState} from "react";
import {Box, Button, Stack, TextField, Typography} from "@mui/material";

function ResearchPane() {
    const [vin, setVin] = useState<string>();
    const vinRegex = RegExp('^[(A-H|J-N|P|R-Z|0-9)]{17}$');
    const [isValidVIN, setIsValidVin] = useState<boolean>();
    const handleSerialNumber = (event: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        const newVin = event.target.value;
        setVin(newVin);
        setIsValidVin(vinRegex.test(newVin))
    }
    return (
        <>
            <Box py={4}>
                <Typography variant={"h3"} sx={{textAlign:"center"}} gutterBottom>Search for reports</Typography>
                <Stack direction={"row"} spacing={1} justifyContent={"center"}>
                    <TextField label="Serial Number"
                               variant="outlined"
                               value={vin}
                               onChange={handleSerialNumber}/>
                    <Button variant={"contained"} disabled={!isValidVIN}>Search</Button>
                </Stack>
            </Box>
        </>
    )
}

export default ResearchPane;
