import { useCallback,useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient, Order, OrderItem } from "@/lib/api";
import { useAuth } from "@/App";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState("en_attente");

  const isAdmin = user?.role === "admin";

  const fetchOrder = useCallback(async () => {
    try {
      const data = await apiClient.getOrder(Number(id));
      setOrder(data);
      setStatus(data.status);
    } catch (err: unknown) {
      console.error("Erreur chargement commande:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const updateStatus = async () => {
    try {
      await apiClient.patchOrder(Number(id), { status });
      alert("✅ Statut mis à jour !");

      fetchOrder();
    } catch (err) {
      console.error("❌ Erreur mise à jour statut:", err);
      alert("⚠️ Impossible de mettre à jour le statut");
    }
  };

  if (!order) return <p>Chargement...</p>;

  return (
    <Card className="max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Détails commande #{order.id}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          <strong>Client :</strong> {order.userId}
        </p>
        <p>
          <strong>Total :</strong> {order.total} Ariary
        </p>

        <div>
          <Label>Statut</Label>
          <Select value={status} onValueChange={setStatus} disabled={!isAdmin}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en_attente">En attente</SelectItem>
              <SelectItem value="en_cours">En cours</SelectItem>
              <SelectItem value="livree">Livrée</SelectItem>
              <SelectItem value="annulee">Annulée</SelectItem>
            </SelectContent>
          </Select>

          {isAdmin && (
            <Button onClick={updateStatus} className="mt-3 w-full">
              Mettre à jour
            </Button>
          )}
        </div>

        <div>
          <Label>Produits :</Label>
          <ul className="list-disc ml-6">
            {order.orderItems.map((p: OrderItem, i: number) => (
              <li key={i}>
                {p.quantity}x {p.productId}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetails;
