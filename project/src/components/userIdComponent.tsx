import { useState } from "react";
import { useSelector } from "react-redux";
import { 
    Box, TextField, Typography, Paper, InputAdornment, 
    Stack, Avatar, Chip, Fade, Divider 
} from "@mui/material";
import { 
    Search, Email, Badge as BadgeIcon, 
    AdminPanelSettings, HelpOutline 
} from "@mui/icons-material";
import type { RootState } from "../store";
import type { User } from "../models/user";

const UserID = () => {
    const [searchTerm, setSearchTerm] = useState("");
    
    const { list } = useSelector((state: RootState) => state.users);

    const filteredUsers = list.filter((user: User) => {
        const term = searchTerm.toLowerCase();
        return (
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.id.toString().includes(term)
        );
    });

    return (
        <Box sx={{ dir: 'rtl' }}>
            {/* כותרת החלק */}
            <Typography variant="h5" fontWeight="800" sx={{ mb: 3, color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Search sx={{ color: '#38bdf8' }} />
                איתור משתמש במערכת
            </Typography>

            {/* בר החיפוש המעוצב */}
            <Paper elevation={0} sx={{ 
                p: 0.5, 
                bgcolor: 'rgba(15, 23, 42, 0.6)', 
                borderRadius: 4, 
                border: '1px solid rgba(56, 189, 248, 0.2)',
                mb: 4
            }}>
                <TextField
                    fullWidth
                    placeholder="חפש לפי שם, אימייל או מזהה..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    variant="standard"
                    sx={{ px: 2, py: 1, '& .MuiInputBase-root': { color: '#fff', fontSize: '1.1rem' } }}
                    InputProps={{
                        disableUnderline: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <BadgeIcon sx={{ color: '#38bdf8' }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            {/* הצגת התוצאות */}
            <Stack spacing={2}>
                {searchTerm === "" ? (
                    // הודעה כשאין חיפוש
                    <Box sx={{ textAlign: 'center', py: 5, color: '#64748b' }}>
                        <HelpOutline sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
                        <Typography>הקלד פרטי משתמש כדי להתחיל בחיפוש...</Typography>
                    </Box>
                ) : filteredUsers.length > 0 ? (
                    // הצגת המשתמשים שנמצאו
                    filteredUsers.map((user: User) => (
                        <Fade in key={user.id} timeout={400}>
                            <Paper sx={{ 
                                p: 3, 
                                borderRadius: 4, 
                                bgcolor: 'rgba(30, 41, 59, 0.5)', 
                                border: '1px solid rgba(56, 189, 248, 0.3)',
                                transition: '0.3s',
                                '&:hover': { bgcolor: 'rgba(30, 41, 59, 0.8)', transform: 'translateY(-3px)' }
                            }}>
                                <Stack direction="row" spacing={3} alignItems="center">
                                    <Avatar sx={{ 
                                        width: 60, height: 60, 
                                        background: 'linear-gradient(45deg, #0284c7, #38bdf8)',
                                        fontWeight: 'bold', fontSize: '1.5rem'
                                    }}>
                                        {user.name.charAt(0)}
                                    </Avatar>

                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" fontWeight="900" sx={{ color: '#fff' }}>{user.name}</Typography>
                                        
                                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                <Email sx={{ fontSize: 16, color: '#94a3b8' }} />
                                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>{user.email}</Typography>
                                            </Stack>
                                            <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                                            <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 'bold' }}>מזהה: #{user.id}</Typography>
                                        </Stack>
                                    </Box>

                                    <Chip 
                                        label={user.role} 
                                        icon={<AdminPanelSettings />} 
                                        sx={{ 
                                            bgcolor: 'rgba(56, 189, 248, 0.1)', 
                                            color: '#38bdf8', 
                                            fontWeight: 'bold',
                                            border: '1px solid rgba(56, 189, 248, 0.3)'
                                        }} 
                                    />
                                </Stack>
                            </Paper>
                        </Fade>
                    ))
                ) : (
                    // הודעה כשאין תוצאות
                    <Typography sx={{ textAlign: 'center', py: 5, color: '#f43f5e', fontWeight: 'bold' }}>
                        לא נמצא משתמש התואם לחיפוש "{searchTerm}"
                    </Typography>
                )}
            </Stack>
        </Box>
    );
};

export default UserID;