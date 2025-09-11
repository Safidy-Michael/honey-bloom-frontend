import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EditProduct = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
  });

  useEffect(() => {
    // TODO: fetch API with id
    setForm({
      name: "Produit exemple",
      description: "Description exemple",
      price: "100",
      stock: "50",
      image: "https://via.placeholder.com/150",
    });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📌 Produit mis à jour:", form);
    // TODO: call API
  };

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
            <Input name="description" value={form.description} onChange={handleChange} required />
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
            <Input name="image" value={form.image} onChange={handleChange} />
          </div>
          <Button type="submit" className="w-full">Mettre à jour</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditProduct;