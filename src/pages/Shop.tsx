import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, Plus, Minus, Eye, Package } from "lucide-react";
import { apiClient, Product } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Shop = () => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await apiClient.getProducts();
        setProducts(data);
        const initialQuantities: Record<number, number> = {};
        data.forEach((product) => {
          initialQuantities[product.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les produits.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, [toast]);

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    if (quantity > product.stock) {
      toast({
        variant: "destructive",
        title: "Stock insuffisant",
        description: "La quantité demandée dépasse le stock disponible.",
      });
      return;
    }
    addToCart(product, quantity);
    toast({
      title: "Produit ajouté",
      description: `${product.name} (x${quantity}) ajouté au panier.`,
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantities((prev) => ({ ...prev, [productId]: newQuantity }));
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: index * 0.1 }}
          >
            <Card className="border-border/40 animate-pulse">
              <div className="h-48 bg-muted rounded-md mb-3"></div>
              <div className="h-6 w-3/4 bg-muted rounded mb-2"></div>
              <div className="h-4 w-1/2 bg-muted rounded mb-2"></div>
              <div className="h-8 w-full bg-muted rounded"></div>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Boutique</h1>
          <p className="text-muted-foreground">
            Découvrez nos produits et ajoutez-les à votre panier
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher des produits..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <Card className="border-border/40">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun produit trouvé</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm
                ? "Aucun produit ne correspond à votre recherche."
                : "Aucun produit disponible pour le moment."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.05, type: "spring", stiffness: 250 }}
              >
                <Card className="border-border/40 hover:shadow-elegant transition-shadow">
                  <CardHeader className="pb-3 flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {product.description || "Aucune description"}
                      </CardDescription>
                    </div>
                    <Link to={`/products/${product.id}`}>
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="p-1 rounded-full bg-muted/50 cursor-pointer"
                      >
                        <Eye className="h-5 w-5 text-primary" />
                      </motion.div>
                    </Link>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {product.imageUrl && (
                      <motion.div
                        className="aspect-video rounded-md overflow-hidden bg-muted"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-primary">
                        {product.price.toFixed(2)} Ariary
                      </div>
                      <Badge
                        variant={
                          product.stock > 10
                            ? "default"
                            : product.stock > 0
                            ? "warning"
                            : "destructive"
                        }
                      >
                        Stock: {product.stock}
                      </Badge>
                    </div>
                    {product.badge && (
                      <Badge variant="secondary" className="w-fit">
                        {product.badge}
                      </Badge>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Quantité:</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(
                              product.id,
                              (quantities[product.id] || 1) - 1
                            )
                          }
                          disabled={quantities[product.id] <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {quantities[product.id] || 1}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(
                              product.id,
                              (quantities[product.id] || 1) + 1
                            )
                          }
                          disabled={quantities[product.id] >= product.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      variant="gradient"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {product.stock === 0
                        ? "Rupture de stock"
                        : "Ajouter au panier"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Shop;
