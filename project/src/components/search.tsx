import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { fetchAllTickets } from "../features/ticketsSlice";
import { 
    Box, Paper, Typography, Button, Stack, Chip, Fade, Container, CircularProgress 
} from "@mui/material";
import { ArrowBack, ConfirmationNumber } from "@mui/icons-material";

const SearchPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || ""; 

    const { list: tickets, loading } = useSelector((state: RootState) => state.tickets);

    useEffect(() => {
        if (tickets.length === 0) {
            dispatch(fetchAllTickets());
        }
    }, [dispatch, tickets.length]);

    // פונקציית עזר להדגשת הטקסט שנמצא
    const highlightText = (text: string, highlight: string) => {
        if (!highlight.trim()) return text;
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) => 
                    part.toLowerCase() === highlight.toLowerCase() ? (
                        <Box component="span" key={i} sx={{ bgcolor: '#fbbf24', color: '#000', px: 0.5, borderRadius: '2px', fontWeight: 'bold' }}>
                            {part}
                        </Box>
                    ) : (
                        part
                    )
                )}
            </span>
        );
    };

    const filteredTickets = useMemo(() => {
        if (!query.trim()) return []; 
        const q = query.toLowerCase();
        return tickets.filter(t => 
            t.id?.toString().includes(q) || 
            t.subject?.toLowerCase().includes(q) || 
            t.description?.toLowerCase().includes(q)
        );
    }, [tickets, query]);

    return (
        <Fade in timeout={500}>
            <Container maxWidth="md">
                <Box dir="rtl" sx={{ mt: 2 }}>
                    <Button 
                        startIcon={<ArrowBack sx={{ ml: 1 }} />} 
                        onClick={() => navigate('/dashboard')}
                        sx={{ color: '#94a3b8', mb: 3 }}
                    >
                        חזרה לדשבורד
                    </Button>

                    <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff', mb: 4 }}>
                        תוצאות חיפוש עבור: <Box component="span" sx={{ color: '#38bdf8' }}>"{query}"</Box>
                    </Typography>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                            <CircularProgress sx={{ color: '#38bdf8' }} />
                        </Box>
                    ) : (
                        <Stack spacing={2}>
                            {filteredTickets.length > 0 ? (
                                filteredTickets.map((ticket) => (
                                    <Paper 
                                        key={ticket.id}
                                        onClick={() => navigate(`/dashboard/tickets/${ticket.id}`)}
                                        elevation={0} 
                                        sx={{ 
                                            p: 3, borderRadius: 4, cursor: 'pointer',
                                            bgcolor: 'rgba(30, 41, 59, 0.4)', 
                                            border: '1px solid rgba(56, 189, 248, 0.1)',
                                            transition: '0.2s',
                                            '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8' }
                                        }}
                                    >
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Box sx={{ width: '80%' }}>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <ConfirmationNumber sx={{ color: '#38bdf8', fontSize: 16 }} />
                                                    <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 'bold' }}>
                                                        #{highlightText(ticket.id?.toString() || "", query)}
                                                    </Typography>
                                                </Stack>
                                                <Typography variant="h6" sx={{ color: '#fff', mt: 0.5, fontWeight: 'bold' }}>
                                                    {highlightText(ticket.subject || "", query)}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                    {highlightText(ticket.description || "", query)}
                                                </Typography>
                                            </Box>
                                            <Chip label={ticket.status_name} size="small" variant="outlined" sx={{ color: '#38bdf8', borderColor: '#38bdf8', fontWeight: 'bold' }} />
                                        </Stack>
                                    </Paper>
                                ))
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 4 }}>
                                    <Typography sx={{ color: '#94a3b8' }}>
                                        לא נמצאו פניות התואמות לחיפוש "<b style={{color: '#fff'}}>{query}</b>"
                                    </Typography>
                                </Box>
                            )}
                        </Stack>
                    )}
                </Box>
            </Container>
        </Fade>
    );
};

export default SearchPage;