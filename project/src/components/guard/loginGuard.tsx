import { type FunctionComponent } from "react";
import { Navigate } from "react-router-dom";

interface LoginGuardProps {
   children: React.ReactNode;   
}

const LoginGuard: FunctionComponent<LoginGuardProps> = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return <Navigate to="/login"  replace/>;       
    }
    return ( <>{children}</> );
}
 
export default LoginGuard;