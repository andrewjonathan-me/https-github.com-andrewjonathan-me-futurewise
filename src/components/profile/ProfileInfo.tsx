import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateUsername } from "@/utils/validation";

interface ProfileInfoProps {
  username: string | null;
  email: string | undefined;
  role: string | null;
  userId: string;
  onUsernameUpdate: (username: string) => void;
}

export const ProfileInfo = ({ username, email, role, userId, onUsernameUpdate }: ProfileInfoProps) => {
  const [editing, setEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(username || "");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const checkUsernameAvailability = async (username: string) => {
    const validation = validateUsername(username);
    if (!validation.isValid) {
      setError(validation.error);
      return false;
    }

    setIsValidating(true);
    try {
      const { data, error } = await supabase
        .rpc('check_username_available', { username_to_check: username });

      if (error) throw error;

      if (!data && username !== username) {
        setError("Username is already taken");
        return false;
      }

      setError(null);
      return true;
    } catch (error: any) {
      setError(error.message);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const updateProfile = async () => {
    if (isValidating) return;

    try {
      const isValid = await checkUsernameAvailability(editedUsername);
      if (!isValid) return;

      const { error } = await supabase
        .from('profiles')
        .update({ username: editedUsername })
        .eq('id', userId);

      if (error) throw error;

      onUsernameUpdate(editedUsername);
      setEditing(false);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      {editing ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={editedUsername}
              onChange={(e) => {
                setEditedUsername(e.target.value);
                setError(null);
              }}
              onBlur={() => checkUsernameAvailability(editedUsername)}
              className="max-w-xs"
              error={error || undefined}
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
          </div>
          <div className="space-x-2">
            <Button 
              onClick={updateProfile}
              disabled={isValidating || !!error}
            >
              Save
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setEditing(false);
                setEditedUsername(username || "");
                setError(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold dark:text-white">{username}</h1>
          <p className="text-gray-600 dark:text-white">{email}</p>
          <span className="inline-block mt-1 px-2 py-1 text-sm bg-primary-100 text-primary rounded">
            {role || 'User'}
          </span>
          <div className="mt-4">
            <Button onClick={() => setEditing(true)}>
              Edit Profile
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};