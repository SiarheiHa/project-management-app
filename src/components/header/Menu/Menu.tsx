import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import React from 'react';

interface IHeaderMenuItemsInterface {
  name: string;
  url?: string;
  onClick?: () => void;
  icon?: JSX.Element;
}

interface IHeaderMenu {
  items: IHeaderMenuItemsInterface[];
  icon?: JSX.Element;
  text?: string;
  alwaysIcon?: boolean;
}
const HeaderMenu = ({ items, icon, text, alwaysIcon = false }: IHeaderMenu) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ display: { xs: 'none', md: alwaysIcon ? 'none' : 'flex' } }}>
        {items.map(({ name, url, onClick, icon }) => (
          <Button key={name} href={url} onClick={onClick} color="inherit">
            {name} {icon}
          </Button>
        ))}
      </Box>

      <Box sx={{ display: { xs: 'flex', md: alwaysIcon ? 'flex' : 'none' } }}>
        <IconButton size="small" onClick={handleOpenMenu} color="inherit">
          {icon} {text && <Typography>{text}</Typography>}
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {items.map(({ name, url, onClick }) => (
          <MenuItem
            key={name}
            component={Button}
            href={url}
            onClick={() => {
              if (onClick !== undefined) {
                onClick();
              }
              handleCloseMenu();
            }}
          >
            <Typography textAlign="center">{name}</Typography>
          </MenuItem>
        ))}
      </Menu>

      {/*{variant === 'drawer' && (*/}
      {/*  <Drawer*/}
      {/*    sx={{*/}
      {/*      display: { xs: 'block', sm: 'none' },*/}
      {/*      '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },*/}
      {/*    }}*/}
      {/*    anchor={'left'}*/}
      {/*    open={Boolean(anchorEl)}*/}
      {/*    onClose={handleCloseMenu}*/}
      {/*  >*/}
      {/*    <Box>*/}
      {/*      <Typography component={'h3'}>Menu</Typography>*/}
      {/*      <List>*/}
      {/*        {items.map(({ name, url, onClick }) => (*/}
      {/*          <ListItem key={name} onClick={handleCloseMenu} disablePadding>*/}
      {/*            <ListItemButton component={Link} href={url} onClick={onClick}>*/}
      {/*              <Typography textAlign="center">{name}</Typography>*/}
      {/*            </ListItemButton>*/}
      {/*          </ListItem>*/}
      {/*        ))}*/}
      {/*      </List>*/}
      {/*    </Box>*/}
      {/*  </Drawer>*/}
      {/*)}*/}
    </>
  );
};

export default HeaderMenu;
