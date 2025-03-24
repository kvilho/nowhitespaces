import { Navigate } from 'react-router-dom';
import AuthService from '../services/authService';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const authService = AuthService.getInstance();
    
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute; 