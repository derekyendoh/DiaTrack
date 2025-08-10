-- Create profiles table for clinician information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  work_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  specialization TEXT,
  license_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patients table
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clinician_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  contact_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assessments table
CREATE TABLE public.assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  clinician_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  height DECIMAL(5,2) NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  bmi DECIMAL(4,1) NOT NULL,
  hypertension BOOLEAN NOT NULL DEFAULT false,
  heart_disease BOOLEAN NOT NULL DEFAULT false,
  smoking_history TEXT NOT NULL CHECK (smoking_history IN ('never', 'former', 'current')),
  hba1c_level DECIMAL(4,2),
  blood_glucose_level DECIMAL(6,2),
  risk_score DECIMAL(5,3),
  risk_level TEXT CHECK (risk_level IN ('low', 'moderate', 'high')),
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for patients table
CREATE POLICY "Clinicians can view their own patients" 
ON public.patients 
FOR SELECT 
USING (auth.uid() = clinician_id);

CREATE POLICY "Clinicians can create patients" 
ON public.patients 
FOR INSERT 
WITH CHECK (auth.uid() = clinician_id);

CREATE POLICY "Clinicians can update their own patients" 
ON public.patients 
FOR UPDATE 
USING (auth.uid() = clinician_id);

CREATE POLICY "Clinicians can delete their own patients" 
ON public.patients 
FOR DELETE 
USING (auth.uid() = clinician_id);

-- Create policies for assessments table
CREATE POLICY "Clinicians can view assessments for their patients" 
ON public.assessments 
FOR SELECT 
USING (
  auth.uid() = clinician_id OR 
  EXISTS (
    SELECT 1 FROM public.patients 
    WHERE patients.id = assessments.patient_id 
    AND patients.clinician_id = auth.uid()
  )
);

CREATE POLICY "Clinicians can create assessments" 
ON public.assessments 
FOR INSERT 
WITH CHECK (
  auth.uid() = clinician_id AND
  EXISTS (
    SELECT 1 FROM public.patients 
    WHERE patients.id = assessments.patient_id 
    AND patients.clinician_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, work_id, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'work_id', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();