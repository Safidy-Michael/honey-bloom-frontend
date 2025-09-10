import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/App';
import honeyLogo from '@/assets/honey-logo.png';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('🔵 Début de la connexion...');

    try {
      console.log('📤 Envoi des données de connexion:', loginForm);
      
      // Étape 1: Login pour obtenir le token
      const loginResult = await apiClient.login(loginForm);
      console.log('✅ Login réussi, token reçu:', loginResult.access_token ? 'OUI' : 'NON');
      
      // Vérifier le token dans le localStorage
      const storedToken = localStorage.getItem('auth_token');
      console.log('🔐 Token stocké dans localStorage:', storedToken ? storedToken.substring(0, 20) + '...' : 'AUCUN');
      
      // Vérifier si l'API client est authentifié
      console.log('🔍 apiClient.isAuthenticated():', apiClient.isAuthenticated());
      
      // Étape 2: Récupérer le profil utilisateur
      console.log('📋 Récupération du profil...');
      const profile = await apiClient.getProfile();
      console.log('✅ Profil utilisateur récupéré:', profile);
      
      // Étape 3: Mettre à jour le contexte
      console.log('🔄 Mise à jour du contexte utilisateur...');
      setUser(profile);
      
      // Étape 4: Afficher le toast et rediriger
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur Honey Store !",
      });
      
      console.log('➡️ Redirection vers /products...');
      navigate('/products');
      
    } catch (error: any) {
      console.error('❌ Erreur détaillée:', error);
      console.error('❌ Message d\'erreur:', error.message);
      console.error('❌ Stack:', error.stack);
      
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message || "Vérifiez vos identifiants et réessayez.",
      });
    } finally {
      setIsLoading(false);
      console.log('🔚 Fin du processus de connexion');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiClient.register(registerForm);
      toast({
        title: "Compte créé",
        description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
      });
      setRegisterForm({ name: '', email: '', password: '' });
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      toast({
        variant: "destructive",
        title: "Erreur de création",
        description: error.message || "Impossible de créer le compte. Vérifiez vos informations.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={honeyLogo} alt="Honey" className="h-16 w-24 object-contain mx-auto mb-4" />
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Honey Store
          </h1>
          <p className="text-muted-foreground mt-2">
            Bienvenue dans votre boutique en ligne
          </p>
        </div>

        <Card className="border-border/40 shadow-elegant">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Accès au compte</CardTitle>
            <CardDescription className="text-center">
              Connectez-vous ou créez un nouveau compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="register">Inscription</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    variant="gradient"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Connexion...' : 'Se connecter'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nom complet</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Votre nom"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Mot de passe</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    variant="gradient"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Création...' : 'Créer un compte'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;