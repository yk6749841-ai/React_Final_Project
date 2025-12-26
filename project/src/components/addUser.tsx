import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { useState } from "react";
import { postAUser } from "../features/usersSlice";
import { 
    Box, TextField, Button, Typography, Paper, 
    Stack, MenuItem, FormControl, InputLabel, 
    Select, InputAdornment, Fade 
} from "@mui/material";
import { 
    PersonAdd, Person, Email, Lock, 
    Shield, CheckCircleOutline, 
    ArrowForward
} from "@mui/icons-material";

export interface AddAUserProps {
    name: string,
    email: string,
    password: string,
    role: "customer" | "agent" | "admin"
}

const AddAUser = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"customer" | "agent" | "admin">("customer");

    const [addedUser, setAddedUser] = useState<AddAUserProps | null>(null);
    const handleAddUser = () => {
        if (name.trim() && email.trim() && password.trim() && role.trim()) {
            const newUser: AddAUserProps = {
                name,
                email,
                password,
                role
            };
            dispatch(postAUser(newUser));
            setAddedUser(newUser);
            // איפוס שדות
            setName("");
            setEmail("");
            setPassword("");
            setRole("customer");
        }
    };

   return (
        <Fade in timeout={800}>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: 4, 
                        width: '100%', 
                        maxWidth: 450, 
                        bgcolor: 'rgba(15, 23, 42, 0.6)', 
                        borderRadius: 6, 
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                    }}
                >
                    {!addedUser ? (
                        /* --- מצב 1: הצגת הטופס (כאשר addedUser הוא null) --- */
                        <>
                            <Stack spacing={1} alignItems="center" sx={{ mb: 4 }}>
                                <Box sx={{ 
                                    p: 1.5, 
                                    borderRadius: '50%', 
                                    bgcolor: 'rgba(56, 189, 248, 0.1)', 
                                    display: 'flex', 
                                    mb: 1 
                                }}>
                                    <PersonAdd sx={{ color: '#38bdf8', fontSize: 32 }} />
                                </Box>
                                <Typography variant="h5" fontWeight="900" sx={{ color: '#fff' }}>
                                    הוספת משתמש חדש
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                    הזן את פרטי המשתמש כדי לצרפו למערכת
                                </Typography>
                            </Stack>

                            <Stack spacing={2.5}>
                                <TextField
                                    fullWidth
                                    label="שם מלא"
                                    variant="filled"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    sx={{ '& .MuiInputBase-root': { color: '#fff', borderRadius: 2 } }}
                                    InputProps={{
                                        disableUnderline: true,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person sx={{ color: '#38bdf8' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="כתובת אימייל"
                                    type="email"
                                    variant="filled"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    sx={{ '& .MuiInputBase-root': { color: '#fff', borderRadius: 2 } }}
                                    InputProps={{
                                        disableUnderline: true,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email sx={{ color: '#38bdf8' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="סיסמה ראשונית"
                                    type="password"
                                    variant="filled"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    sx={{ '& .MuiInputBase-root': { color: '#fff', borderRadius: 2 } }}
                                    InputProps={{
                                        disableUnderline: true,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock sx={{ color: '#38bdf8' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <FormControl fullWidth variant="filled">
                                    <InputLabel id="role-select-label" sx={{ color: '#94a3b8' }}>תפקיד במערכת</InputLabel>
                                    <Select
                                        labelId="role-select-label"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value as any)}
                                        disableUnderline
                                        sx={{ 
                                            color: '#fff', 
                                            borderRadius: 2,
                                            '& .MuiSelect-icon': { color: '#38bdf8' }
                                        }}
                                        startAdornment={
                                            <InputAdornment position="start" sx={{ mr: 1 }}>
                                                <Shield sx={{ color: '#38bdf8' }} />
                                            </InputAdornment>
                                        }
                                    >
                                        <MenuItem value="customer">לקוח (Customer)</MenuItem>
                                        <MenuItem value="agent">סוכן / מזכיר (Agent)</MenuItem>
                                        <MenuItem value="admin">מנהל מערכת (Admin)</MenuItem>
                                    </Select>
                                </FormControl>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    onClick={handleAddUser}
                                    startIcon={<CheckCircleOutline sx={{ ml: 1 }} />}
                                    sx={{
                                        py: 1.5,
                                        mt: 2,
                                        borderRadius: 3,
                                        fontWeight: '900',
                                        fontSize: '1rem',
                                        background: 'linear-gradient(45deg, #0284c7, #38bdf8)',
                                        boxShadow: '0 8px 20px rgba(2, 132, 199, 0.3)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #38bdf8, #0284c7)',
                                            transform: 'scale(1.02)',
                                            boxShadow: '0 10px 25px rgba(56, 189, 248, 0.4)'
                                        },
                                        transition: '0.3s'
                                    }}
                                >
                                    צור משתמש חדש
                                </Button>
                            </Stack>
                        </>
                    ) : (
                        /* --- מצב 2: תצוגת המשתמש החדש שנוסף --- */
                        <Fade in timeout={500}>
                            <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center', py: 2 }}>
                                <CheckCircleOutline sx={{ color: '#4ade80', fontSize: 60 }} />
                                <Box>
                                    <Typography variant="h5" fontWeight="900" sx={{ color: '#fff', mb: 1 }}>
                                        המשתמש נוסף בהצלחה!
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                                        להלן פרטי המשתמש החדש במערכת:
                                    </Typography>
                                </Box>

                                <Box sx={{ 
                                    width: '100%', 
                                    p: 3, 
                                    bgcolor: 'rgba(56, 189, 248, 0.05)', 
                                    borderRadius: 4,
                                    border: '1px dashed rgba(56, 189, 248, 0.3)'
                                }}>
                                    <Stack spacing={1.5} alignItems="flex-start">
                                        <Typography sx={{ color: '#fff' }}><strong>שם:</strong> {addedUser.name}</Typography>
                                        <Typography sx={{ color: '#fff' }}><strong>אימייל:</strong> {addedUser.email}</Typography>
                                        <Typography sx={{ color: '#fff' }}><strong>תפקיד:</strong> {addedUser.role}</Typography>
                                    </Stack>
                                </Box>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => setAddedUser(null)}
                                    startIcon={<ArrowForward sx={{ ml: 1 }} />}
                                    sx={{
                                        color: '#38bdf8',
                                        borderColor: '#38bdf8',
                                        borderRadius: 3,
                                        py: 1.2,
                                        '&:hover': {
                                            borderColor: '#0284c7',
                                            bgcolor: 'rgba(56, 189, 248, 0.1)'
                                        }
                                    }}
                                >
                                    הוסף משתמש נוסף
                                </Button>
                            </Stack>
                        </Fade>
                    )}
                </Paper>
            </Box>
        </Fade>
    );
};

export default AddAUser;