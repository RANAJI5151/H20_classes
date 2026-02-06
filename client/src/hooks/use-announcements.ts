import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { Announcement, InsertAnnouncement } from "@shared/schema";

export function useAnnouncements() {
  return useQuery({
    queryKey: ["/api/announcements"],
    queryFn: async () => {
      const response = await fetch(api.announcements.list.path);
      if (!response.ok) throw new Error("Failed to fetch announcements");
      const data = (await response.json()) as Announcement[];
      // Filter out expired announcements on client side
      const now = new Date();
      return data.filter(ann => {
        if (!ann.active) return false;
        if (ann.expiryDate && new Date(ann.expiryDate) < now) return false;
        return true;
      });
    },
  });
}

export function useAllAnnouncements() {
  return useQuery({
    queryKey: ["/api/announcements", "all"],
    queryFn: async () => {
      const response = await fetch(api.announcements.list.path);
      if (!response.ok) throw new Error("Failed to fetch announcements");
      return response.json() as Promise<Announcement[]>;
    },
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (announcement: InsertAnnouncement) => {
      const response = await fetch(api.announcements.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcement),
      });
      if (!response.ok) throw new Error("Failed to create announcement");
      return response.json() as Promise<Announcement>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
    },
  });
}

export function useUpdateAnnouncement(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<InsertAnnouncement>) => {
      const response = await fetch(api.announcements.update.path.replace(":id", String(id)), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update announcement");
      return response.json() as Promise<Announcement>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(api.announcements.delete.path.replace(":id", String(id)), {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete announcement");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
    },
  });
}
