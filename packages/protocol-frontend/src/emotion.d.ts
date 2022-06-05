import '@emotion/react'
import { Theme as MUITheme } from '@mui/material/styles';

declare module '@emotion/react' {
    export interface Theme extends MUITheme {}
}
