import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiClient, Product } from "@/lib/api";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: { product: Product; quantity: number }[];
  clearCart: () => void;
}

const CheckoutModal = ({ isOpen, onClose, cartItems, clearCart }: CheckoutModalProps) => {
  const { toast } = useToast();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!address.trim() || !phone.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "L'adresse et le téléphone sont obligatoires.",
      });
      return;
    }

    const items = cartItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    setIsSubmitting(true);
    try {
      await apiClient.createOrder({ userId: "currentUserId", items, address, phone, note });
      toast({
        title: "Commande réussie",
        description: "Votre commande a été passée avec succès.",
      });
      clearCart();
      onClose();
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de passer la commande.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // empêcher la fermeture quand on clique sur le modal
      >
        <h2 className="text-xl font-bold mb-4">Valider votre commande</h2>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Adresse *</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ex: 12 Rue Exemple, Antananarivo"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Téléphone *</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ex: 033 12 345 67"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Note (facultative)</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ex: Livraison entre 8h et 12h"
          />
        </div>

        <button
          className={`w-full py-2 px-4 rounded text-white ${
            isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "En cours..." : "Passer la commande"}
        </button>

        <button
          className="w-full mt-2 py-2 px-4 rounded bg-gray-300 hover:bg-gray-400"
          onClick={onClose}
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default CheckoutModal;
