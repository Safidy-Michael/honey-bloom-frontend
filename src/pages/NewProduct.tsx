import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const NewProduct = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📌 Nouveau produit créé:", form);
    // TODO: call API
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
          <Button type="submit" className="w-full">Créer</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewProduct;