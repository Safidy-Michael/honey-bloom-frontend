import { useCallback, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import { apiClient, Order, OrderItem, Product } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const OrderDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState("pending");
  const [productsMap, setProductsMap] = useState<Record<string, Product>>({});

  const isAdmin = user?.role === "admin";

  const fetchOrder = useCallback(async () => {
    try {
      const data = await apiClient.getOrder(id);
      setOrder(data);
      setStatus(data.status);
      const productsData = await apiClient.getProducts();
      const map: Record<string, Product> = {};
      productsData.forEach((p) => {
        map[p.id] = p;
      });
      setProductsMap(map);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const updateStatus = async () => {
    try {
      await apiClient.patchOrder(id, { status });
      alert("✅ Statut mis à jour !");
      fetchOrder();
    } catch (err) {
      console.error(err);
      alert("⚠️ Impossible de mettre à jour le statut");
    }
  };

  if (!order) return <p>Chargement...</p>;

  return (
    <Card className="max-w-3xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Détails commande #{order.id}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p><strong>Client :</strong> {order.userId}</p>
        <p><strong>Total :</strong> {order.total} Ariary</p>
        <p>
          <strong>Statut :</strong>
          <Select value={status} onValueChange={setStatus} disabled={!isAdmin}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="en_cours">En cours</SelectItem>
              <SelectItem value="livree">Livrée</SelectItem>
              <SelectItem value="annulee">Annulée</SelectItem>
            </SelectContent>
          </Select>
        </p>
        {isAdmin && (
          <Button onClick={updateStatus} className="mt-3 w-full">
            Mettre à jour le statut
          </Button>
        )}
        <p><strong>Adresse :</strong> {order.address || "Non renseignée"}</p>
        <p><strong>Téléphone :</strong> {order.phone || "Non renseigné"}</p>
        <p><strong>Note :</strong> {order.note || "Aucune note"}</p>
        <p><strong>Créé le :</strong> {new Date(order.createdAt).toLocaleString("fr-FR")}</p>
        <div>
          <Label>Produits :</Label>
          <ul className="list-disc ml-6">
            {order.orderItems.map((item: OrderItem, i: number) => {
              const product = productsMap[item.productId];
              return (
                <li key={i}>
                  {item.quantity} x {product ? product.name : item.productId} - {(product?.price || 0) * item.quantity} Ariary
                </li>
              );
            })}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetails;
