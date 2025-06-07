import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Menu, X, User, LogOut, BarChart2, Search, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "How It Works", path: "/how-it-works" },
    { label: "Explore", path: "/explore" },
  ];

  const userNavItems = user ? [
    { label: "Dashboard", path: "/dashboard", icon: <BarChart2 className="h-4 w-4 mr-2" /> },
    { label: "Explore", path: "/explore", icon: <Search className="h-4 w-4 mr-2" /> },
    { label: "Messages", path: "/messages", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { label: "Profile", path: "/profile", icon: <User className="h-4 w-4 mr-2" /> },
  ] : [];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary font-poppins">
                Hustle<span className="text-black">Hub</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`${
                    location === item.path
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } px-1 pt-1 border-b-2 text-sm font-medium inline-flex items-center`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {!user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth">Sign Up</Link>
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImage || undefined} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {userNavItems.map((item) => (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link href={item.path} className="flex items-center cursor-pointer">
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`sm:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={closeMobileMenu}
              className={`${
                location === item.path
                  ? "bg-primary text-white border-l-4 border-primary"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 border-l-4"
              } block pl-3 pr-4 py-2 text-base font-medium`}
            >
              {item.label}
            </Link>
          ))}
          {user && userNavItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={closeMobileMenu}
              className={`${
                location === item.path
                  ? "bg-primary text-white border-l-4 border-primary"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 border-l-4"
              } block pl-3 pr-4 py-2 text-base font-medium flex items-center`}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {!user ? (
            <div className="flex items-center px-4 space-x-3">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/auth" onClick={closeMobileMenu}>Login</Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link href="/auth" onClick={closeMobileMenu}>Sign Up</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col px-4 space-y-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Avatar>
                    <AvatarImage src={user.profileImage || undefined} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
              </div>
              <Button 
                variant="destructive" 
                className="justify-center w-full" 
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Log out</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
