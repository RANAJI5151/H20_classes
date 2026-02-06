import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { CareerApplication, InsertCareerApplication } from "@shared/schema";

export function useCareerApplications() {
  return useQuery({
    queryKey: ["/api/career-applications"],
    queryFn: async () => {
      const response = await fetch(api.careerApplications.list.path);
      if (!response.ok) throw new Error("Failed to fetch applications");
      return response.json() as Promise<CareerApplication[]>;
    },
  });
}

export function useCareerApplication(id: number) {
  return useQuery({
    queryKey: ["/api/career-applications", id],
    queryFn: async () => {
      const response = await fetch(api.careerApplications.get.path.replace(":id", String(id)));
      if (!response.ok) throw new Error("Failed to fetch application");
      return response.json() as Promise<CareerApplication>;
    },
    enabled: !!id,
  });
}

export function useCreateCareerApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (app: InsertCareerApplication) => {
      const response = await fetch(api.careerApplications.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(app),
      });
      if (!response.ok) throw new Error("Failed to submit application");
      return response.json() as Promise<CareerApplication>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/career-applications"] });
    },
  });
}

export function useUpdateCareerApplication(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<InsertCareerApplication>) => {
      const response = await fetch(api.careerApplications.update.path.replace(":id", String(id)), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update application");
      return response.json() as Promise<CareerApplication>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/career-applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/career-applications", id] });
    },
  });
}

export function useDeleteCareerApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(api.careerApplications.delete.path.replace(":id", String(id)), {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete application");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/career-applications"] });
    },
  });
}
