import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertFaculty } from "@shared/routes";

export function useFaculty() {
  return useQuery({
    queryKey: [api.faculty.list.path],
    queryFn: async () => {
      const res = await fetch(api.faculty.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch faculty");
      return api.faculty.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertFaculty) => {
      const res = await fetch(api.faculty.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create faculty");
      return api.faculty.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.faculty.list.path] }),
  });
}

export function useUpdateFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertFaculty>) => {
      const url = buildUrl(api.faculty.update.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update faculty");
      return api.faculty.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.faculty.list.path] }),
  });
}

export function useDeleteFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.faculty.delete.path, { id });
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete faculty");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.faculty.list.path] }),
  });
}
