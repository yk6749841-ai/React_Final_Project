import React, { useState } from 'react'; 
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { postLogin } from '../services/authenticationApi';
import { setCredentials } from '../features/authSlice';
import { useDispatch } from 'react-redux';
import {
    Container, Box, TextField, Button, Typography, Paper,
    InputAdornment, Link, Grow, Fade, CircularProgress 
} from '@mui/material';
import { Email, Lock, Security } from '@mui/icons-material';
import MuiDialog from '../models/MuiDialog'; 

export interface FormValues {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
    const nav = useNavigate();
    const dispatch = useDispatch();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState({ title: "", content: "" });

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true); 
        try {
            const response = await postLogin(data);
            if (response && response.token) {
                dispatch(setCredentials({ user: response.user, token: response.token }));
                nav('/dashboard');
            } else {
                throw new Error("פרטי התחברות שגויים");
            }
        } catch (error) {
            console.error(error);
            setDialogData({ 
                title: "שגיאה בהתחברות", 
                content: "אימייל או סיסמה שגויים, אנא נסה שנית." 
            });
            setDialogOpen(true);
        } finally {
            setIsSubmitting(false); 
        }
    };

    return (
        <Box dir="rtl" sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            background: 'radial-gradient(circle at top right, #1e293b, #0f172a)',
            px: 2
        }}>
            <Container maxWidth="xs">
                <Grow in={true} timeout={1000}>
                    <Paper elevation={0} sx={{
                        p: 5,
                        borderRadius: 6,
                        bgcolor: 'rgba(30, 41, 59, 0.7)',
                        backdropFilter: 'blur(15px)',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        textAlign: 'center',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
                    }}>
                        <Fade in={true} timeout={1500}>
                            <Box sx={{ mb: 4 }}>
                                <Security sx={{ fontSize: 55, color: '#38bdf8', mb: 1 }} />
                                <Typography variant="h4" fontWeight="800" sx={{ color: '#f8fafc', letterSpacing: '-1px' }}>
                                    ברוכים הבאים
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>
                                    התחברו למסוף השירות המאובטח
                                </Typography>
                            </Box>
                        </Fade>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                fullWidth
                                placeholder="כתובת אימייל"
                                variant="filled"
                                margin="normal"
                                disabled={isSubmitting} 
                                {...register("email", {
                                    required: "יש להזין אימייל",
                                    pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "כתובת אימייל לא תקינה" }
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                sx={{
                                    bgcolor: 'rgba(15, 23, 42, 0.5)',
                                    borderRadius: 3,
                                    '& .MuiInputBase-root': { color: '#f8fafc' },
                                    input: { textAlign: 'right' }
                                }}
                                InputProps={{
                                    disableUnderline: true,
                                    startAdornment: <InputAdornment position="start"><Email sx={{ color: '#38bdf8' }} /></InputAdornment>,
                                }}
                            />

                            <TextField
                                fullWidth
                                placeholder="סיסמה"
                                type="password"
                                variant="filled"
                                margin="normal"
                                disabled={isSubmitting} // --- שינוי: נעילת שדה בזמן טעינה
                                {...register("password", { required: "יש להזין סיסמה" })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                sx={{
                                    bgcolor: 'rgba(15, 23, 42, 0.5)',
                                    borderRadius: 3,
                                    '& .MuiInputBase-root': { color: '#f8fafc' },
                                    input: { textAlign: 'right' }
                                }}
                                InputProps={{
                                    disableUnderline: true,
                                    startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#38bdf8' }} /></InputAdornment>,
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={isSubmitting} 
                                sx={{
                                    mt: 4, mb: 2, py: 1.8,
                                    borderRadius: 3,
                                    fontWeight: '800',
                                    fontSize: '1.1rem',
                                    background: 'linear-gradient(45deg, #0284c7, #38bdf8)',
                                    transition: '0.3s',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #38bdf8, #0284c7)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 20px rgba(56, 189, 248, 0.4)'
                                    },
                                    '&:disabled': { // עיצוב מצב לא פעיל
                                        background: 'rgba(56, 189, 248, 0.3)',
                                        color: 'rgba(255,255,255,0.5)'
                                    }
                                }}
                            >
                                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "כניסה למערכת"}
                            </Button>
                        </form>

                        <Typography variant="body2" sx={{ mt: 2, color: '#94a3b8' }}>
                            משתמש חדש?{' '}
                            <Link
                                component="button"
                                onClick={() => nav('/register')}
                                sx={{ color: '#38bdf8', fontWeight: 'bold', textDecoration: 'none', '&:hover': { color: '#7dd3fc' } }}
                            >
                                צרו חשבון כאן
                            </Link>
                        </Typography>
                    </Paper>
                </Grow>
            </Container>

            <MuiDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                title={dialogData.title}
            >
                <Typography>{dialogData.content}</Typography>
            </MuiDialog>
        </Box>
    );
};

export default Login;