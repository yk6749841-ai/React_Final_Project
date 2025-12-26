import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";

const CustomerView = () => {
    const navigate = useNavigate();
    return (
        <Button variant="contained" color="success" size="large" startIcon={<AddCircleOutline sx={{ ml: 1 }} />}
            onClick={() => navigate('tickets/new')}
            sx={{ fontWeight: 'bold', borderRadius: 3, background: 'linear-gradient(45deg, #059669, #10b981)' }}>
            פתיחת פניה חדשה
        </Button>
    );
};
export default CustomerView;