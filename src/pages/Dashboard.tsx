import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Plus,
  Eye,
} from "lucide-react";
import { apiClient, Product, Order } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [productsData, ordersData] = await Promise.all([
        apiClient.getProducts(),
        apiClient.getOrders(),
      ]);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données du dashboard.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    lowStockProducts: products.filter((p) => p.stock < 10).length,
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de votre boutique Honey
          </p>
        </div>
        <Button variant="gradient" onClick={() => navigate("/products/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau produit
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 hover:shadow-elegant transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Produits
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              +2 depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 hover:shadow-elegant transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +12% depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 hover:shadow-elegant transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRevenue.toFixed(2)}€
            </div>
            <p className="text-xs text-muted-foreground">
              +8% depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 hover:shadow-elegant transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock faible</CardTitle>
            <Package className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {stats.lowStockProducts}
            </div>
            <p className="text-xs text-muted-foreground">
              Produits à réapprovisionner
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Products */}
        <Card className="border-border/40">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Produits récents</CardTitle>
                <CardDescription>Derniers produits ajoutés</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/products")}
              >
                <Eye className="mr-2 h-4 w-4" />
                Voir tous
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {product.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {product.price}€
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {product.badge && (
                      <Badge variant="secondary">{product.badge}</Badge>
                    )}
                    <Badge
                      variant={product.stock > 10 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      Stock: {product.stock}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="border-border/40">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Commandes récentes</CardTitle>
                <CardDescription>Dernières commandes reçues</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/orders")}
              >
                <Eye className="mr-2 h-4 w-4" />
                Voir toutes
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Commande #{order.id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        order.status === "completed" ? "default" : "secondary"
                      }
                    >
                      {order.status}
                    </Badge>
                    <span className="text-sm font-medium">
                      {order.total.toFixed(2)} Ariary
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
