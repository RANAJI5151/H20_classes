import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { SuccessStory, InsertSuccessStory } from "@shared/schema";

export function useSuccessStories() {
  return useQuery({
    queryKey: ["/api/success-stories"],
    queryFn: async () => {
      const response = await fetch(api.successStories.list.path);
      if (!response.ok) throw new Error("Failed to fetch success stories");
      return response.json() as Promise<SuccessStory[]>;
    },
  });
}

export function useLatestSuccessStories(limit: number = 6) {
  return useQuery({
    queryKey: ["/api/success-stories", "latest", limit],
    queryFn: async () => {
      const response = await fetch(api.successStories.list.path);
      if (!response.ok) throw new Error("Failed to fetch success stories");
      const stories = (await response.json()) as SuccessStory[];
      return stories.slice(0, limit);
    },
  });
}

export function useSuccessStory(id: number) {
  return useQuery({
    queryKey: ["/api/success-stories", id],
    queryFn: async () => {
      const response = await fetch(api.successStories.get.path.replace(":id", String(id)));
      if (!response.ok) throw new Error("Failed to fetch success story");
      return response.json() as Promise<SuccessStory>;
    },
    enabled: !!id,
  });
}

export function useCreateSuccessStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (story: InsertSuccessStory) => {
      const response = await fetch(api.successStories.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(story),
      });
      if (!response.ok) throw new Error("Failed to create success story");
      return response.json() as Promise<SuccessStory>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/success-stories"] });
    },
  });
}

export function useUpdateSuccessStory(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<InsertSuccessStory>) => {
      const response = await fetch(api.successStories.update.path.replace(":id", String(id)), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update success story");
      return response.json() as Promise<SuccessStory>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/success-stories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/success-stories", id] });
    },
  });
}

export function useDeleteSuccessStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(api.successStories.delete.path.replace(":id", String(id)), {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete success story");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/success-stories"] });
    },
  });
}
