import React, { useState } from 'react'; 
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { postLogin, postRegister } from '../services/authenticationApi';
import {
    Container, Box, TextField, Button, Typography, Paper,
    InputAdornment, Link, Grow, Fade, CircularProgress 
} from '@mui/material';
import { Person, Email, Lock, AppRegistration } from '@mui/icons-material';
import type { FormValues } from './login';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/authSlice';
import MuiDialog from '../models/MuiDialog'; 

export interface FormValuesRegister {
    name: string;
    email: string;
    password: string;
}

const Register: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValuesRegister>();
    const nav = useNavigate();
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState({ title: "", content: "" });

    const onSubmit = async (data: FormValuesRegister) => {
        setIsSubmitting(true);
        try {
            const response = await postRegister(data);

            if (response && response.id) {
                try {
                    const loginCredentials: FormValues = { email: data.email, password: data.password };
                    const resLogin = await postLogin(loginCredentials);
                    
                    if (resLogin && resLogin.token && resLogin.user) {
                        dispatch(setCredentials({
                            user: resLogin.user,
                            token: resLogin.token
                        }));
                        nav('/dashboard');
                    } else {
                        throw new Error("LOGIN_FAILED_AFTER_REGISTER");
                    }
                } catch (loginError) {
                     setDialogData({ 
                        title: "ההרשמה הצליחה", 
                        content: "החשבון נוצר בהצלחה, אך ההתחברות האוטומטית נכשלה. אנא התחבר ידנית." 
                    });
                    setDialogOpen(true);
                    setTimeout(() => nav('/'), 3000); 
                }
            } else {
                 throw new Error("REGISTRATION_FAILED");
            }

        } catch (error: any) {
            console.error("Registration error:", error);
            const errorMsg = error.response?.status === 409 
                ? "האימייל כבר קיים במערכת." 
                : "שגיאה ביצירת החשבון. אנא נסה שנית.";
            
            setDialogData({ title: "שגיאה בהרשמה", content: errorMsg });
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
                                <AppRegistration sx={{ fontSize: 55, color: '#38bdf8', mb: 1 }} />
                                <Typography variant="h4" fontWeight="800" sx={{ color: '#f8fafc', letterSpacing: '-1px' }}>
                                    יצירת חשבון
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>
                                    הצטרפו לצוות התמיכה הטכנולוגי
                                </Typography>
                            </Box>
                        </Fade>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                fullWidth
                                placeholder="שם מלא"
                                variant="filled"
                                margin="normal"
                                disabled={isSubmitting}
                                {...register("name", { required: "יש להזין שם מלא" })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                sx={{ bgcolor: 'rgba(15, 23, 42, 0.5)', borderRadius: 3, '& .MuiInputBase-root': { color: '#f8fafc' }, input: { textAlign: 'right' } }}
                                InputProps={{
                                    disableUnderline: true,
                                    startAdornment: <InputAdornment position="start"><Person sx={{ color: '#38bdf8' }} /></InputAdornment>,
                                }}
                            />

                            <TextField
                                fullWidth
                                placeholder="כתובת אימייל"
                                variant="filled"
                                margin="normal"
                                disabled={isSubmitting}
                                {...register("email", { required: "יש להזין אימייל" })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                sx={{ bgcolor: 'rgba(15, 23, 42, 0.5)', borderRadius: 3, '& .MuiInputBase-root': { color: '#f8fafc' }, input: { textAlign: 'right' } }}
                                InputProps={{
                                    disableUnderline: true,
                                    startAdornment: <InputAdornment position="start"><Email sx={{ color: '#38bdf8' }} /></InputAdornment>,
                                }}
                            />

                            <TextField
                                fullWidth
                                placeholder="סיסמה (6-16 תווים)"
                                type="password"
                                variant="filled"
                                margin="normal"
                                disabled={isSubmitting}
                                {...register("password", {
                                    required: "יש להזין סיסמה",
                                    pattern: { value: /^(?=.*[A-Za-z])(?=.*\d).{6,16}$/, message: "הסיסמה חייבת לכלול אותיות ומספרים" }
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                sx={{ bgcolor: 'rgba(15, 23, 42, 0.5)', borderRadius: 3, '& .MuiInputBase-root': { color: '#f8fafc' }, input: { textAlign: 'right' } }}
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
                                    background: 'linear-gradient(45deg, #0284c7, #38bdf8)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #38bdf8, #0284c7)',
                                        transform: 'translateY(-2px)'
                                    },
                                    '&:disabled': {
                                        background: 'rgba(56, 189, 248, 0.3)',
                                        color: 'rgba(255,255,255,0.5)'
                                    }
                                }}
                            >
                                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "צור חשבון חדש"}
                            </Button>
                        </form>

                        <Typography variant="body2" sx={{ mt: 2, color: '#94a3b8' }}>
                            כבר רשומים?{' '}
                            <Link
                                component="button"
                                onClick={() => nav('/')}
                                sx={{ color: '#38bdf8', fontWeight: 'bold', textDecoration: 'none' }}
                            >
                                חזרה להתחברות
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

export default Register;