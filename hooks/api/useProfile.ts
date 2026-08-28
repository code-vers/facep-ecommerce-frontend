'use client';

import { profileApi } from '@/lib/api/profile';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const profileKeys = { me: ['profile', 'me'] as const, settings: ['profile', 'platform-settings'] as const, users: ['admin', 'users'] as const };

export const useProfile = () => {
  const { session } = useAuth();
  return useQuery({
    queryKey: [...profileKeys.me, session?.user.id],
    queryFn: profileApi.getMe,
    enabled: Boolean(session?.user.id),
  });
};
export const usePlatformSettings = (enabled: boolean) => useQuery({ queryKey: profileKeys.settings, queryFn: profileApi.getPlatformSettings, enabled });
export const useAdminUsers = (enabled: boolean) => useQuery({ queryKey: profileKeys.users, queryFn: profileApi.getUsers, enabled });

export const useProfileMutation = <T,>(mutationFn: (variables: T) => Promise<unknown>, keys = [profileKeys.me]) => {
  const client = useQueryClient();
  return useMutation({ mutationFn, onSuccess: () => keys.forEach((key) => void client.invalidateQueries({ queryKey: key })) });
};
