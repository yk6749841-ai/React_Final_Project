import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { getCommentsId } from "../features/commentsSlice";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Comment } from "../models/comment";
import { 
    Box, Paper, Typography, Avatar, Fade, List, 
    CircularProgress 
} from "@mui/material";
import { Person } from "@mui/icons-material";

const GetTheComments = () => {
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { comments, loading } = useSelector((state: RootState) => state.comments);

    useEffect(() => {
        if (id) {
            dispatch(getCommentsId(Number(id)));
        }
    }, [id, dispatch]);

    return (
        <Box dir="rtl" sx={{ mt: 4, width: '100%' }}>
            <Typography variant="h6" fontWeight="800" sx={{ color: '#38bdf8', mb: 3 }}>
                היסטוריית שיחה
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                    <CircularProgress sx={{ color: '#38bdf8' }} />
                </Box>
            ) : (
                <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {comments.length > 0 ? (
                        comments.map((comment: Comment, index) => (
                            <Fade in key={comment.id} timeout={500 + index * 100}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'row', 
                                    alignItems: 'flex-start',
                                    gap: 2 
                                }}>
                                    <Avatar sx={{ 
                                        bgcolor: 'rgba(56, 189, 248, 0.2)', 
                                        border: '1px solid #38bdf8',
                                        width: 40, height: 40 
                                    }}>
                                        <Person sx={{ color: '#38bdf8' }} />
                                    </Avatar>

                                    <Paper elevation={0} sx={{ 
                                        p: 2, 
                                        borderRadius: '20px 0px 20px 20px', 
                                        bgcolor: 'rgba(30, 41, 59, 0.5)', 
                                        backdropFilter: 'blur(5px)',
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                        maxWidth: '80%',
                                        position: 'relative'
                                    }}>
                                        <Typography variant="subtitle2" sx={{ color: '#38bdf8', fontWeight: 'bold', mb: 0.5 }}>
                                            {comment.author_name}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#f8fafc', lineHeight: 1.6 }}>
                                            {comment.content}
                                        </Typography>
                                    </Paper>
                                </Box>
                            </Fade>
                        ))
                    ) : (
                        <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center' }}>
                            עדיין אין תגובות לפנייה זו.
                        </Typography>
                    )}
                </List>
            )}
        </Box>
    );
}
export default GetTheComments;