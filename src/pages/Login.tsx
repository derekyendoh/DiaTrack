
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    if (!loading && currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, loading, navigate]);

  return (
    <div className="min-h-screen bg-diabetesSense-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-block relative">
            <div className="w-24 h-24 rounded-full bg-diabetesSense-background flex items-center justify-center mb-4 border-2 border-diabetesSense-accent/30">
              <span className="text-4xl font-bold text-diabetesSense-accent">Ds</span>
              <div className="absolute -inset-1 rounded-full border border-diabetesSense-accent/20 animate-pulse-slow"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-1 text-white">Diabetes Sense</h1>
          <p className="text-gray-400 text-sm mb-6">Monitor. Understand. Thrive.</p>
          <h2 className="text-xl font-medium text-white">Welcome Back</h2>
        </div>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-0">
            <LoginForm />
          </TabsContent>
          
          <TabsContent value="signup" className="mt-0">
            <SignupForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
