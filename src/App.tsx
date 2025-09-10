import { useEffect, useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import { apiClient, User } from './lib/api';

// Créer un contexte pour le user
export const AuthContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}>({
  user: null,
  setUser: () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  const checkAuth = async () => {
    console.log('🔍 Vérification de l\'authentification au chargement...');
    console.log('📍 apiClient.isAuthenticated():', apiClient.isAuthenticated());
    
    if (apiClient.isAuthenticated()) {
      console.log('✅ Utilisateur authentifié, récupération du profil...');
      try {
        const profile = await apiClient.getProfile();
        console.log('✅ Profil récupéré:', profile);
        setUser(profile);
      } catch (error) {
        console.error('❌ Erreur lors de la récupération du profil:', error);
        apiClient.logout();
        setUser(null);
      }
    } else {
      console.log('❌ Utilisateur non authentifié');
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
        <AuthContext.Provider value={{ user, setUser, isLoading }}>
          <BrowserRouter>
            <Routes>
              {/* Login */}
              <Route
                path="/login"
                element={user ? <Navigate to="/products" replace /> : <Login />}
              />

              {/* Dashboard */}
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

              {/* Products */}
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

              {/* Orders */}
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

              {/* Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;