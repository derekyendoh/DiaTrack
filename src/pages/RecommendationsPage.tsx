
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MainNav from '@/components/navigation/MainNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface Recommendation {
  title: string;
  description: string;
  icon: string;
  type: 'low' | 'moderate' | 'high';
}

const RecommendationsPage = () => {
  const navigate = useNavigate();
  const [riskLevel, setRiskLevel] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    // Get risk level from last assessment
    const lastAssessment = localStorage.getItem('lastAssessment');
    if (lastAssessment) {
      const { score } = JSON.parse(lastAssessment);
      if (score < 0.3) setRiskLevel('low');
      else if (score < 0.6) setRiskLevel('moderate');
      else setRiskLevel('high');
    }
  }, []);

  useEffect(() => {
    // Set recommendations based on risk level
    const lowRiskRecommendations: Recommendation[] = [
      { 
        title: "Maintain Regular Exercise",
        description: "Aim for 150 minutes of moderate activity each week to maintain insulin sensitivity.",
        icon: "🏃",
        type: 'low'
      },
      { 
        title: "Balanced Diet",
        description: "Continue eating a diet rich in vegetables, whole grains, and lean proteins.",
        icon: "🥗",
        type: 'low'
      },
      { 
        title: "Annual Checkup",
        description: "Schedule an annual physical to monitor your health markers.",
        icon: "🩺",
        type: 'low'
      }
    ];

    const moderateRiskRecommendations: Recommendation[] = [
      { 
        title: "Increase Physical Activity",
        description: "Consider 30 minutes of exercise 5 days a week to improve glucose metabolism.",
        icon: "🚴",
        type: 'moderate'
      },
      { 
        title: "Monitor Carbohydrate Intake",
        description: "Be mindful of refined carbs and sugars in your diet.",
        icon: "🍞",
        type: 'moderate'
      },
      { 
        title: "Regular Blood Tests",
        description: "Get your blood glucose checked every 6 months.",
        icon: "🩸",
        type: 'moderate'
      }
    ];

    const highRiskRecommendations: Recommendation[] = [
      { 
        title: "Consult Healthcare Provider",
        description: "Schedule an appointment with your doctor to discuss your diabetes risk.",
        icon: "👨‍⚕️",
        type: 'high'
      },
      { 
        title: "Daily Glucose Monitoring",
        description: "Consider using a glucose monitor to track your levels regularly.",
        icon: "📊",
        type: 'high'
      },
      { 
        title: "Structured Exercise Plan",
        description: "Work with a professional to create a personalized exercise routine.",
        icon: "📝",
        type: 'high'
      },
      { 
        title: "Dietary Consultation",
        description: "Consider meeting with a dietitian specialized in diabetes prevention.",
        icon: "🍽️",
        type: 'high'
      }
    ];

    // Set recommendations based on risk level
    switch (riskLevel) {
      case 'low':
        setRecommendations(lowRiskRecommendations);
        break;
      case 'moderate':
        setRecommendations(moderateRiskRecommendations);
        break;
      case 'high':
        setRecommendations(highRiskRecommendations);
        break;
      default:
        setRecommendations(moderateRiskRecommendations);
    }
  }, [riskLevel]);

  return (
    <div className="min-h-screen bg-diabetesSense-background flex flex-col">
      <MainNav />
      
      <div className="flex-1 p-4 md:p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-white">Recommendations</h1>
          <p className="text-gray-400">Personalized tips based on your risk profile</p>
        </header>
        
        <Card className="card-gradient border border-white/10 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Risk Level</CardTitle>
              <div 
                className={`px-4 py-1 rounded-full text-white text-sm font-medium
                  ${riskLevel === 'low' ? 'bg-diabetesSense-low' : 
                    riskLevel === 'moderate' ? 'bg-diabetesSense-moderate' : 'bg-diabetesSense-high'}`}
              >
                {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              {riskLevel === 'low' ? 
                "Great job maintaining a healthy lifestyle! Here are some tips to stay on track." : 
                riskLevel === 'moderate' ? 
                "You have some risk factors for diabetes. Following these recommendations can help reduce your risk." : 
                "Your risk factors indicate higher diabetes risk. Please consider these important recommendations."}
            </p>
            
            <div className="mt-4">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
                  <TabsTrigger value="medical">Medical</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.map((rec, index) => (
                      <div 
                        key={index} 
                        className="bg-secondary rounded-lg p-4 border-l-4 border-r-0 border-y-0"
                        style={{ 
                          borderColor: rec.type === 'low' ? '#27AE60' : 
                            rec.type === 'moderate' ? '#F2C94C' : '#EB5757'
                        }}
                      >
                        <div className="flex items-start">
                          <div className="text-3xl mr-4">{rec.icon}</div>
                          <div>
                            <h3 className="font-medium text-white">{rec.title}</h3>
                            <p className="text-sm text-gray-300 mt-1">{rec.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="lifestyle" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations
                      .filter(rec => rec.title.includes("Exercise") || rec.title.includes("Diet") || rec.title.includes("Activity"))
                      .map((rec, index) => (
                        <div 
                          key={index} 
                          className="bg-secondary rounded-lg p-4 border-l-4 border-r-0 border-y-0"
                          style={{ 
                            borderColor: rec.type === 'low' ? '#27AE60' : 
                              rec.type === 'moderate' ? '#F2C94C' : '#EB5757'
                          }}
                        >
                          <div className="flex items-start">
                            <div className="text-3xl mr-4">{rec.icon}</div>
                            <div>
                              <h3 className="font-medium text-white">{rec.title}</h3>
                              <p className="text-sm text-gray-300 mt-1">{rec.description}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </TabsContent>
                
                <TabsContent value="medical" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations
                      .filter(rec => rec.title.includes("Checkup") || rec.title.includes("Blood") || rec.title.includes("Consult") || rec.title.includes("Monitor"))
                      .map((rec, index) => (
                        <div 
                          key={index} 
                          className="bg-secondary rounded-lg p-4 border-l-4 border-r-0 border-y-0"
                          style={{ 
                            borderColor: rec.type === 'low' ? '#27AE60' : 
                              rec.type === 'moderate' ? '#F2C94C' : '#EB5757'
                          }}
                        >
                          <div className="flex items-start">
                            <div className="text-3xl mr-4">{rec.icon}</div>
                            <div>
                              <h3 className="font-medium text-white">{rec.title}</h3>
                              <p className="text-sm text-gray-300 mt-1">{rec.description}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-center">
          <Button 
            onClick={() => navigate('/assessment')} 
            className="bg-diabetesSense-accent hover:bg-diabetesSense-accent/90"
          >
            Update My Risk Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
