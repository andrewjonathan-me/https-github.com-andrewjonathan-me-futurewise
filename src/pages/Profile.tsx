import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileInfo } from "@/components/profile/ProfileInfo";

interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  role: string | null;
  email?: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, [navigate]);

  async function loadProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth/login');
        return;
      }

      console.log("Fetching profile for user:", user.id);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        return;
      }

      const fullProfile = {
        ...profileData,
        email: user.email
      };

      console.log("Profile loaded:", fullProfile);
      setProfile(fullProfile);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container max-w-4xl mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-full">
            Loading...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6 dark:shadow-gray-900">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            {profile && (
              <>
                <ProfileAvatar 
                  avatarUrl={profile.avatar_url}
                  username={profile.username}
                  userId={profile.id}
                  onAvatarUpdate={(url) => setProfile(prev => prev ? { ...prev, avatar_url: url } : null)}
                />
                
                <ProfileInfo 
                  username={profile.username}
                  email={profile.email}
                  role={profile.role}
                  userId={profile.id}
                  onUsernameUpdate={(username) => setProfile(prev => prev ? { ...prev, username } : null)}
                />
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}