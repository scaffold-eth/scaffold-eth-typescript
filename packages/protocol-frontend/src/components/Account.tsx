import { Button, Typography } from "@mui/material";
import { hooks, metaMask } from './web3/metamask-connector'
import { shortenAddress } from "../utils/addresses";
import { useSnackBar } from "./SnackBarProvider";

const { useAccounts, useIsActivating, useIsActive,  } = hooks

function Account() {
    const isActive = useIsActive();
    const isActivating = useIsActivating();
    const accounts = useAccounts();
    const {alertInfo, alertSuccess, alertError} = useSnackBar()

    const handleConnection = () => {
        alertInfo("Waiting for Metamask connection");
        metaMask.activate()
          .then(() => alertSuccess("Connected successfully"))
          .catch(() => alertError("Failed to connect"))
    }

    if (isActive){
        return (<Typography>{accounts ? shortenAddress(accounts[0]) : ""}</Typography>)
    } else if(isActivating) {
        return (<Typography>Logging in...</Typography>)
    }
    return (
        <Button onClick={handleConnection}>
            Connect
        </Button>
    )
}

export default Account;
