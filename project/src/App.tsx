import { RouterProvider } from 'react-router-dom'
import router from './components/router' 
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react' 
import { getMe } from './services/authenticationApi'
import type { User } from './models/user'
import { setCredentials } from './features/authSlice'
import { CircularProgress, Box } from '@mui/material'

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
           const response = await getMe();
           if (response && response.id) {
             const user: User = { 
               id: response.id, 
               name: response.name, 
               email: response.email, 
               role: response.role 
             };
             
             dispatch(setCredentials({
               user: user,
               token: token
             }));
           }
        }
      } catch (error) {
        console.error("Failed to auto-login", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#0f172a' }}>
        <CircularProgress sx={{ color: '#38bdf8' }} />
      </Box>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App