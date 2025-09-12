import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient, Product } from "@/lib/api";
import { Button } from "@/components/ui/button";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiClient.getProduct(Number(id));
        setProduct(data);
      } catch (err) {
        console.error("❌ Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <Card className="max-w-xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <img src={product.imageUrl || "https://via.placeholder.com/150"} alt={product.name} className="w-full h-auto" />
        <p><strong>Description:</strong> {product.description}</p>
        <p><strong>Price:</strong> {product.price} Ariary</p>
        <p><strong>Stock:</strong> {product.stock}</p>
        <Link to="/products">
          <Button className="mt-3 w-full">Back to Products</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProductDetail;