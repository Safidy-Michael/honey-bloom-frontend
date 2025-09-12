import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient, Product, CreateProductDto } from "@/lib/api";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateProductDto>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    imageUrl: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const product: Product = await apiClient.getProduct(Number(id));
        setForm({
          name: product.name,
          description: product.description || "",
          price: product.price,
          stock: product.stock,
          imageUrl: product.imageUrl || "",
        });
      } catch (err) {
        console.error("❌ Impossible de charger le produit:", err);
        alert("Produit introuvable");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await apiClient.updateProduct(Number(id), form);
      alert("✅ Produit mis à jour !");
      navigate(`/products/${id}`);
    } catch (err) {
      console.error("❌ Erreur mise à jour produit:", err);
      alert("Impossible de mettre à jour le produit");
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <Card className="max-w-xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Modifier le produit</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nom</Label>
            <Input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <Label>Description</Label>
            <Input name="description" value={form.description} onChange={handleChange} />
          </div>
          <div>
            <Label>Prix</Label>
            <Input type="number" name="price" value={form.price} onChange={handleChange} required />
          </div>
          <div>
            <Label>Stock</Label>
            <Input type="number" name="stock" value={form.stock} onChange={handleChange} required />
          </div>
          <div>
            <Label>Image URL</Label>
            <Input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
          </div>
          <Button type="submit" className="w-full">Mettre à jour</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditProduct;
