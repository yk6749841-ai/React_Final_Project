import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Box, Typography, Paper, CircularProgress, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Button, Chip 
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import type { AppDispatch, RootState } from "../store";
import { fetchAllPriorities } from "../features/prioritySlice";
import MuiDialog from "../models/MuiDialog";

const GetPriorityPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    const { list, loading, error } = useSelector((state: RootState) => state.priorities);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const getAllThePriorities = () => {
        dispatch(fetchAllPriorities()); 
    }

    useEffect(() => {
        getAllThePriorities();
    }, []);

    useEffect(() => {
        if (error) {
            setErrorMsg(error);
            setDialogOpen(true);
        }
    }, [error]);

    return (
        <Box sx={{ p: 4, direction: 'rtl', maxWidth: '900px', margin: '0 auto' }}>
            <Paper 
                elevation={6} 
                sx={{ 
                    p: 4, 
                    borderRadius: 3,
                    backgroundColor: '#1e2227',
                    color: 'white',
                    border: '1px solid #30363d'
                }}
            >
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#58a6ff' }}>
                        רשימת עדיפויות מערכת
                    </Typography>
                    
                    <Button 
                        variant="outlined" 
                        startIcon={<RefreshIcon />} 
                        onClick={getAllThePriorities}
                        disabled={loading}
                        sx={{
                            color: '#8b949e',
                            borderColor: '#30363d',
                            '&:hover': {
                                borderColor: '#58a6ff',
                                color: '#58a6ff',
                                backgroundColor: 'rgba(88, 166, 255, 0.1)'
                            }
                        }}
                    >
                        רענן נתונים
                    </Button>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                        <CircularProgress sx={{ color: '#58a6ff' }} />
                    </Box>
                ) : (
                    <TableContainer component={Box} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <Table sx={{ minWidth: 300 }}>
                            <TableHead sx={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                <TableRow>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', color: '#8b949e', borderBottom: '1px solid #30363d' }}>מזהה (ID)</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', color: '#8b949e', borderBottom: '1px solid #30363d' }}>שם העדיפות</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', color: '#8b949e', borderBottom: '1px solid #30363d' }}>סטטוס תצוגה</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {list.length > 0 ? (
                                    list.map((priority) => (
                                        <TableRow key={priority.id} hover sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.03) !important' } }}>
                                            <TableCell align="right" sx={{ color: 'white', borderBottom: '1px solid #30363d' }}>
                                                #{priority.id}
                                            </TableCell>
                                            <TableCell align="right" sx={{ borderBottom: '1px solid #30363d' }}>
                                                <Typography sx={{ fontWeight: 500, color: 'white' }}>
                                                    {priority.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right" sx={{ borderBottom: '1px solid #30363d' }}>
                                                <Chip 
                                                    label="פעיל" 
                                                    size="small" 
                                                    sx={{ 
                                                        backgroundColor: 'rgba(35, 134, 54, 0.2)', 
                                                        color: '#3fb950',
                                                        border: '1px solid rgba(35, 134, 54, 0.4)',
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center" sx={{ py: 5, color: '#8b949e', borderBottom: 'none' }}>
                                            לא נמצאו עדיפויות בבסיס הנתונים.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            <MuiDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                title="שגיאה בטעינת נתונים"
            >
                <Typography>{errorMsg}</Typography>
            </MuiDialog>

        </Box>
    );
}

export default GetPriorityPage;