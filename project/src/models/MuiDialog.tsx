import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface MuiDialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onConfirm?: () => void; 
    confirmText?: string;   
}

const MuiDialog: React.FC<MuiDialogProps> = ({ open, onClose, title, children, onConfirm, confirmText = "אישור" }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>ביטול</Button>
                {onConfirm && (
                    <Button onClick={onConfirm} variant="contained" color="primary">
                        {confirmText}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default MuiDialog;