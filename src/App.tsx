import { useEffect, useState, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { CartProvider } from "./contexts/CartContext";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import AdminRoute from "./components/AdminRoute";
import ClientRoute from "./components/ClientRoute";
import { apiClient, User } from "./lib/api";
import NewProduct from "./pages/NewProduct";
import EditProduct from "./pages/EditProduct";
import OrderDetails from "./pages/OrderDetails";
import ProductDetail from "./pages/ProductDetail";
import { AuthContext, useAuth } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (apiClient.isAuthenticated()) {
        try {
          const profile = await apiClient.getProfile();
          setUser(profile);
          if (import.meta.env.DEV) console.log("✅ Profil récupéré:", profile);
        } catch (error) {
          if (import.meta.env.DEV) console.error("❌ Erreur profil:", error);
          apiClient.logout();
          setUser(null);
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
        <CartProvider>
          <Toaster />
          <Sonner />
          <AuthContext.Provider value={{ user, setUser, isLoading }}>
            <BrowserRouter>
              <Routes>
                <Route
                  path="/login"
                  element={user ? <Navigate to="/" replace /> : <Login />}
                />
                <Route
                  path="/"
                  element={
                    user ? (
                      <Layout user={user}>
                        {user.role === "admin" ? (
                          <AdminDashboard />
                        ) : (
                          <ClientDashboard />
                        )}
                      </Layout>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route
                  path="/products"
                  element={
                    <Layout user={user}>
                      <AdminRoute>
                        <Products />
                      </AdminRoute>
                    </Layout>
                  }
                />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route
                  path="/products/new"
                  element={
                    <Layout user={user}>
                      <AdminRoute>
                        <NewProduct />
                      </AdminRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/products/:id/edit"
                  element={
                    <Layout user={user}>
                      <AdminRoute>
                        <EditProduct />
                      </AdminRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <Layout user={user}>
                      <Orders />
                    </Layout>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <Layout user={user}>
                      <OrderDetails />
                    </Layout>
                  }
                />
                <Route
                  path="/shop"
                  element={
                    <Layout user={user}>
                      <ClientRoute>
                        <Shop />
                      </ClientRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <Layout user={user}>
                      <ClientRoute>
                        <Cart />
                      </ClientRoute>
                    </Layout>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthContext.Provider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
