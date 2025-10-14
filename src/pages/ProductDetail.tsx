import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { apiClient, Product } from "@/lib/api";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiClient.getProduct(id!);
        setProduct(data);
      } catch (err) {
        console.error("❌ Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Chargement...</p>;
  if (!product)
    return (
      <p className="text-center mt-10 text-destructive">
        Produit non trouvé
      </p>
    );

  return (
    <motion.div
      className="max-w-3xl mx-auto mt-10 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
          {product.description && (
            <CardDescription>{product.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video rounded-md overflow-hidden bg-muted">
            <img
              src={product.imageUrl || "https://via.placeholder.com/400x300"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold">{product.price} Ariary</p>
            <p
              className={`px-2 py-1 rounded ${
                product.stock > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              Stock: {product.stock}
            </p>
          </div>
          <Button
            variant="gradient"
            className="w-full"
            onClick={() => navigate("/shop")}
          >
            Retour à la boutique
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductDetail;
