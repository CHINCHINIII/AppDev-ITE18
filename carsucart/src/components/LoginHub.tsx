import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginHub() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to unified login page
    navigate('/login', { replace: true });
  }, [navigate]);

  return null;
}
