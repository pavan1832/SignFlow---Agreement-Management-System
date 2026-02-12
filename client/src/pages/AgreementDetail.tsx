import { useRoute } from "wouter";
import { Layout } from "@/components/Layout";
import { useAgreement, useAuditLogs, useUpdateAgreementStatus } from "@/hooks/use-agreements";
import { useAuth } from "@/hooks/use-auth";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, Send, PenTool, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function AgreementDetail() {
  const [match, params] = useRoute("/agreements/:id");
  const id = parseInt(params?.id || "0");
  const { user } = useAuth();
  
  const { data: agreement, isLoading: isLoadingAgreement } = useAgreement(id);
  const { data: logs, isLoading: isLoadingLogs } = useAuditLogs(id);
  const updateStatus = useUpdateAgreementStatus();

  if (isLoadingAgreement || isLoadingLogs) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!agreement) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900">Agreement not found</h2>
          <Button asChild className="mt-4" variant="outline">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Determine actions available to current user
  const isSender = user?.id === agreement.senderId;
  const isSigner = user?.email === agreement.signerEmail; // In real app, check ID too
  
  const canSend = isSender && agreement.status === "Draft";
  const canSign = (isSigner || isSender) && agreement.status === "Sent"; // Simplified: Sender can also sign for demo

  return (
    <Layout>
      <div className="max-w-6xl mx-auto animate-in space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-display font-bold text-gray-900">{agreement.title}</h1>
                <StatusBadge status={agreement.status as any} />
              </div>
              <p className="text-gray-500 text-sm mt-1">
                Created on {format(new Date(agreement.createdAt!), "MMMM d, yyyy")} • ID: #{agreement.id}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {canSend && (
              <Button 
                onClick={() => updateStatus.mutate({ id: agreement.id, status: "Sent" })}
                disabled={updateStatus.isPending}
                className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
              >
                {updateStatus.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4" />}
                Send to Signer
              </Button>
            )}
            
            {canSign && (
              <Button 
                onClick={() => updateStatus.mutate({ id: agreement.id, status: "Signed" })}
                disabled={updateStatus.isPending}
                className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200"
              >
                {updateStatus.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <PenTool className="mr-2 h-4 w-4" />}
                Sign Document
              </Button>
            )}
            
            {agreement.status === "Signed" && (
              <Button variant="outline" className="border-green-200 bg-green-50 text-green-700 cursor-default">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Completed
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Document Viewer (Main) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border shadow-md bg-gray-50 h-[800px] flex flex-col">
              <CardHeader className="border-b bg-white px-6 py-4">
                <CardTitle className="text-base font-medium flex items-center justify-between">
                  <span>Document Preview</span>
                  <a href={agreement.fileUrl} download className="text-sm text-primary hover:underline font-normal">
                    Download PDF
                  </a>
                </CardTitle>
              </CardHeader>
              <div className="flex-1 w-full bg-gray-100">
                {/* iframe for PDF preview - simple implementation */}
                <iframe 
                  src={agreement.fileUrl} 
                  className="w-full h-full border-0"
                  title="Document Preview"
                />
              </div>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Participants */}
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Participants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                    SE
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Sender (Owner)</p>
                    <p className="text-sm text-gray-500">{user?.id === agreement.senderId ? "You" : "User " + agreement.senderId}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                    SI
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Signer</p>
                    <p className="text-sm text-gray-500">{agreement.signerEmail || "Unassigned"}</p>
                    <div className="mt-1">
                      {agreement.status === "Signed" ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Signed</span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">Pending</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audit Trail */}
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                  {logs?.map((log, index) => (
                    <div key={index} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-gray-300 ring-4 ring-white" />
                      
                      <p className="text-sm font-medium text-gray-900">{log.action}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {format(new Date(log.timestamp!), "MMM d, h:mm a")}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        By: {log.user.firstName} {log.user.lastName} ({log.user.email})
                      </p>
                    </div>
                  ))}
                  {logs?.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No activity yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
