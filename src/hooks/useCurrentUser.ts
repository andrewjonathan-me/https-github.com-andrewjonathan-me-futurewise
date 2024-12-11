import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useCurrentUser = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };

    fetchCurrentUser();
  }, []);

  return currentUserId;
};