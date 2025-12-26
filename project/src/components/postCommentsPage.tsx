import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { postAComment } from "../features/commentsSlice";
import { useParams } from "react-router-dom";
import { Box, TextField, Button, Paper } from "@mui/material";
import { Send } from "@mui/icons-material";

const PostThecomment = () => {
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const [content, setContent] = useState("");

    const handlePostComment = () => {
        if (id && content.trim()) {
            dispatch(postAComment({
                postId: Number(id),
                commentData: content
            })); 
            setContent(""); 
        }
    };

    return (
        <Box sx={{ mt: 5 }}>
            <Paper elevation={0} sx={{ 
                p: 2, 
                borderRadius: 4, 
                bgcolor: 'rgba(15, 23, 42, 0.6)', 
                border: '1px solid rgba(56, 189, 248, 0.3)',
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)'
            }}>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="כתוב תגובה חדשה..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    variant="standard"
                    sx={{ 
                        '& .MuiInputBase-root': { color: '#f8fafc', fontSize: '1rem' },
                        mb: 2,
                        p: 1
                    }}
                    InputProps={{
                        disableUnderline: true,
                    }}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                        variant="contained" 
                        onClick={handlePostComment}
                        disabled={!content.trim()}
                        endIcon={<Send sx={{ transform: 'rotate(180deg)', ml: 1 }} />}
                        sx={{ 
                            borderRadius: 3, 
                            px: 4, 
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #0284c7, #38bdf8)',
                            '&:disabled': { opacity: 0.5, bgcolor: 'rgba(255,255,255,0.1)' }
                        }}
                    >
                        שלח הודעה
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default PostThecomment;