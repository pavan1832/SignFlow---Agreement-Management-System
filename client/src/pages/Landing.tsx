import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, Shield, Zap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function Landing() {
  const { user, isLoading } = useAuth();

  if (!isLoading && user) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-gray-900 tracking-tight">SignFlow</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/api/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Sign in
              </a>
              <Button asChild className="shadow-lg shadow-primary/25">
                <a href="/api/login">Get Started</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in" style={{ animationDelay: "0.1s" }}>
              <h1 className="text-5xl lg:text-7xl font-display font-bold tracking-tight text-gray-900 leading-[1.1]">
                Agreements <br/>
                <span className="text-primary">Simplified.</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                The modern way to sign, track, and manage documents. Secure, fast, and built for professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-14 px-8 text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5" asChild>
                  <a href="/api/login">Start Signing Free</a>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg border-2">
                  View Demo
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm font-medium text-gray-500 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Legally binding</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Secure storage</span>
                </div>
              </div>
            </div>

            {/* Abstract Hero Visual */}
            <div className="relative animate-in" style={{ animationDelay: "0.3s" }}>
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
              
              <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 rotate-3 hover:rotate-0 transition-transform duration-500 ease-out">
                {/* Mock UI Card */}
                <div className="flex items-center justify-between mb-8 border-b pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-600 font-bold">JD</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Contract #4092</div>
                      <div className="text-xs text-gray-500">Sent just now</div>
                    </div>
                  </div>
                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    Pending
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  <div className="h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-sm mt-8">
                    Signature Area
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <div className="bg-primary text-white px-6 py-2 rounded-lg font-medium text-sm">
                    Sign Document
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-gray-900">Everything you need</h2>
            <p className="mt-4 text-gray-600">Built for speed and security.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Bank-level Security",
                desc: "Your documents are encrypted and stored securely with full audit trails."
              },
              {
                icon: Zap,
                title: "Instant Delivery",
                desc: "Send agreements via email instantly and get signed faster than ever."
              },
              {
                icon: FileText,
                title: "Smart Management",
                desc: "Keep track of all your contracts in one organized, searchable dashboard."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
