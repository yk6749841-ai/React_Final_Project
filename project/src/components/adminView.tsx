import { useState } from "react";
import { Box, Button, Stack, Typography, Paper, Grid, Fade, IconButton } from "@mui/material";
import {
    People, PersonAdd, Badge, AssignmentInd,
    PlaylistAdd, Close, Construction, LowPriority
} from "@mui/icons-material";
import AddStatus from "./addStatus";
import AddAUser from "./addUser";
import AssignCustomerToAgent from "./assignTicketToAgent";
import Users from "./getUserComponent";
import UserID from "./userIdComponent";
import PostPriority from "./postPriorityPage";

const AdminView = () => {
    const [activeTool, setActiveTool] = useState<string | null>(null);

    const tools = [
        { id: 'users', label: 'ניהול משתמשים', icon: <People />, component: <Users /> },
        { id: 'search', label: 'איתור משתמש', icon: <Badge />, component: <UserID /> },
        { id: 'add', label: 'הוספת משתמש', icon: <PersonAdd />, component: <AddAUser /> },
        { id: 'assign', label: 'שיוך פניה לסוכן', icon: <AssignmentInd />, component: <AssignCustomerToAgent /> },
        { id: 'status', label: 'ניהול סטטוסים', icon: <PlaylistAdd />, component: <AddStatus /> },
        { id: 'priority', label: 'ניהול עדיפות', icon: <LowPriority />, component: <PostPriority /> }
    ];

    return (
        <Box sx={{ width: '100%', mt: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 4, justifyContent: 'center' }}>
                <Construction sx={{ color: '#38bdf8' }} />
                <Typography variant="h5" fontWeight="800" sx={{ color: '#f8fafc' }}>
                    ארגז כלי ניהול
                </Typography>
            </Stack>

            <Grid container spacing={2} justifyContent="center">
                {tools.map((tool) => (
                    <Grid key={tool.id} size={{ xs: 12, sm: 6, md: 2 }}>                        <Button
                        fullWidth
                        onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
                        sx={{
                            py: 3,
                            borderRadius: 4,
                            flexDirection: 'column',
                            gap: 1.5,
                            bgcolor: activeTool === tool.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(30, 41, 59, 0.4)',
                            border: '1px solid',
                            borderColor: activeTool === tool.id ? '#38bdf8' : 'rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(10px)',
                            color: activeTool === tool.id ? '#38bdf8' : '#94a3b8',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: 'rgba(56, 189, 248, 0.1)',
                                borderColor: '#38bdf8',
                                transform: 'translateY(-5px)',
                                color: '#fff'
                            }
                        }}
                    >
                        <Box sx={{ fontSize: 30 }}>{tool.icon}</Box>
                        <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '0.85rem' }}>
                            {tool.label}
                        </Typography>
                    </Button>
                    </Grid>
                ))}
            </Grid>

            {activeTool && (
                <Fade in={Boolean(activeTool)}>
                    <Paper elevation={0} sx={{
                        mt: 4, p: 4,
                        borderRadius: 6,
                        bgcolor: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        position: 'relative',
                        minHeight: '200px'
                    }}>
                        <IconButton
                            onClick={() => setActiveTool(null)}
                            sx={{ position: 'absolute', top: 15, left: 15, color: '#94a3b8', '&:hover': { color: '#f43f5e' } }}
                        >
                            <Close />
                        </IconButton>

                        <Box sx={{ color: '#fff' }}>
                            {tools.find(t => t.id === activeTool)?.component}
                        </Box>
                    </Paper>
                </Fade>
            )}
        </Box>
    );
}

export default AdminView;