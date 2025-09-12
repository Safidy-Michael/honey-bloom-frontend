import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Panier vide",
        description: "Ajoutez des produits au panier avant de passer commande.",
      });
      return;
    }

    try {
      setIsCheckingOut(true);
      
      // Get current user profile to get user ID
      const userProfile = await apiClient.getProfile();
      
      // Create order with cart items
      const orderItems = items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }));

      const order = await apiClient.createOrder({
        userId: userProfile.id,
        items: orderItems
      });

      clearCart();
      toast({
        title: "Commande créée",
        description: `Votre commande #${order.id} a été créée avec succès.`,
      });
      
      navigate('/orders');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la commande. Veuillez réessayer.",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mon Panier</h1>
          <p className="text-muted-foreground">
            Gérez vos articles et passez commande
          </p>
        </div>
        
        <Card className="border-border/40">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Votre panier est vide</h3>
            <p className="text-muted-foreground text-center mb-4">
              Parcourez notre boutique et ajoutez des produits à votre panier.
            </p>
            <Button variant="gradient" onClick={() => navigate('/shop')}>
              Continuer mes achats
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mon Panier</h1>
          <p className="text-muted-foreground">
            {getTotalItems()} article{getTotalItems() > 1 ? 's' : ''} dans votre panier
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/shop')}>
          Continuer mes achats
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.product.id} className="border-border/40">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  {item.product.imageUrl && (
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Product Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.product.description}
                        </p>
                        {item.product.badge && (
                          <Badge variant="secondary" className="mt-1">
                            {item.product.badge}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          max={item.product.stock}
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value) || 1;
                            if (newQuantity <= item.product.stock) {
                              updateQuantity(item.product.id, newQuantity);
                            }
                          }}
                          className="w-16 text-center"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {item.product.price.toFixed(2)}€ × {item.quantity}
                        </div>
                        <div className="font-semibold text-primary">
                          {(item.product.price * item.quantity).toFixed(2)}€
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle>Résumé de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sous-total ({getTotalItems()} articles)</span>
                  <span>{getTotalPrice().toFixed(2)}Arriary</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Livraison</span>
                  <span className="text-green-600">Gratuite</span>
                </div>
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{getTotalPrice().toFixed(2)}€</span>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                variant="gradient"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {isCheckingOut ? 'Traitement...' : 'Passer commande'}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={clearCart}
              >
                Vider le panier
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;