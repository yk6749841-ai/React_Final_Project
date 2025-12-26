import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteATicket, fetchAllTickets, updatePriority, resetTicketsState } from "../features/ticketsSlice";
import type { AppDispatch, RootState } from "../store";
import type { Ticket } from "../models/tickets";
import {
    Grid, Card, CardContent, Typography, Button, Box,
    Chip, Divider, Skeleton, Fade, Stack, Tooltip, IconButton,
    Menu, MenuItem, ListItemIcon
} from "@mui/material";
import {
    ConfirmationNumber, ArrowForwardIos, DeleteSweep,
    SettingsBackupRestore, Flag, PriorityHigh
} from "@mui/icons-material";
import { fetchAllPriorities } from "../features/prioritySlice";
import SortComponent from "./sort";

const TicketsListPage = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { list: tickets, loading } = useSelector((state: RootState) => state.tickets);
    const { list: priorities } = useSelector((state: RootState) => state.priorities);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

    // --- התיקון: משתנה שמונע הצגה לפני איפוס ---
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        dispatch(resetTicketsState());
        dispatch(fetchAllTickets());
        dispatch(fetchAllPriorities());
        setIsInitialized(true);
        return () => {
            dispatch(resetTicketsState());
        };
    }, [dispatch]);

    const handleDelete = (id: number) => {
        dispatch(deleteATicket(id));
    };

    const handlePriorityMenuOpen = (event: React.MouseEvent<HTMLElement>, ticketId: number) => {
        setAnchorEl(event.currentTarget);
        setSelectedTicketId(ticketId);
    };

    const handlePriorityMenuClose = () => {
        setAnchorEl(null);
        setSelectedTicketId(null);
    };

    const handlePriorityUpdate = async (priorityId: number) => {
        if (selectedTicketId) {
            await dispatch(updatePriority({ id: selectedTicketId, priority_id: priorityId })).unwrap();
            handlePriorityMenuClose();
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'סגור': return { color: 'error', label: 'סגור' };
            case 'בטיפול': return { color: 'warning', label: 'בטיפול' };
            default: return { color: 'success', label: status || 'חדש' };
        }
    };
    if (loading || !isInitialized) {
        return (
            <Grid container spacing={3} dir="rtl">
                {[1, 2, 3, 4].map((i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)' }} />
                    </Grid>
                ))}
            </Grid>
        );
    }

    return (
        <Box dir="rtl">
            <Typography variant="h5" fontWeight="800" sx={{ mb: 4, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 1 }}>
                <ConfirmationNumber sx={{ color: '#38bdf8' }} />
                רשימת פניות פעילות
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <SortComponent />
            </Box>
            {tickets.length === 0 ? (
                <Typography sx={{ color: '#94a3b8', textAlign: 'center', mt: 10 }}>אין פניות להצגה כרגע.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {tickets.map((ticket: Ticket, index) => {
                        const status = getStatusColor(ticket.status_name || "");
                        return (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={ticket.id}>
                                <Fade in timeout={500 + index * 100}>
                                    <Card sx={{
                                        height: '100%', display: 'flex', flexDirection: 'column',
                                        bgcolor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)',
                                        borderRadius: 5, border: '1px solid rgba(255, 255, 255, 0.1)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { transform: 'translateY(-8px)', border: '1px solid rgba(56, 189, 248, 0.4)', boxShadow: '0 15px 30px rgba(0,0,0,0.4)' }
                                    }}>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                                <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 'bold', bgcolor: 'rgba(56, 189, 248, 0.1)', px: 1.5, py: 0.5, borderRadius: 2 }}>
                                                    #{ticket.id}
                                                </Typography>

                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    {user?.role === 'admin' && (
                                                        <Tooltip title={`שינוי עדיפות (נוכחי: ${ticket.priority_name || 'רגיל'})`}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => handlePriorityMenuOpen(e, ticket.id!)}
                                                                sx={{ color: '#38bdf8', bgcolor: 'rgba(56, 189, 248, 0.1)' }}
                                                            >
                                                                <Flag fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}

                                                    {user?.role === 'admin' && (
                                                        <IconButton size="small" onClick={() => handleDelete(ticket.id!)} sx={{ color: '#f43f5e', bgcolor: 'rgba(244, 63, 94, 0.1)' }}>
                                                            <DeleteSweep fontSize="small" />
                                                        </IconButton>
                                                    )}

                                                    {(user?.role === 'admin' || user?.role === 'agent') && (
                                                        <IconButton size="small" onClick={() => navigate(`/dashboard/updateStatus/${ticket.id}`)} sx={{ color: '#fbbf24', bgcolor: 'rgba(251, 191, 36, 0.1)' }}>
                                                            <SettingsBackupRestore fontSize="small" />
                                                        </IconButton>
                                                    )}

                                                    <Chip label={status.label} color={status.color as any} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />
                                                </Stack>
                                            </Stack>

                                            <Typography variant="h6" fontWeight="800" sx={{ color: '#fff', mb: 1 }}>
                                                {ticket.subject}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                                                {ticket.description}
                                            </Typography>

                                            {(user?.role === 'admin' || user?.role === 'agent') && (
                                                <Typography variant="caption" sx={{ color: '#38bdf8', display: 'block' }}>
                                                    עדיפות: <strong>{ticket.priority_name || "לא הוגדרה"}</strong>
                                                </Typography>
                                            )}
                                        </CardContent>

                                        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                                        <Box sx={{ p: 2 }}>
                                            <Button
                                                fullWidth endIcon={<ArrowForwardIos sx={{ fontSize: 12, mr: 1 }} />}
                                                onClick={() => navigate(`/dashboard/tickets/${ticket.id}`)}
                                                sx={{ color: '#38bdf8', fontWeight: 'bold', justifyContent: 'space-between' }}
                                            >
                                                לפרטים והוספת תגובה
                                            </Button>
                                        </Box>
                                    </Card>
                                </Fade>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handlePriorityMenuClose}
                PaperProps={{ sx: { bgcolor: '#1e293b', color: '#fff', minWidth: 150 } }}
            >
                {priorities.map((priority) => (
                    <MenuItem key={priority.id} onClick={() => handlePriorityUpdate(priority.id)}>
                        <ListItemIcon><PriorityHigh sx={{ color: '#38bdf8' }} /></ListItemIcon>
                        {priority.name}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}

export default TicketsListPage;