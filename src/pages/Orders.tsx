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
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  ShoppingCart,
  Package,
} from "lucide-react";
import { apiClient, Order } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/App";

const Orders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await apiClient.getOrders();
      // Filtrer les commandes selon le rôle
      const filteredOrders =
        user?.role === "admin"
          ? data
          : data.filter((order) => order.userId === user?.id);
      setOrders(
        filteredOrders.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les commandes.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOrder = async (id: number) => {
    // Seuls les admins peuvent supprimer des commandes
    if (user?.role !== "admin") {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description:
          "Vous n'avez pas les permissions pour supprimer cette commande.",
      });
      return;
    }

    if (!confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) return;

    try {
      await apiClient.deleteOrder(id);
      setOrders(orders.filter((o) => o.id !== id));
      toast({
        title: "Commande supprimée",
        description: "La commande a été supprimée avec succès.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la commande.",
      });
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "default";
      case "pending":
        return "warning";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "Terminée";
      case "pending":
        return "En attente";
      case "cancelled":
        return "Annulée";
      case "processing":
        return "En traitement";
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toString().includes(searchTerm) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {user?.role === "admin" ? "Toutes les Commandes" : "Mes Commandes"}
          </h1>
          <p className="text-muted-foreground">
            {user?.role === "admin"
              ? "Gérez toutes les commandes et suivez leur statut"
              : "Suivez vos commandes et leur statut"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            Total: {orders.length} commandes
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par ID ou statut..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card className="border-border/40">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Aucune commande trouvée
            </h3>
            <p className="text-muted-foreground text-center">
              {searchTerm
                ? "Aucune commande ne correspond à votre recherche."
                : "Aucune commande pour le moment."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card
              key={order.id}
              className="border-border/40 hover:shadow-elegant transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      Commande #{order.id}
                      <Badge variant={getStatusVariant(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {order.total.toFixed(2)} Ariary
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.orderItems.length} article
                        {order.orderItems.length > 1 ? "s" : ""}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Voir détails
                        </DropdownMenuItem>
                        {user?.role === "admin" && (
                          <DropdownMenuItem
                            onClick={() => handleDeleteOrder(order.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Order Items */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Articles commandés:
                  </h4>
                  <div className="grid gap-2">
                    {order.orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                      >
                        <div className="flex items-center gap-3">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              Produit ID: {item.productId}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Quantité: {item.quantity} ×{" "}
                              {item.price.toFixed(2)} Ariary
                            </p>
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          {(item.quantity * item.price).toFixed(2)} Ariary
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Info - Only for admins */}
                {user?.role === "admin" && (
                  <div className="mt-4 pt-4 border-t border-border/40">
                    <p className="text-sm text-muted-foreground">
                      Client ID:{" "}
                      <span className="font-medium">{order.userId}</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
