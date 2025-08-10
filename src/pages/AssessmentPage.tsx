
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import MainNav from '@/components/navigation/MainNav';
import { calculateBMI, getBMICategory } from '@/utils/bmiCalculator';

interface AssessmentForm {
  age: string;
  gender: string;
  height: string;
  weight: string;
  hypertension: boolean;
  heart_disease: boolean;
  smoking_history: string;
  HbA1c_level: string;
  blood_glucose_level: string;
}

const AssessmentPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>("");
  
  const [form, setForm] = useState<AssessmentForm>({
    age: '',
    gender: '',
    height: '',
    weight: '',
    hypertension: false,
    heart_disease: false,
    smoking_history: 'never',
    HbA1c_level: '',
    blood_glucose_level: ''
  });

  useEffect(() => {
    // Calculate BMI whenever height or weight changes
    if (form.height && form.weight) {
      const height = parseFloat(form.height);
      const weight = parseFloat(form.weight);
      
      if (height > 0 && weight > 0) {
        const calculatedBMI = calculateBMI(height, weight);
        setBmi(parseFloat(calculatedBMI.toFixed(1)));
        setBmiCategory(getBMICategory(calculatedBMI));
      }
    }
  }, [form.height, form.weight]);

  const handleChange = (field: keyof AssessmentForm, value: string | boolean) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const requiredFields = ['age', 'gender', 'height', 'weight', 'HbA1c_level', 'blood_glucose_level'];
    const missingFields = requiredFields.filter(field => !form[field as keyof AssessmentForm]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing information",
        description: `Please complete all required fields.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare API payload
      const payload = {
        age: parseInt(form.age),
        gender: form.gender === 'male' ? 1 : 0,
        bmi: bmi,
        hypertension: form.hypertension ? 1 : 0,
        heart_disease: form.heart_disease ? 1 : 0,
        smoking_history: form.smoking_history,
        HbA1c_level: parseFloat(form.HbA1c_level),
        blood_glucose_level: parseInt(form.blood_glucose_level)
      };
      
      // Simulated API request for now
      // In a real app, you would send this payload to your backend
      setTimeout(() => {
        const mockScore = Math.random();
        const now = new Date().toLocaleString();
        
        // Save to localStorage
        localStorage.setItem('lastAssessment', JSON.stringify({ 
          score: mockScore, 
          date: now,
          bmi: bmi,
          bmiCategory: bmiCategory,
          glucose: form.blood_glucose_level,
          hba1c: form.HbA1c_level
        }));
        
        setIsLoading(false);
        
        toast({
          title: "Assessment completed",
          description: "Your risk assessment has been calculated.",
        });
        
        // Redirect to dashboard to see results
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process assessment. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-diabetesSense-background flex flex-col">
      <MainNav />
      
      <div className="flex-1 p-4 md:p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-white">Risk Assessment</h1>
          <p className="text-gray-400">Enter your health information to calculate your risk</p>
        </header>
        
        <Card className="card-gradient border border-white/10">
          <CardHeader>
            <CardTitle>Diabetes Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="age">Age (years)</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={form.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    className="bg-secondary border-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={form.gender} 
                    onValueChange={(value) => handleChange('gender', value)}
                  >
                    <SelectTrigger id="gender" className="bg-secondary border-none">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="height">Height (m)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 1.72"
                    value={form.height}
                    onChange={(e) => handleChange('height', e.target.value)}
                    className="bg-secondary border-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 70.5"
                    value={form.weight}
                    onChange={(e) => handleChange('weight', e.target.value)}
                    className="bg-secondary border-none"
                  />
                </div>
                
                {bmi && (
                  <div className="space-y-1 bg-secondary/50 p-3 rounded-lg col-span-full">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Your BMI:</span>
                      <span className="font-bold text-lg">{bmi}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Category:</span>
                      <span className={`font-medium ${
                        bmiCategory === "Normal" ? "text-diabetesSense-low" :
                        bmiCategory === "Underweight" ? "text-diabetesSense-moderate" :
                        "text-diabetesSense-high"
                      }`}>
                        {bmiCategory}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="smoking">Smoking History</Label>
                  <Select 
                    value={form.smoking_history} 
                    onValueChange={(value) => handleChange('smoking_history', value)}
                  >
                    <SelectTrigger id="smoking" className="bg-secondary border-none">
                      <SelectValue placeholder="Select smoking history" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="current">Current</SelectItem>
                      <SelectItem value="former">Former</SelectItem>
                      <SelectItem value="occasional">Occasional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hba1c">HbA1c Level (%)</Label>
                  <Input
                    id="hba1c"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 5.7"
                    value={form.HbA1c_level}
                    onChange={(e) => handleChange('HbA1c_level', e.target.value)}
                    className="bg-secondary border-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="glucose">Blood Glucose Level (mg/dL)</Label>
                  <Input
                    id="glucose"
                    type="number"
                    placeholder="e.g., 110"
                    value={form.blood_glucose_level}
                    onChange={(e) => handleChange('blood_glucose_level', e.target.value)}
                    className="bg-secondary border-none"
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="hypertension">Hypertension</Label>
                  <Switch
                    id="hypertension"
                    checked={form.hypertension}
                    onCheckedChange={(checked) => handleChange('hypertension', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="heart-disease">Heart Disease</Label>
                  <Switch
                    id="heart-disease"
                    checked={form.heart_disease}
                    onCheckedChange={(checked) => handleChange('heart_disease', checked)}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-diabetesSense-accent hover:bg-diabetesSense-accent/90 text-white py-6 rounded-xl font-medium"
              >
                {isLoading ? "Processing..." : "Submit Assessment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentPage;
