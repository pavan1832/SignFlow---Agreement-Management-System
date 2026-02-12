import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  LogOut,
  FileText,
  UserCircle,
  Menu,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Documents", href: "/documents", icon: FileText },
  ];

  const NavLink = ({ item, mobile = false }: { item: typeof navigation[0], mobile?: boolean }) => {
    const isActive = location === item.href;
    return (
      <Link
        href={item.href}
        className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        } ${mobile ? "w-full" : ""}`}
      >
        <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-primary" : "text-gray-400"}`} />
        {item.name}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-gray-900">SignFlow</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[80%] max-w-[300px]">
            <div className="pt-8 flex flex-col h-full">
              <div className="flex-1 space-y-2">
                {navigation.map((item) => (
                  <NavLink key={item.name} item={item} mobile />
                ))}
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center px-4 py-3 mb-2">
                  <UserCircle className="h-8 w-8 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r h-screen sticky top-0">
        <div className="p-6 border-b flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-gray-900 tracking-tight">SignFlow</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center p-2 rounded-lg bg-gray-50 border border-gray-100 mb-3">
            <UserCircle className="h-8 w-8 text-gray-400 mr-3" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => logout()}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-65px)] md:h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
