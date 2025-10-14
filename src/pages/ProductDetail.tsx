import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiClient, Product } from "@/lib/api";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiClient.getProduct(id);
        setProduct(data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto mt-10 animate-pulse space-y-4">
        <div className="h-64 bg-muted rounded-md"></div>
        <div className="h-6 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-8 bg-muted rounded"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <Card className="max-w-xl mx-auto mt-10 text-center">
        <CardContent className="py-16">
          <p className="text-lg font-semibold mb-4">Produit non trouvé</p>
          <Link to="/products">
            <Button className="w-full">Retour à la boutique</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto mt-10"
    >
      <Card>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.img
            src={product.imageUrl || "https://via.placeholder.com/400"}
            alt={product.name}
            className="w-full h-auto rounded-md"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <p>
            <strong>Description:</strong> {product.description || "Aucune description"}
          </p>
          <p>
            <strong>Prix:</strong> {product.price.toFixed(2)} Ariary
          </p>
          <p>
            <strong>Stock:</strong> {product.stock}
          </p>
          <Link to="/products">
            <Button className="mt-3 w-full">Retour à la boutique</Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductDetail;
