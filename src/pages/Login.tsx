import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";
import honeyLogo from "@/assets/honey-logo.png";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      toast({ variant: "destructive", title: "Captcha requis", description: "Veuillez valider le captcha." });
      return;
    }
    setIsLoading(true);
    try {
      await apiClient.verifyCaptcha(captchaToken);
      const loginResult = await apiClient.login(loginForm);
      const profile = await apiClient.getProfile();
      setUser(profile);
      toast({ title: "Connexion réussie", description: `Bienvenue ${profile.name} (${profile.role})` });
      navigate("/");
    } catch (error: unknown) {
      let message = "Vérifiez vos identifiants et réessayez.";
      if (error instanceof Error) message = error.message;
      toast({ variant: "destructive", title: "Erreur de connexion", description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      toast({ variant: "destructive", title: "Captcha requis", description: "Veuillez valider le captcha." });
      return;
    }
    setIsLoading(true);
    try {
      await apiClient.verifyCaptcha(captchaToken);
      await apiClient.register(registerForm);
      toast({ title: "Compte créé", description: "Votre compte a été créé avec succès." });
      setRegisterForm({ name: "", email: "", password: "" });
    } catch (error: unknown) {
      let message = "Impossible de créer le compte. Vérifiez vos informations.";
      if (error instanceof Error) message = error.message;
      toast({ variant: "destructive", title: "Erreur de création", description: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={honeyLogo} alt="Honey" className="h-16 w-24 object-contain mx-auto mb-4" />
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Honey Store</h1>
          <p className="text-muted-foreground mt-2">Bienvenue dans votre boutique en ligne</p>
        </div>

        <Card className="border-border/40 shadow-elegant">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Accès au compte</CardTitle>
            <CardDescription className="text-center">Connectez-vous ou créez un nouveau compte</CardDescription>
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
                      autoComplete="email"
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
                      autoComplete="current-password"
                    />
                  </div>
                  <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={setCaptchaToken} />
                  <Button type="submit" className="w-full" variant="gradient" disabled={isLoading}>
                    {isLoading ? "Connexion..." : "Se connecter"}
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
                      autoComplete="name"
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
                      autoComplete="email"
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
                      autoComplete="new-password"
                    />
                  </div>
                  <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={setCaptchaToken} />
                  <Button type="submit" className="w-full" variant="gradient" disabled={isLoading}>
                    {isLoading ? "Création..." : "Créer un compte"}
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
