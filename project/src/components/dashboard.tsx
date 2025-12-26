import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { useState } from "react";
import {
    Box, Container, Typography, Button, TextField, AppBar, Toolbar, Avatar, IconButton, Stack, Fade
} from "@mui/material";
import { Search, ListAlt, Logout, Dashboard as DashIcon } from "@mui/icons-material";
import CustomerView from "./customerView";
import AdminView from "./adminView";

const Dashboard = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
        }
    };

    return (
        <Box dir="rtl" sx={{
            minHeight: '100vh',
            background: 'radial-gradient(circle at top right, #1e293b, #0f172a)',
            color: '#fff'
        }}>
            <AppBar position="sticky" sx={{ bgcolor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(56, 189, 248, 0.2)', boxShadow: 'none' }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: '#0284c7', border: '2px solid #38bdf8' }}>{user?.name?.charAt(0)}</Avatar>
                        <Typography variant="h6" fontWeight="800">שלום, {user?.name}</Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <DashIcon sx={{ color: '#38bdf8' }} />
                        <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: 1 }}>
                            HELPDESK <Box component="span" sx={{ color: '#38bdf8' }}>AI</Box>
                        </Typography>
                    </Stack>

                    <IconButton onClick={() => navigate('/')} sx={{ color: '#f43f5e' }}>
                        <Logout />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ mt: 6, pb: 10 }}>
                <Fade in timeout={1000}>
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="h2" fontWeight="900" sx={{
                            background: 'linear-gradient(180deg, #fff 0%, #38bdf8 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1,
                            fontSize: { xs: '2.5rem', md: '4rem' }
                        }}>
                            מרכז ניהול לקוחות
                        </Typography>
                    </Box>
                </Fade>

                <Stack direction="column" spacing={4} alignItems="center" sx={{ mb: 8 }}>
                    <Box sx={{
                        display: 'flex', alignItems: 'center', bgcolor: 'rgba(15, 23, 42, 0.6)',
                        borderRadius: 4, border: '1px solid rgba(56, 189, 248, 0.2)',
                        pl: 2, pr: 1, py: 0.8, width: { xs: '100%', md: 600 },
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                    }}>
                        <Search sx={{ color: '#38bdf8', opacity: 0.7 }} />
                        <TextField
                            placeholder="חפש לפי נושא, תוכן או מספר פנייה..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            variant="standard"
                            fullWidth
                            sx={{ px: 2, '& .MuiInputBase-root': { color: '#fff' } }}
                            InputProps={{ disableUnderline: true }}
                        />
                        <Button
                            onClick={handleSearch}
                            variant="contained"
                            sx={{ borderRadius: 3, bgcolor: '#38bdf8', color: '#000', fontWeight: 'bold' }}
                        >
                            חפש
                        </Button>
                    </Box>

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <Button
                            variant="contained"
                            startIcon={<ListAlt sx={{ ml: 1 }} />}
                            onClick={() => navigate('tickets')}
                            sx={{ py: 1.5, px: 5, borderRadius: 3, fontWeight: 'bold', background: 'linear-gradient(45deg, #0284c7, #38bdf8)' }}
                        >
                            צפה בכל הפניות
                        </Button>
                    </Stack>

                    {user?.role === 'customer' && <CustomerView />}

                </Stack>

                <Box sx={{ mb: 10 }}>
                    {user?.role === 'admin' && <AdminView />}
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Outlet/>
                </Box>
            </Container>
        </Box>
    );
}

export default Dashboard;