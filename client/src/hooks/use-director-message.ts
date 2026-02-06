import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { DirectorMessage, InsertDirectorMessage } from "@shared/schema";

export function useDirectorMessage() {
  return useQuery({
    queryKey: ["/api/director-message"],
    queryFn: async () => {
      const response = await fetch(api.directorMessage.get.path);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error("Failed to fetch director message");
      return response.json() as Promise<DirectorMessage>;
    },
  });
}

export function useUpsertDirectorMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: InsertDirectorMessage) => {
      const response = await fetch(api.directorMessage.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });
      if (!response.ok) throw new Error("Failed to save director message");
      return response.json() as Promise<DirectorMessage>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/director-message"] });
    },
  });
}
