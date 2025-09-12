import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Package, 
  Heart,
  Star,
  Eye,
  Plus
} from 'lucide-react';
import { apiClient, Product, Order } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/App';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [productsData, ordersData] = await Promise.all([
        apiClient.getProducts(),
        apiClient.getOrders()
      ]);
      setProducts(productsData.slice(0, 6));
      // Filtrer seulement les commandes de l'utilisateur connecté
      const userOrders = ordersData.filter(order => order.userId === user?.id);
      setMyOrders(userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  const totalOrders = myOrders.length;
  const totalSpent = myOrders.reduce((sum, order) => sum + order.total, 0);
  const recentOrder = myOrders[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Bienvenue, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Découvrez nos produits et gérez vos commandes
          </p>
        </div>
        <Button onClick={() => navigate('/shop')} className="w-fit">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Parcourir la boutique
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/40 hover:shadow-elegant transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes Commandes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">commandes passées</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 hover:shadow-elegant transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dépensé</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalSpent.toFixed(2)} Ariary</div>
            <p className="text-xs text-muted-foreground">montant total</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 hover:shadow-elegant transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernière Commande</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {recentOrder ? `${recentOrder.total.toFixed(2)} Ariary` : 'Aucune'}
            </div>
            <p className="text-xs text-muted-foreground">
              {recentOrder ? new Date(recentOrder.createdAt).toLocaleDateString('fr-FR') : 'commande'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Featured Products */}
        <Card className="border-border/40">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Produits Populaires</CardTitle>
                <CardDescription>Découvrez nos meilleures ventes</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/shop')}>
                <Eye className="mr-2 h-4 w-4" />
                Voir tout
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{product.price.toFixed(2)} Arriary</p>
                  {product.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {product.badge}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* My Recent Orders */}
        <Card className="border-border/40">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Mes Commandes Récentes</CardTitle>
                <CardDescription>Vos 5 dernières commandes</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/orders')}>
                <Eye className="mr-2 h-4 w-4" />
                Voir tout
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {myOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune commande</h3>
                <p className="text-muted-foreground mb-4">Vous n'avez pas encore passé de commande</p>
                <Button onClick={() => navigate('/shop')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Commencer vos achats
                </Button>
              </div>
            ) : (
              myOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">Commande #{order.id}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')} • {order.orderItems.length} article{order.orderItems.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">{order.total.toFixed(2)} Ariary</p>
                    <Badge variant="secondary" className="text-xs">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;