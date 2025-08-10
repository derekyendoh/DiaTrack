
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login page
    navigate('/login');
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-diabetesSense-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Diabetes Sense</h1>
        <p className="text-xl text-gray-300">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
