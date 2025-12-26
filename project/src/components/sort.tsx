import { useState } from "react";
import { useDispatch } from "react-redux";
import { Box, MenuItem, FormControl, Select, InputLabel, type SelectChangeEvent } from "@mui/material";
import SortIcon from '@mui/icons-material/Sort';
import { sortTickets } from "../features/ticketsSlice";

const SortComponent = () => {
    const dispatch = useDispatch();
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    const handleSortChange = (event: SelectChangeEvent) => {
        const value = event.target.value as 'newest' | 'oldest';
        setSortOrder(value);
        
        dispatch(sortTickets(value));
    };

    return (
        <Box sx={{ minWidth: 200 }}>
            <FormControl fullWidth size="small" variant="outlined">
                <InputLabel 
                    id="sort-select-label" 
                    sx={{ 
                        color: '#8b949e',
                        '&.Mui-focused': { color: '#38bdf8' } 
                    }}
                >
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SortIcon fontSize="small" /> מיון לפי
                    </Box>
                </InputLabel>
                
                <Select
                    labelId="sort-select-label"
                    id="sort-select"
                    value={sortOrder}
                    label="מיון לפי___" 
                    onChange={handleSortChange}
                    sx={{
                        color: 'white',
                        borderRadius: 2,
                        backgroundColor: 'rgba(30, 41, 59, 0.5)', 
                        '.MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(56, 189, 248, 0.3)', 
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#38bdf8', 
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#38bdf8',
                        },
                        '.MuiSvgIcon-root': {
                            color: '#38bdf8', 
                        }
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                backgroundColor: '#1e293b',
                                color: 'white',
                                border: '1px solid #30363d',
                                '& .MuiMenuItem-root': {
                                    '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.1)' },
                                    '&.Mui-selected': { backgroundColor: 'rgba(56, 189, 248, 0.2)' },
                                    '&.Mui-selected:hover': { backgroundColor: 'rgba(56, 189, 248, 0.3)' }
                                }
                            }
                        }
                    }}
                >
                    <MenuItem value="newest">תאריך יצירה (מהחדש לישן)</MenuItem>
                    <MenuItem value="oldest">תאריך יצירה (מהישן לחדש)</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default SortComponent;