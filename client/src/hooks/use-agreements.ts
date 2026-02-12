import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type errorSchemas } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Types derived from the schema exports
export type Agreement = z.infer<typeof api.agreements.create.responses[201]>;
export type AuditLog = z.infer<typeof api.audit.list.responses[200]>[number];

// Fetch all agreements
export function useAgreements() {
  return useQuery({
    queryKey: [api.agreements.list.path],
    queryFn: async () => {
      const res = await fetch(api.agreements.list.path, { credentials: "include" });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch agreements");
      return api.agreements.list.responses[200].parse(await res.json());
    },
  });
}

// Fetch single agreement
export function useAgreement(id: number) {
  return useQuery({
    queryKey: [api.agreements.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.agreements.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 401) throw new Error("Unauthorized");
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch agreement");
      return api.agreements.get.responses[200].parse(await res.json());
    },
    enabled: !isNaN(id),
  });
}

// Fetch audit logs
export function useAuditLogs(agreementId: number) {
  return useQuery({
    queryKey: [api.audit.list.path, agreementId],
    queryFn: async () => {
      const url = buildUrl(api.audit.list.path, { id: agreementId });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch audit logs");
      return api.audit.list.responses[200].parse(await res.json());
    },
    enabled: !isNaN(agreementId),
  });
}

// Create Agreement (Multipart)
export function useCreateAgreement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(api.agreements.create.path, {
        method: api.agreements.create.method,
        body: formData, // Browser sets Content-Type to multipart/form-data automatically
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create agreement");
      }
      return api.agreements.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.agreements.list.path] });
      toast({
        title: "Agreement Created",
        description: "Your agreement has been drafted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Update Status (Send, Sign)
export function useUpdateAgreementStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number; status: "Draft" | "Sent" | "Signed"; signerEmail?: string }) => {
      const url = buildUrl(api.agreements.updateStatus.path, { id });
      const res = await fetch(url, {
        method: api.agreements.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update status");
      return api.agreements.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.agreements.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.agreements.get.path, data.id] });
      queryClient.invalidateQueries({ queryKey: [api.audit.list.path, data.id] });
      
      const message = data.status === "Sent" 
        ? "Agreement sent to signer." 
        : data.status === "Signed" 
          ? "Agreement signed successfully!" 
          : "Agreement status updated.";

      toast({
        title: "Success",
        description: message,
      });
    },
    onError: (error) => {
      toast({
        title: "Action Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
