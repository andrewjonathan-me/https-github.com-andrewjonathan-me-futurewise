import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface UserMenuProps {
  isMobile?: boolean;
}

export function UserMenu({ isMobile = false }: UserMenuProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email);
        console.log("Fetching profile for user:", user.id);
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("avatar_url, username")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
        } else if (profile) {
          console.log("Profile fetched:", profile);
          setAvatarUrl(profile.avatar_url);
          setUsername(profile.username);
        }
      }
    };

    fetchProfile();

    // Subscribe to profile changes
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
        },
        async (payload) => {
          console.log("Profile update received:", payload);
          const { data: { user } } = await supabase.auth.getUser();
          if (user && payload.new.id === user.id) {
            setAvatarUrl(payload.new.avatar_url);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isMobile) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <Avatar className="h-16 w-16">
          <AvatarImage 
            src={avatarUrl || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"} 
            alt="Profile picture" 
          />
          <AvatarFallback>
            <User className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <p className="font-medium text-gray-900 dark:text-gray-100">{username || email}</p>
          {username && <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>}
        </div>
        <div className="w-full space-y-1 pt-2">
          <Link 
            to="/profile" 
            className="block w-full px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {t('profile.edit')}
          </Link>
          <button
            onClick={handleSignOut}
            className="block w-full px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {t('profile.signout')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage 
              src={avatarUrl || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"} 
              alt="Profile picture" 
            />
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to="/profile">{t('profile.title')}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          {t('profile.signout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}