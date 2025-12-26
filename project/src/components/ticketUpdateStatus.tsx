import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import type { AppDispatch } from "../store";
import { updateStatus } from "../features/ticketsSlice";
import { getAllStatuses } from "../services/statuses";
import { 
    Box, Container, Paper, Typography, Button, 
    FormControl, InputLabel, Select, MenuItem, 
    Stack, Fade, Breadcrumbs, Link, CircularProgress 
} from "@mui/material";
import { 
    SettingsBackupRestore, CheckCircle, 
    ArrowBack, InfoOutlined 
} from "@mui/icons-material";

const UpdateStatusComponent = () => {
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();    
    
    const [newStatusId, setNewStatusId] = useState<number | "">("");
    const [statuses, setStatuses] = useState<{id: number, name: string}[]>([]); 
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const data = await getAllStatuses();
                setStatuses(data);
            } catch (error) {
                console.error("שגיאה בטעינת סטטוסים:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStatuses();
    }, []);

    const handleUpdateStatus = () => {
        if (id && newStatusId) {
            dispatch(updateStatus({ 
                id: Number(id), 
                status_id: Number(newStatusId) 
            }));            
            setNewStatusId("");
            navigate('/dashboard/tickets'); 
        } else {
            alert("אנא בחר סטטוס");
        }
    };

    return (
        <Fade in timeout={800}>
            <Container maxWidth="sm">
                <Box dir="rtl" sx={{ mt: 4 }}>
                    
                    <Breadcrumbs sx={{ color: '#94a3b8', mb: 2 }}>
                        <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard/tickets')} sx={{ cursor: 'pointer' }}>
                            פניות
                        </Link>
                        <Typography color="white">עדכון סטטוס #{id}</Typography>
                    </Breadcrumbs>

                    <Paper elevation={0} sx={{ 
                        p: { xs: 3, md: 5 }, 
                        borderRadius: 8, 
                        bgcolor: 'rgba(30, 41, 59, 0.4)', 
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(251, 191, 36, 0.3)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        
                        <Stack spacing={1} alignItems="center" sx={{ mb: 4, textAlign: 'center' }}>
                            <SettingsBackupRestore sx={{ color: '#fbbf24', fontSize: 40 }} />
                            <Typography variant="h4" fontWeight="900" sx={{ color: '#fff' }}>
                                שינוי סטטוס פנייה
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                                עדכון מצב נוכחי עבור פנייה מספר <b>{id}</b>
                            </Typography>
                        </Stack>

                        <Stack spacing={4}>
                            <Box sx={{ bgcolor: 'rgba(251, 191, 36, 0.05)', p: 2, borderRadius: 3, border: '1px dashed rgba(251, 191, 36, 0.2)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <InfoOutlined sx={{ color: '#fbbf24' }} />
                                <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                                    שים לב: שינוי סטטוס ישלח עדכון אוטומטי ללקוח.
                                </Typography>
                            </Box>

                            <FormControl fullWidth variant="filled" sx={{ 
                                bgcolor: 'rgba(15, 23, 42, 0.6)', 
                                borderRadius: 3,
                                '& .MuiInputBase-root': { color: '#fff', pt: 1 },
                                '& .MuiInputLabel-root': { color: '#fbbf24', fontWeight: 'bold' }
                            }}>
                                <InputLabel id="status-select-label">
                                    {loading ? 'טוען סטטוסים...' : 'בחר סטטוס חדש'}
                                </InputLabel>
                                <Select
                                    labelId="status-select-label"
                                    value={newStatusId}
                                    onChange={(e) => setNewStatusId(Number(e.target.value))}
                                    disableUnderline
                                    sx={{ borderRadius: 3 }}
                                    disabled={loading}
                                    IconComponent={() => loading ? <CircularProgress size={20} sx={{ mr: 2, color: '#fbbf24' }} /> : null}
                                >
                                    {/* מיפוי דינמי של הסטטוסים מהשרת */}
                                    {statuses.map((status) => (
                                        <MenuItem key={status.id} value={status.id}>
                                            {status.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Stack direction="row" spacing={2}>
                                <Button 
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    onClick={handleUpdateStatus}
                                    disabled={!newStatusId || loading}
                                    startIcon={<CheckCircle sx={{ ml: 1 }} />}
                                    sx={{ 
                                        py: 2, borderRadius: 4, fontWeight: '900',
                                        background: 'linear-gradient(45deg, #f59e0b, #fbbf24)',
                                        boxShadow: '0 10px 20px rgba(245, 158, 11, 0.2)',
                                        '&:hover': { background: 'linear-gradient(45deg, #fbbf24, #f59e0b)' }
                                    }}
                                >
                                    בצע עדכון
                                </Button>
                                
                                <Button 
                                    variant="outlined"
                                    size="large"
                                    onClick={() => navigate('/dashboard/tickets')}
                                    startIcon={<ArrowBack sx={{ ml: 1 }} />}
                                    sx={{ 
                                        py: 2, borderRadius: 4, color: '#94a3b8', 
                                        borderColor: '#475569', px: 4
                                    }}
                                >
                                    ביטול
                                </Button>
                            </Stack>
                        </Stack>
                    </Paper>
                </Box>
            </Container>
        </Fade>
    );
}

export default UpdateStatusComponent;