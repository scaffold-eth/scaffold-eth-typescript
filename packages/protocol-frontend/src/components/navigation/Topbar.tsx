import styled from "@emotion/styled";
import Account from "../Account";
import {Box} from "@mui/material";

const Root = styled(Box)(({theme}) => ({
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end'
}))

function Topbar() {
    return (<Root><Account/></Root>)
}
export default Topbar;
