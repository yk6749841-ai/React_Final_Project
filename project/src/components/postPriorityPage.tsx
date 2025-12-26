import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { Box, TextField, Button, Typography, Paper, Stack, InputAdornment } from "@mui/material";
import { Save, Flag, LowPriority } from "@mui/icons-material";
import { addPriorityAsync } from "../features/prioritySlice";
import MuiDialog from "../models/MuiDialog";

const PostPriority = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [name, setName] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState({ title: "", content: "" });

    const handleAdd = async () => {
        if (name.trim()) {
            const newPriorityData = {
                name: name.trim()
            };

            try {
                await dispatch(addPriorityAsync(newPriorityData)).unwrap();
                setName("");
                setDialogData({ title: "הצלחה", content: "העדיפות נוספה בהצלחה!" });
                setDialogOpen(true);
            } catch (error) {
                console.error(error);
                setDialogData({ title: "שגיאה", content: "אירעה תקלה בשמירת העדיפות." });
                setDialogOpen(true);
            }
        }
    };

    return (
        <Box sx={{ maxWidth: 500, margin: "0 auto", direction: "rtl", p: 1 }}>
            <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 3, color: '#38bdf8' }}>
                <LowPriority fontSize="large" />
                <Typography variant="h5" fontWeight="bold" color="white">
                    הוספת רמת עדיפות
                </Typography>
            </Stack>

            <Paper elevation={0} sx={{
                p: 4,
                borderRadius: 4,
                bgcolor: 'rgba(30, 41, 59, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
            }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <TextField
                        label="שם העדיפות"
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="למשל: דחוף ביותר"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Flag sx={{ color: '#94a3b8' }} />
                                </InputAdornment>
                            ),
                            sx: {
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#38bdf8' },
                            }
                        }}
                        InputLabelProps={{
                            sx: { color: '#94a3b8', '&.Mui-focused': { color: '#38bdf8' } }
                        }}
                    />

                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleAdd}
                        disabled={!name.trim()}
                        startIcon={<Save sx={{ ml: 1 }} />}
                        sx={{
                            bgcolor: '#38bdf8',
                            color: '#0f172a',
                            fontWeight: 'bold',
                            py: 1.5,
                            borderRadius: 2,
                            fontSize: '1rem',
                            transition: 'all 0.3s',
                            '&:hover': {
                                bgcolor: '#0ea5e9',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(56, 189, 248, 0.4)'
                            },
                            '&.Mui-disabled': {
                                bgcolor: 'rgba(255,255,255,0.1)',
                                color: 'rgba(255,255,255,0.3)'
                            }
                        }}
                    >
                        שמור עדיפות במערכת
                    </Button>
                </Box>
            </Paper>

            <MuiDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                title={dialogData.title}
            >
                <Typography>{dialogData.content}</Typography>
            </MuiDialog>
        </Box>
    );
}

export default PostPriority;