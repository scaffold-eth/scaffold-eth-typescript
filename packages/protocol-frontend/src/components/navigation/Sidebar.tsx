import {Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import InboxIcon from '@mui/icons-material/Inbox';
import React from "react";

interface SidebarLink {
    label: string,
    destination: string,
    icon?: () => any
}

export const menuItems: SidebarLink[] = [
    {
        label: "Reports",
        destination: "/reports",
        icon: () => (
            <ListItemIcon>
                <InboxIcon />
            </ListItemIcon>)
    }
]

function Sidebar() {
    return (
        <Box>
            <List>
                {menuItems.map((link) => (
                    <ListItem disablePadding key={link.destination}>
                        <ListItemButton>
                            {link.icon? link.icon(): null}
                            <ListItemText primary={link.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}

export default Sidebar;
