import { useEffect } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../features/usersSlice";
import {
    Box, CircularProgress, Typography, Paper, 
    Avatar, Stack, Chip, IconButton, Tooltip, Fade
} from "@mui/material";
import { 
    Refresh, Person, Email, AdminPanelSettings, 
    Badge as BadgeIcon, ErrorOutline 
} from "@mui/icons-material";
import type { AppDispatch, RootState } from "../store";
import type { User } from "../models/user";

const Users = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { list, loading, error } = useSelector((state: RootState) => state.users);

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    const handleRefresh = () => {
        dispatch(getAllUsers());
    };

    const getRoleChip = (role: string) => {
        const isAdmin = role === 'admin' || role === 'agent';
        return (
            <Chip 
                label={role}
                size="small"
                icon={isAdmin ? <AdminPanelSettings /> : <Person />}
                sx={{ 
                    bgcolor: isAdmin ? 'rgba(56, 189, 248, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                    color: isAdmin ? '#38bdf8' : '#94a3b8',
                    fontWeight: 'bold',
                    border: '1px solid rgba(56, 189, 248, 0.2)'
                }}
            />
        );
    };

    return (
        <Fade in timeout={600}>
            <Box sx={{ dir: 'rtl' }}>
                {/* כותרת וכפתור רענון */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                    <Typography variant="h5" fontWeight="900" sx={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BadgeIcon sx={{ color: '#38bdf8' }} />
                        ניהול משתמשים במערכת
                    </Typography>
                    
                    <Tooltip title="רענון נתונים">
                        <IconButton 
                            onClick={handleRefresh} 
                            disabled={loading}
                            sx={{ color: '#38bdf8', bgcolor: 'rgba(56, 189, 248, 0.1)', '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.2)' } }}
                        >
                            <Refresh sx={{ animation: loading ? 'spin 2s linear infinite' : 'none' }} />
                        </IconButton>
                    </Tooltip>
                </Stack>

                {/* מצב טעינה */}
                {loading && (
                    <Stack alignItems="center" spacing={2} sx={{ py: 10 }}>
                        <CircularProgress thickness={5} size={50} sx={{ color: '#38bdf8' }} />
                        <Typography sx={{ color: '#94a3b8', fontWeight: 'bold' }}>סורק בסיס נתונים...</Typography>
                    </Stack>
                )}

                {/* מצב שגיאה */}
                {error && (
                    <Paper sx={{ p: 3, bgcolor: 'rgba(244, 63, 94, 0.1)', border: '1px solid #f43f5e', borderRadius: 4 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <ErrorOutline sx={{ color: '#f43f5e' }} />
                            <Typography color="#f43f5e" fontWeight="bold">שגיאה: {error}</Typography>
                        </Stack>
                    </Paper>
                )}

                {/* רשימת המשתמשים */}
                {!loading && list.length > 0 && (
                    <Stack spacing={2}>
                        {list.map((user: User) => (
                            <Paper 
                                key={user.id}
                                elevation={0}
                                sx={{ 
                                    p: 2.5, 
                                    borderRadius: 4, 
                                    bgcolor: 'rgba(30, 41, 59, 0.5)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    transition: 'all 0.2s',
                                    '&:hover': { 
                                        bgcolor: 'rgba(30, 41, 59, 0.8)',
                                        borderColor: 'rgba(56, 189, 248, 0.4)',
                                        transform: 'translateX(-5px)'
                                    }
                                }}
                            >
                                <Stack direction="row" alignItems="center" spacing={3}>
                                    {/* אוואטר עם צבע גראדיאנט */}
                                    <Avatar sx={{ 
                                        background: 'linear-gradient(45deg, #0284c7, #38bdf8)',
                                        fontWeight: 'bold',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                                    }}>
                                        {user.name?.charAt(0)}
                                    </Avatar>

                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" fontWeight="800" sx={{ color: '#fff', mb: 0.5 }}>
                                            {user.name}
                                        </Typography>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                <Email sx={{ fontSize: 16, color: '#94a3b8' }} />
                                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>{user.email}</Typography>
                                            </Stack>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.1)' }}>|</Typography>
                                            <Typography variant="caption" sx={{ color: '#64748b' }}>מזהה: #{user.id}</Typography>
                                        </Stack>
                                    </Box>

                                    {/* תצוגת תפקיד */}
                                    <Box>
                                        {getRoleChip(user.role || 'customer')}
                                    </Box>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                )}

                {/* מצב ריק */}
                {!loading && list.length === 0 && !error && (
                    <Stack alignItems="center" sx={{ py: 10 }}>
                        <Typography sx={{ color: '#64748b', fontStyle: 'italic' }}>מערכת המשתמשים ריקה.</Typography>
                    </Stack>
                )}
            </Box>
        </Fade>
    );
}

export default Users;