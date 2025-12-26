import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { postTicketAsync } from "../features/ticketsSlice";
import { 
    Box, Container, Typography, TextField, Button, Paper, 
    Stack, Fade, InputAdornment, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import { AddCircle, Subject, Description, Send, ErrorOutline, CheckCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const NewTicketPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handlePostTicket = async () => {
        if (!subject.trim() || !description.trim()) return;

        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            await dispatch(postTicketAsync({ subject, description })).unwrap();
            setShowSuccessDialog(true);
        } catch (error: any) {
            console.error("Failed to post ticket:", error);
            setErrorMessage(error.message || "אירעה שגיאה בלתי צפויה בשליחת הפניה. אנא נסה שנית או פנה לתמיכה.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseSuccess = () => {
        setShowSuccessDialog(false);
        navigate('/dashboard/tickets');
        setSubject("");
        setDescription("");
    };

    const handleCloseError = () => {
        setErrorMessage(null);
    };

    return (
        <Fade in timeout={800}>
            <Container maxWidth="sm">
                <Box dir="rtl" sx={{ mt: 4 }}>
                    <Paper elevation={0} sx={{ 
                        p: 5, 
                        borderRadius: 8, 
                        bgcolor: 'rgba(30, 41, 59, 0.4)', 
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                            <AddCircle sx={{ color: '#38bdf8', fontSize: 35 }} />
                            <Box>
                                <Typography variant="h4" fontWeight="900" sx={{ color: '#fff' }}>
                                    פתיחת פניה חדשה
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                    מלא את הפרטים ונציגנו יחזרו אליך בהקדם
                                </Typography>
                            </Box>
                        </Stack>

                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                label="נושא הפניה"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                disabled={isSubmitting}
                                variant="filled"
                                sx={{ 
                                    bgcolor: 'rgba(15, 23, 42, 0.5)', 
                                    borderRadius: 3,
                                    '& .MuiInputBase-root': { color: '#fff' },
                                    '& .MuiInputLabel-root': { color: '#94a3b8' }
                                }}
                                InputProps={{
                                    disableUnderline: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Subject sx={{ color: '#38bdf8' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                label="תיאור הבעיה"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isSubmitting}
                                multiline
                                rows={5}
                                variant="filled"
                                sx={{ 
                                    bgcolor: 'rgba(15, 23, 42, 0.5)', 
                                    borderRadius: 3,
                                    '& .MuiInputBase-root': { color: '#fff' },
                                    '& .MuiInputLabel-root': { color: '#94a3b8' }
                                }}
                                InputProps={{
                                    disableUnderline: true,
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                                            <Description sx={{ color: '#38bdf8' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button 
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={handlePostTicket}
                                disabled={!subject.trim() || !description.trim() || isSubmitting}
                                endIcon={isSubmitting ? null : <Send sx={{ transform: 'rotate(180deg)', ml: 1 }} />}
                                sx={{ 
                                    py: 2, 
                                    borderRadius: 4, 
                                    fontWeight: '800',
                                    fontSize: '1.1rem',
                                    background: 'linear-gradient(45deg, #0284c7, #38bdf8)',
                                    boxShadow: '0 10px 20px rgba(2, 132, 199, 0.3)',
                                    transition: '0.3s',
                                    '&:hover': { 
                                        background: 'linear-gradient(45deg, #38bdf8, #0284c7)',
                                        transform: 'translateY(-3px)'
                                    },
                                    '&:disabled': {
                                        bgcolor: 'rgba(255,255,255,0.05)',
                                        color: 'rgba(255,255,255,0.3)'
                                    }
                                }}
                            >
                                {isSubmitting ? (
                                    <CircularProgress size={24} sx={{ color: '#fff' }} />
                                ) : (
                                    "שלח פניה למוקד"
                                )}
                            </Button>
                        </Stack>
                    </Paper>

                    <Dialog
                        open={showSuccessDialog}
                        onClose={handleCloseSuccess}
                        aria-labelledby="success-dialog-title"
                        PaperProps={{
                            sx: {
                                bgcolor: '#1e293b',
                                color: '#fff',
                                borderRadius: 3,
                                minWidth: '300px',
                                textAlign: 'center',
                                border: '1px solid #4ade80'
                            }
                        }}
                    >
                        <DialogTitle id="success-dialog-title" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <CheckCircle sx={{ fontSize: 60, color: '#4ade80' }} />
                            הפניה נפתחה בהצלחה!
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText sx={{ color: '#cbd5e1', textAlign: 'center' }}>
                                קיבלנו את הפניה שלך והיא הועברה לטיפול הצוות המקצועי.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                            <Button 
                                onClick={handleCloseSuccess} 
                                variant="contained" 
                                sx={{ 
                                    bgcolor: '#4ade80', 
                                    color: '#064e3b',
                                    fontWeight: 'bold',
                                    borderRadius: 2, 
                                    px: 4,
                                    '&:hover': { bgcolor: '#22c55e' }
                                }}
                            >
                                אישור
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={!!errorMessage}
                        onClose={handleCloseError}
                        aria-labelledby="error-dialog-title"
                        PaperProps={{
                            sx: {
                                bgcolor: '#1e293b',
                                color: '#fff',
                                borderRadius: 3,
                                minWidth: '300px',
                                textAlign: 'center',
                                border: '1px solid #ef4444'
                            }
                        }}
                    >
                        <DialogTitle id="error-dialog-title" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <ErrorOutline sx={{ fontSize: 60, color: '#ef4444' }} />
                            שגיאה בשליחה
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText sx={{ color: '#cbd5e1', textAlign: 'center' }}>
                                {errorMessage}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                            <Button 
                                onClick={handleCloseError} 
                                variant="outlined" 
                                color="error"
                                sx={{ borderRadius: 2, px: 4 }}
                            >
                                סגור
                            </Button>
                        </DialogActions>
                    </Dialog>

                </Box>
            </Container>
        </Fade>
    );
}

export default NewTicketPage;