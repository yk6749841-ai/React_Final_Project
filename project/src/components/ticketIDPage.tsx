import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { fetchTicketByID } from "../features/ticketsSlice";
import { 
    Box, Paper, Typography, Button, Divider, 
    Stack, Chip, Fade, Container 
} from "@mui/material";
import { 
    ArrowBack, ConfirmationNumber, Description, 
    QuestionAnswer, AddComment 
} from "@mui/icons-material";
import GetTheComments from "./getCommentsPage";
import PostThecomment from "./postCommentsPage";


const TicketIDPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { list: tickets } = useSelector((state: RootState) => state.tickets);
    
    const [isReplyOpen, setIsReplyOpen] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchTicketByID(Number(id)));
        }
    }, [id, dispatch]);

    const ticket = tickets.find(t => t.id === Number(id));

    if (!ticket) return (
        <Typography sx={{ color: '#94a3b8', textAlign: 'center', mt: 10 }}>
            מחפש פנייה במערכת...
        </Typography>
    );

    return (
        <Fade in timeout={800}>
            <Container maxWidth="md">
                {/* כפתור חזרה חכם */}
                <Button 
                    startIcon={<ArrowBack sx={{ ml: 1 }} />} 
                    onClick={() => navigate('/dashboard/tickets')}
                    sx={{ color: '#94a3b8', mb: 2, '&:hover': { color: '#38bdf8' } }}
                >
                    חזרה לרשימה
                </Button>

                <Paper elevation={0} sx={{ 
                    p: { xs: 3, md: 5 }, 
                    borderRadius: 8, 
                    bgcolor: 'rgba(30, 41, 59, 0.4)', 
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}>
                    {/* כותרת הכרטיס */}
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
                        <Box>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                <ConfirmationNumber sx={{ color: '#38bdf8', fontSize: 20 }} />
                                <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 'bold', letterSpacing: 1 }}>
                                    CASE ID #{ticket.id}
                                </Typography>
                            </Stack>
                            <Typography variant="h4" fontWeight="900" sx={{ color: '#fff' }}>
                                {ticket.subject}
                            </Typography>
                        </Box>
                        <Chip 
                            label={ticket.status_name || "חדש"} 
                            color="primary" 
                            variant="outlined" 
                            sx={{ borderRadius: 2, fontWeight: 'bold', border: '2px solid' }} 
                        />
                    </Stack>

                    {/* תוכן הפניה */}
                    <Box sx={{ mb: 6 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                            <Description sx={{ color: '#94a3b8', fontSize: 18 }} />
                            <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>תיאור המקרה:</Typography>
                        </Stack>
                        <Typography variant="body1" sx={{ color: '#cbd5e1', lineHeight: 1.8, bgcolor: 'rgba(15, 23, 42, 0.3)', p: 3, borderRadius: 4 }}>
                            {ticket.description}
                        </Typography>
                    </Box>

                    <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', my: 4 }} />

                    {/* אזור הצאט (הצגת תגובות) */}
                    <Box sx={{ mb: 4 }}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                            <QuestionAnswer sx={{ color: '#38bdf8' }} />
                            <Typography variant="h6" fontWeight="800" sx={{ color: '#fff' }}>שיחה ותגובות</Typography>
                        </Stack>
                        
                        <GetTheComments />
                    </Box>

                    {/* כפתור הוספת תגובה מעוצב */}
                    {!isReplyOpen ? (
                        <Button 
                            fullWidth
                            variant="outlined"
                            startIcon={<AddComment sx={{ ml: 1 }} />}
                            onClick={() => setIsReplyOpen(true)}
                            sx={{ 
                                py: 2, borderRadius: 4, color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)',
                                '&:hover': { borderColor: '#38bdf8', bgcolor: 'rgba(56, 189, 248, 0.05)' }
                            }}
                        >
                            שלח תגובה חדשה
                        </Button>
                    ) : (
                        <Box>
                            <PostThecomment />
                            <Button 
                                size="small" 
                                onClick={() => setIsReplyOpen(false)}
                                sx={{ mt: 1, color: '#94a3b8' }}
                            >
                                ביטול
                            </Button>
                        </Box>
                    )}
                </Paper>
            </Container>
        </Fade>
    );
};

export default TicketIDPage;