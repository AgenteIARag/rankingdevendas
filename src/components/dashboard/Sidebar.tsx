"use client";

import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, Box, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { usePathname, useRouter } from 'next/navigation';

const drawerWidth = 260;

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { text: 'Visão Geral', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Equipes', icon: <GroupsIcon />, path: '/dashboard/equipes' },
    { text: 'Vendedores', icon: <PersonIcon />, path: '/dashboard/vendedores' },
    { text: 'Metas & Prêmios', icon: <TrackChangesIcon />, path: '/dashboard/metas' },
    { text: 'Lançar Venda', icon: <AttachMoneyIcon />, path: '/dashboard/vendas' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Admin Vendas
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                selected={pathname === item.path}
                onClick={() => router.push(item.path)}
              >
                <ListItemIcon sx={{ color: pathname === item.path ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => router.push('/ranking')}>
              <ListItemIcon sx={{ color: 'warning.main' }}>
                <EmojiEventsIcon />
              </ListItemIcon>
              <ListItemText primary="Ver Ranking" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
