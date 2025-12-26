import { useState } from "react";
import { postStatus } from "../services/statuses";
import { 
    Box, TextField, Button, Typography, Paper, 
    CircularProgress, InputAdornment 
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LabelIcon from '@mui/icons-material/Label';
import MuiDialog from "../models/MuiDialog"; 

const AddStatus = () => {
    const [name, setName] = useState<string>(""); 
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState({ title: "", content: "" });

    const handleAdd = async () => {
        if (name.trim()) {
            setIsSubmitting(true);
            try {
                await postStatus(name);            
                setName(""); 

                setDialogData({ title: "הצלחה", content: "הסטטוס נוסף בהצלחה למערכת!" });
                setDialogOpen(true);

            } catch (error) {
                console.error("שגיאה בהוספת סטטוס:", error);
                setDialogData({ title: "שגיאה", content: "שגיאה בהוספת הסטטוס, ייתכן שהשם כבר קיים במערכת." });
                setDialogOpen(true);
            } finally {
                setIsSubmitting(false);
            }
        }
    }

    return ( 
        <Paper 
            elevation={4} 
            sx={{ 
                p: 3, mt: 3, maxWidth: 400, mx: 'auto',
                backgroundColor: '#1e2227', color: 'white', 
                direction: 'rtl', borderRadius: 2,
                border: '1px solid #30363d'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                <AddCircleOutlineIcon sx={{ color: '#58a6ff' }} />
                <Typography variant="h6" fontWeight="600">
                    הוספת סטטוס פנייה
                </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: '#8b949e', mb: 2 }}>
                הגדר סטטוס חדש לניהול שלבי הטיפול במערכת.
            </Typography>
            
            <TextField 
                fullWidth
                variant="filled"
                label="שם הסטטוס"
                placeholder="למשל: בטיפול, הושלם..."
                value={name} 
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting} 
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <LabelIcon sx={{ color: '#8b949e', fontSize: 20 }} />
                        </InputAdornment>
                    ),
                    disableUnderline: true,
                }}
                sx={{ 
                    bgcolor: '#ffffff10', 
                    borderRadius: 1,
                    '& .MuiInputBase-root': { color: 'white' },
                    '& .MuiInputLabel-root': { color: '#8b949e' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#58a6ff' },
                    mb: 3
                }}
            />

            <Button 
                fullWidth
                variant="contained"
                onClick={handleAdd} 
                disabled={!name.trim() || isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{ 
                    py: 1.2,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    backgroundColor: '#238636',
                    '&:hover': { backgroundColor: '#2ea043' },
                    '&:disabled': { backgroundColor: '#23863650', color: '#ffffff50' }
                }}
            >
                {isSubmitting ? "שומר..." : "הוסף סטטוס חדש"}
            </Button>

            <MuiDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                title={dialogData.title}
            >
                <Typography>{dialogData.content}</Typography>
            </MuiDialog>

        </Paper>
    );
}

export default AddStatus;
