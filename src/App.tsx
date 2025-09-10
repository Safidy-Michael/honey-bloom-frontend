import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { apiClient, User } from "./lib/api";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (apiClient.isAuthenticated()) {
        try {
          const userProfile = await apiClient.getProfile();
          setUser(userProfile);
        } catch (error) {
          apiClient.logout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-subtle">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/login" 
              element={
                user ? <Navigate to="/" replace /> : <Login />
              } 
            />
            <Route 
              path="/" 
              element={
                user ? (
                  <Layout user={user}>
                    <Dashboard />
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/products" 
              element={
                user ? (
                  <Layout user={user}>
                    <Products />
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/orders" 
              element={
                user ? (
                  <Layout user={user}>
                    <Orders />
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;