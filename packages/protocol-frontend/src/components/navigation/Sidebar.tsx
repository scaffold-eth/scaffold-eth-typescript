import { Box, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import InboxIcon from '@mui/icons-material/Inbox';
import React from "react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";

interface SidebarLink {
    label: string,
    destination: string,
    icon?: () => any
}

export const menuItems: SidebarLink[] = [
    {
        label: "Reports",
        destination: "/",
        icon: () => (
            <ListItemIcon>
                <InboxIcon />
            </ListItemIcon>)
    },
    {
      label: "Contributors",
      destination: "/contributors",
      icon: () => (
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>)
    }
]

function Sidebar() {
  const navigate = useNavigate();
    return (
        <Box>
            <List>
                {menuItems.map((link) => (
                    <ListItem disablePadding key={link.destination}>
                        <ListItemButton onClick={()=> navigate(link.destination)}>
                            {link.icon? link.icon(): null}
                            <ListItemText>
                              <Link component={ReactRouterLink} to={link.destination}>
                                {link.label}
                              </Link>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}

export default Sidebar;
