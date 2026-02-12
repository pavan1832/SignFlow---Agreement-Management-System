import { z } from 'zod';
import { insertAgreementSchema, agreements, auditLogs } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  agreements: {
    list: {
      method: 'GET' as const,
      path: '/api/agreements' as const,
      responses: {
        200: z.array(z.custom<typeof agreements.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/agreements' as const,
      // Input is Multipart Form Data, so schema validation happens on fields, not full body
      // We'll define the shape of the metadata here
      input: insertAgreementSchema,
      responses: {
        201: z.custom<typeof agreements.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/agreements/:id' as const,
      responses: {
        200: z.custom<typeof agreements.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/agreements/:id/status' as const,
      input: z.object({
        status: z.enum(["Draft", "Sent", "Signed"]),
        signerId: z.string().optional(), // For assigning signer
        signerEmail: z.string().email().optional(),
      }),
      responses: {
        200: z.custom<typeof agreements.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    // Upload endpoint is separate? No, usually part of create. 
    // But for "Draft" -> "Sent", maybe we update.
  },
  audit: {
    list: {
      method: 'GET' as const,
      path: '/api/agreements/:id/audit' as const,
      responses: {
        200: z.array(z.custom<typeof auditLogs.$inferSelect & { user: { firstName: string | null, lastName: string | null, email: string | null } }>()),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
