import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../features/usersSlice";
import { fetchAllTickets, patchTicketAgent } from "../features/ticketsSlice";
import {
    Box, Typography, MenuItem, Select, Button, Paper,
    CircularProgress, FormControl, InputLabel, Divider, Grid
} from "@mui/material";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import type { AppDispatch, RootState } from "../store";
import MuiDialog from "../models/MuiDialog";

const AssignTicketToAgent = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { list: allUsers, loading: usersLoading } = useSelector((state: RootState) => state.users);
    const { list: allTickets, loading: ticketsLoading } = useSelector((state: RootState) => state.tickets);

    const [selectedTicketId, setSelectedTicketId] = useState<number | "">("");
    const [selectedAgentId, setSelectedAgentId] = useState<number | "">("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState({ title: "", content: "" });

    useEffect(() => {
        dispatch(getAllUsers());
        dispatch(fetchAllTickets());
    }, [dispatch]);

    const agents = allUsers.filter(u => u.role === 'agent' || u.role === 'admin');
    const sortedTickets = [...allTickets].sort((a, b) => (b.id || 0) - (a.id || 0));

    const handleAssign = async () => {
        if (selectedTicketId && selectedAgentId) {
            setIsSubmitting(true);
            try {
                await dispatch(patchTicketAgent({
                    id: Number(selectedTicketId),
                    assigned_to: Number(selectedAgentId)
                })).unwrap();

                setDialogData({
                    title: "הצלחה",
                    content: `פנייה מספר #${selectedTicketId} שויכה לסוכן בהצלחה.`
                });
                setDialogOpen(true);

                setSelectedTicketId("");
                setSelectedAgentId("");

            } catch (error) {
                console.error("Failed to assign agent to ticket:", error);
                setDialogData({
                    title: "שגיאה",
                    content: "אירעה שגיאה בזמן ניסיון השיוך. אנא נסה שנית."
                });
                setDialogOpen(true);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const isLoading = usersLoading || ticketsLoading;

    return (
        <Paper
            elevation={6}
            sx={{
                p: 4, mt: 4, mx: 'auto', maxWidth: 600,
                backgroundColor: '#1e2227', color: 'white',
                direction: 'rtl', borderRadius: 3,
                border: '1px solid #30363d'
            }}
        >
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#58a6ff' }}>
                ניהול פניות - שיוך לסוכן
            </Typography>
            <Typography variant="body2" sx={{ color: '#8b949e', mb: 3 }}>
                בחר פנייה ספציפית מהרשימה והעבר את הטיפול בה לסוכן או מנהל.
            </Typography>

            <Divider sx={{ mb: 4, bgcolor: '#30363d' }} />

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    <CircularProgress sx={{ color: '#58a6ff' }} />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    <Grid size={12}>
                        <FormControl fullWidth variant="filled" sx={{ bgcolor: '#ffffff10', borderRadius: 1 }}>
                            <InputLabel sx={{ color: '#8b949e' }}>1. בחר פנייה (Ticket)</InputLabel>
                            <Select
                                value={selectedTicketId}
                                onChange={(e) => setSelectedTicketId(Number(e.target.value))}
                                sx={{ color: 'white', '.MuiSvgIcon-root': { color: '#8b949e' } }}
                            >
                                {sortedTickets.map(ticket => (
                                    <MenuItem key={ticket.id} value={ticket.id}>
                                        #{ticket.id} : {ticket.subject} (סטטוס: {ticket.status_name})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={12}>
                        <FormControl fullWidth variant="filled" sx={{ bgcolor: '#ffffff10', borderRadius: 1 }}>
                            <InputLabel sx={{ color: '#8b949e' }}>2. בחר סוכן מטפל</InputLabel>
                            <Select
                                value={selectedAgentId}
                                onChange={(e) => setSelectedAgentId(Number(e.target.value))}
                                sx={{ color: 'white', '.MuiSvgIcon-root': { color: '#8b949e' } }}
                            >
                                {agents.map(a => (
                                    <MenuItem key={a.id} value={a.id}>{a.name} ({a.email})</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={12} sx={{ mt: 2 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <AssignmentIndIcon />}
                            onClick={handleAssign}
                            disabled={!selectedTicketId || !selectedAgentId || isSubmitting}
                            sx={{
                                py: 1.5, fontWeight: 'bold', fontSize: '1.1rem',
                                textTransform: 'none', borderRadius: 2,
                                backgroundColor: '#238636',
                                '&:hover': { backgroundColor: '#2ea043' },
                                '&:disabled': { backgroundColor: '#23863650', color: '#ffffff50' }
                            }}
                        >
                            {isSubmitting ? "מבצע שיוך..." : "שייך סוכן לפנייה"}
                        </Button>
                    </Grid>
                </Grid>
            )}

            <MuiDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                title={dialogData.title}
            >
                <Typography>{dialogData.content}</Typography>
            </MuiDialog>
        </Paper>
    );
}

export default AssignTicketToAgent;