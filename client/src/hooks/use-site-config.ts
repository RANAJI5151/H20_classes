import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertSiteConfig } from "@shared/routes";

export function useSiteConfig() {
  return useQuery({
    queryKey: [api.siteConfig.list.path],
    queryFn: async () => {
      const res = await fetch(api.siteConfig.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch site config");
      return api.siteConfig.list.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateSiteConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertSiteConfig) => {
      const res = await fetch(api.siteConfig.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update site config");
      return api.siteConfig.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.siteConfig.list.path] });
    },
  });
}
