import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api";

const NewProduct = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const product = await apiClient.createProduct({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        imageUrl: form.image || undefined,
      });

      setSuccess(`✅ Produit créé avec succès : ${product.name}`);
      setForm({ name: "", description: "", price: "", stock: "", image: "" });

      if (import.meta.env.DEV) {
        console.log("📌 Nouveau produit créé:", product);
      }
    } catch (err: any) {
      setError(err.message || "❌ Erreur lors de la création du produit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Créer un nouveau produit</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nom</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Prix</Label>
            <Input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Stock</Label>
            <Input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Image URL</Label>
            <Input name="image" value={form.image} onChange={handleChange} />
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Création en cours..." : "Créer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewProduct;
