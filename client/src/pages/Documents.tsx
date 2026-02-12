import { Layout } from "@/components/Layout";
import { useAgreements } from "@/hooks/use-agreements";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { FileText, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "@/components/StatusBadge";

export default function Documents() {
  const { data: agreements } = useAgreements();

  return (
    <Layout>
      <div className="space-y-8 animate-in">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">My Documents</h1>
          <p className="text-gray-500 mt-1">Full history of your agreements.</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-medium">Agreement Title</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Signer</th>
                    <th className="px-6 py-4 font-medium">Created At</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {agreements?.map((agreement) => (
                    <tr key={agreement.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-gray-900">{agreement.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={agreement.status as any} />
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {agreement.signerEmail || "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {format(new Date(agreement.createdAt!), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/agreements/${agreement.id}`} className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1 text-xs">
                          View <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {agreements?.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No documents found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
