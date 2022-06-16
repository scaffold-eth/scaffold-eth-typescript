import React, { createContext, SyntheticEvent, useContext, useState } from "react";
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface ISnackBar {
  alertError(msg: string): void;
  alertInfo(msg: string): void;
  alertSuccess(msg: string): void;
  alertWarning(msg: string): void;
}

const SnackbarContext = createContext<ISnackBar>({
  alertError(msg: string) {
    console.error("No AlertProvider")
  },
  alertInfo(msg: string) {
    console.error("No AlertProvider")
  },
  alertSuccess(msg: string) {
    console.error("No AlertProvider")
  },
  alertWarning(msg: string) {
    console.error("No AlertProvider")
  }
});

export type Severity = "error"|"warning"|"info"|"success"

export default function SnackBarProvider(props: React.PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<Severity|undefined>();
  const [message, setMessage] = useState("");

  const alertError = (msg: string) => {
    alert(msg, "error")
  }

  const alert = (msg: string, severity: Severity) => {
    setOpen(true);
    setSeverity(severity)
    setMessage(msg);
  }

  const alertWarning = (msg: string) => {
    alert(msg, "warning");
  }

  const alertInfo = (msg: string) => {
    alert(msg, "info");
  }

  const alertSuccess = (msg: string) => {
    alert(msg, "success");
  }

  const handleClose = (event: Event | SyntheticEvent<any, Event>, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{
      alertError,
      alertWarning,
      alertInfo,
      alertSuccess,
    }}>
      {props.children}
      <Snackbar
        open={open}
        anchorOrigin={{ vertical:"top", horizontal:"center" }}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export const useSnackBar = () => {
  return useContext(SnackbarContext);
}
