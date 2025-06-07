import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import ExplorePage from "@/pages/explore-page";
import viewprofile from "@/pages/view-profile";
import ProfilePage from "@/pages/profile-page";
import MessagesPage from "@/pages/messages-page";
import HowItWorksPage from "@/pages/how-it-works-page";
import { ProtectedRoute } from "./lib/protected-route";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/how-it-works" component={HowItWorksPage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <Route path="/explore" component={ExplorePage} />
      <Route path="/view-profile" component={viewprofile} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/messages" component={MessagesPage} />
      <ProtectedRoute path="/messages/:userId" component={MessagesPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Router />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
