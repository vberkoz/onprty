import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSites, getSite, saveSite, updateSite, deleteSite, publishSite, unpublishSite, type StoredSite } from '../services/siteStorageS3';

export const useSites = () => {
  return useQuery({
    queryKey: ['sites'],
    queryFn: getSites,
  });
};

export const useSite = (id: string | null) => {
  return useQuery({
    queryKey: ['site', id],
    queryFn: () => id ? getSite(id) : null,
    enabled: !!id,
  });
};

export const useSaveSite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveSite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    },
  });
};

export const useUpdateSite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<StoredSite> }) => updateSite(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      queryClient.invalidateQueries({ queryKey: ['site', variables.id] });
    },
  });
};

export const useDeleteSite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    },
  });
};

export const usePublishSite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, files }: { id: string; files: { [fileName: string]: string } }) => publishSite(id, files),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      queryClient.invalidateQueries({ queryKey: ['site', variables.id] });
    },
  });
};

export const useUnpublishSite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unpublishSite,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      queryClient.invalidateQueries({ queryKey: ['site', id] });
    },
  });
};
