import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useAgreements, Agreement } from "@/hooks/use-agreements";
import { Layout } from "@/components/Layout";
import { CreateAgreementDialog } from "@/components/CreateAgreementDialog";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { FileText, Clock, CheckCircle2, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: agreements, isLoading } = useAgreements();
  const [search, setSearch] = useState("");

  const filteredAgreements = agreements?.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.signerEmail?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: agreements?.length || 0,
    drafts: agreements?.filter(a => a.status === "Draft").length || 0,
    pending: agreements?.filter(a => a.status === "Sent").length || 0,
    completed: agreements?.filter(a => a.status === "Signed").length || 0,
  };

  const AgreementList = ({ items }: { items: Agreement[] }) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No agreements found</h3>
          <p className="text-gray-500">Create a new agreement to get started.</p>
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {items.map((agreement) => (
          <Link key={agreement.id} href={`/agreements/${agreement.id}`} className="block group">
            <div className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    agreement.status === 'Signed' ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {agreement.status === 'Signed' ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {agreement.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      To: {agreement.signerEmail || "Unassigned"} • Created {format(new Date(agreement.createdAt!), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={agreement.status as any} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 animate-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Welcome back, {user?.firstName}</h1>
            <p className="text-gray-500 mt-1">Manage your documents and signatures.</p>
          </div>
          <CreateAgreementDialog />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Documents", value: stats.total, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
            { label: "Drafts", value: stats.drafts, icon: FileText, color: "text-gray-600", bg: "bg-gray-100" },
          ].map((stat) => (
            <Card key={stat.label} className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Area */}
        <Card className="border shadow-sm overflow-hidden bg-white">
          <CardHeader className="border-b bg-gray-50/50 px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-lg font-bold">Recent Documents</CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search agreements..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-white"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100/80 p-1">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
                <TabsTrigger value="signed">Signed</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <AgreementList items={filteredAgreements || []} />
              </TabsContent>
              <TabsContent value="sent">
                <AgreementList items={filteredAgreements?.filter(a => a.status === "Sent") || []} />
              </TabsContent>
              <TabsContent value="signed">
                <AgreementList items={filteredAgreements?.filter(a => a.status === "Signed") || []} />
              </TabsContent>
              <TabsContent value="draft">
                <AgreementList items={filteredAgreements?.filter(a => a.status === "Draft") || []} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
