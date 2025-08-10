
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import RiskGauge from '@/components/dashboard/RiskGauge';
import ModelInterpretability from '@/components/dashboard/ModelInterpretability';
import RiskFactorDetail from '@/components/dashboard/RiskFactorDetail';
import MainNav from '@/components/navigation/MainNav';
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { Activity, LineChart, Heart, BarChart, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const [userName, setUserName] = useState('');
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [assessmentDate, setAssessmentDate] = useState<string | null>(null);
  const [hasAssessment, setHasAssessment] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data
    if (userProfile) {
      setUserName(userProfile.full_name || 'User');
    } else if (currentUser) {
      setUserName(currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User');
    }

    // Load last assessment if exists
    const lastAssessment = localStorage.getItem('lastAssessment');
    if (lastAssessment) {
      try {
        const { score, date } = JSON.parse(lastAssessment);
        setRiskScore(score);
        setAssessmentDate(date);
        setHasAssessment(true);
      } catch (error) {
        console.error("Error parsing assessment data:", error);
      }
    }
    
    setLoading(false);
  }, [currentUser]);

  // Daily health tip
  const healthTips = [
    "Stay hydrated! Aim for 8 glasses of water daily 🚰",
    "A short walk after meals can help regulate blood sugar 🚶",
    "Add more fiber to your diet for better glucose control 🥗",
    "Regular sleep patterns help maintain healthy glucose levels 😴",
    "Stress management is key to controlling diabetes risk 🧘",
    "Local vegetables like kontomire (cocoyam leaves) are high in nutrients and low in calories 🌿",
    "Replacing palm oil with olive oil can help improve cholesterol levels 🌱",
    "Choose brown rice over white rice for better blood sugar control 🍚",
    "Replace sugary drinks with water infused with local fruits like watermelon 🍉"
  ];
  
  const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];

  // Define feature contributions for the model interpretability
  const featureContributions = [
    {
      name: "HbA1c Level",
      contribution: 35.2,
      description: "Your glycated hemoglobin is above the recommended range.",
      color: "bg-diabetesSense-high"
    },
    {
      name: "Blood Glucose",
      contribution: 24.8,
      description: "Your fasting blood glucose is elevated.",
      color: "bg-diabetesSense-moderate"
    },
    {
      name: "BMI",
      contribution: 18.5,
      description: "Your body mass index is in the overweight range.",
      color: "bg-diabetesSense-moderate"
    },
    {
      name: "Age",
      contribution: 10.3,
      description: "Your age group has an increased risk factor.",
      color: "bg-diabetesSense-low"
    },
    {
      name: "Physical Activity",
      contribution: -12.6,
      description: "Your regular exercise habits are reducing your risk.",
      color: "bg-diabetesSense-low"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-diabetesSense-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block relative">
            <div className="w-24 h-24 rounded-full bg-diabetesSense-background flex items-center justify-center mb-4 border-2 border-diabetesSense-accent/30">
              <span className="text-4xl font-bold text-diabetesSense-accent">Ds</span>
              <div className="absolute -inset-1 rounded-full border border-diabetesSense-accent/20 animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-diabetesSense-background flex flex-col">
      <MainNav />
      
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <header className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold text-white">
            Welcome, <span className="text-diabetesSense-accent">{userName}</span>
          </h1>
          <p className="text-gray-400">Track and manage your diabetes risk</p>
        </header>
        
        {hasAssessment ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="card-gradient border border-white/10 animate-fade-in">
                <CardHeader className="pb-2">
                  <CardTitle>Current Risk Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <RiskGauge score={riskScore || 0} />
                    {assessmentDate && (
                      <p className="mt-4 text-sm text-gray-400">Last updated: {assessmentDate}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex flex-col space-y-4">
                <Card className="card-gradient border border-white/10 flex-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-diabetesSense-accent" />
                      Health Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-between h-[calc(100%-4rem)]">
                    <div>
                      <p className="text-gray-300 mb-4">
                        Based on your last assessment, here are the key areas to focus on:
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <span className="text-diabetesSense-moderate mr-2">•</span>
                          <span className="text-gray-300">Monitor your blood glucose regularly</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-diabetesSense-low mr-2">•</span>
                          <span className="text-gray-300">Maintain a balanced diet rich in fiber</span>
                        </li>
                      </ul>
                    </div>
                    <Button 
                      onClick={() => navigate('/recommendations')}
                      variant="outline" 
                      className="mt-4 w-full bg-diabetesSense-accent/10 text-diabetesSense-accent border-diabetesSense-accent/20 hover:bg-diabetesSense-accent/20"
                    >
                      View Detailed Recommendations
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-xl font-bold text-white mb-4">Risk Factors</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <RiskFactorDetail 
                  icon={<BarChart className="h-6 w-6" />}
                  title="BMI"
                  value="27.5"
                  unit="kg/m²"
                  description="Body Mass Index - Overweight"
                  className="bg-gradient-to-br from-diabetesSense-background to-secondary/40"
                  africanContext="BMI thresholds may be different for African populations. Some studies suggest that health risks may occur at lower BMI levels in African populations compared to European counterparts."
                  recommendations={[
                    "Include local vegetables like kontomire in your meals",
                    "Try traditional recipes with reduced oil, like boiled plantains instead of fried",
                    "Replace refined carbohydrates with local whole grains like millet"
                  ]}
                />
                <RiskFactorDetail 
                  icon={<LineChart className="h-6 w-6" />}
                  title="Blood Glucose"
                  value="126"
                  unit="mg/dL"
                  description="Fasting plasma glucose"
                  className="bg-gradient-to-br from-diabetesSense-background to-secondary/40"
                  africanContext="Dietary patterns in Ghana often include starchy foods that can impact blood glucose. Traditional foods like fufu, banku, and kenkey have varying effects on blood sugar levels."
                  recommendations={[
                    "Pair starchy foods with protein and vegetables to slow glucose absorption",
                    "Consider okra, which is traditionally used to help regulate blood sugar",
                    "Incorporate bitter foods like bitter leaf soup, which may help reduce blood sugar"
                  ]}
                />
                <RiskFactorDetail 
                  icon={<Activity className="h-6 w-6" />}
                  title="HbA1c"
                  value="6.2"
                  unit="%"
                  description="Average blood sugar over 3 months"
                  className="bg-gradient-to-br from-diabetesSense-background to-secondary/40"
                  africanContext="Some studies suggest that HbA1c levels may be naturally higher in some African populations, independent of glucose levels, due to genetic factors affecting red blood cells."
                  recommendations={[
                    "Regular monitoring is important to establish your personal baseline",
                    "Incorporate moringa leaves, which contain compounds that may help regulate blood sugar",
                    "Consider hibiscus tea, which has shown potential benefits for metabolic health"
                  ]}
                />
                <RiskFactorDetail 
                  icon={<Heart className="h-6 w-6" />}
                  title="Hypertension"
                  value="Yes"
                  unit=""
                  description="High blood pressure condition"
                  className="bg-gradient-to-br from-diabetesSense-background to-secondary/40"
                  africanContext="Hypertension rates are higher in many African countries, including Ghana. Traditional diets may be high in sodium from seasoning cubes and preserved foods."
                  recommendations={[
                    "Limit bouillon cubes and season with herbs and spices instead",
                    "Include potassium-rich foods like plantains, beans, and leafy greens",
                    "Consider hibiscus tea (sobolo), which has been shown to help lower blood pressure"
                  ]}
                />
              </div>
            </div>

            <ModelInterpretability features={featureContributions} />
          </>
        ) : (
          <Card className="card-gradient border border-white/10 animate-fade-in">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="inline-block relative mb-4">
                  <div className="w-20 h-20 rounded-full bg-diabetesSense-background flex items-center justify-center border-2 border-diabetesSense-accent/30">
                    <Activity className="h-9 w-9 text-diabetesSense-accent" />
                    <div className="absolute -inset-1 rounded-full border border-diabetesSense-accent/20 animate-pulse-slow"></div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to Diabetes Sense!</h2>
                <p className="text-gray-300 mb-6">
                  Start by taking your first risk assessment to get personalized insights and recommendations.
                </p>
                <Button 
                  onClick={() => navigate('/assessment')} 
                  className="bg-diabetesSense-accent hover:bg-diabetesSense-accent/90 text-white px-8 py-6 rounded-xl text-lg"
                >
                  Take Risk Assessment
                </Button>
              </div>
              
              <div className="bg-secondary/30 rounded-lg p-4 max-w-md mx-auto">
                <h3 className="text-white font-medium mb-2">Why assess your risk?</h3>
                <ul className="text-left text-sm text-gray-300 space-y-2">
                  <li className="flex items-start">
                    <span className="text-diabetesSense-accent mr-2">•</span>
                    <span>Get a personalized diabetes risk score</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-diabetesSense-accent mr-2">•</span>
                    <span>Understand your key risk factors</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-diabetesSense-accent mr-2">•</span>
                    <span>Receive tailored recommendations</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="mt-6 p-4 bg-secondary/50 rounded-lg border border-white/5 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-center text-gray-300 italic">
            <span className="text-diabetesSense-accent font-medium">Daily Tip:</span> {randomTip}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
