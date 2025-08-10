
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";

interface UserProfile {
  name: string;
  email: string;
}

const ProfileSettings = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();

  useEffect(() => {
    // Load user data
    if (userProfile) {
      setProfile({
        name: userProfile.full_name || '',
        email: userProfile.email || ''
      });
    } else if (currentUser) {
      setProfile({
        name: currentUser.user_metadata?.full_name || '',
        email: currentUser.email || ''
      });
    }
  }, [currentUser, userProfile]);

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!profile.name || !profile.email) {
      toast({
        title: "Error",
        description: "Name and email are required.",
        variant: "destructive"
      });
      return;
    }

    // Update user profile in Supabase
    if (currentUser && userProfile) {
      // This would normally update the profile in Supabase
      // For now, we'll just show success message
      // TODO: Implement Supabase profile update
    }

    toast({
      title: "Success",
      description: "Profile updated successfully."
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={profile.name}
            onChange={(e) => handleChange('name', e.target.value)}
            disabled={!isEditing}
            className={!isEditing ? "bg-secondary border-none opacity-70" : "bg-secondary border-none"}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled={!isEditing}
            className={!isEditing ? "bg-secondary border-none opacity-70" : "bg-secondary border-none"}
          />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {isEditing ? (
          <>
            <Button onClick={handleSave} className="flex-1 bg-diabetesSense-accent hover:bg-diabetesSense-accent/90">
              Save Changes
            </Button>
            <Button 
              onClick={() => setIsEditing(false)} 
              variant="outline" 
              className="flex-1 border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)} className="flex-1 bg-diabetesSense-accent hover:bg-diabetesSense-accent/90">
            Edit Profile
          </Button>
        )}
      </div>
      
      <div className="pt-4 border-t border-gray-800">
        <Button onClick={handleLogout} variant="destructive" className="w-full">
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;
