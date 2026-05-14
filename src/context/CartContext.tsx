import { createContext, useContext, useState, ReactNode } from "react";
import { Product, formatRupiah } from "../data/products";

export type SizeKey = "price_1ml" | "price_2ml" | "price_3ml" | "price_5ml";

export interface CartItem {
  product: Product;
  sizeKey: SizeKey;
  sizeLabel: string;
  quantity: number;
  unitPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, sizeKey: SizeKey, sizeLabel: string) => void;
  removeFromCart: (productId: number, sizeKey: SizeKey) => void;
  updateQuantity: (productId: number, sizeKey: SizeKey, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: string;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, sizeKey: SizeKey, sizeLabel: string) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.product.product_id === product.product_id && i.sizeKey === sizeKey
      );
      if (existing) {
        return prev.map((i) =>
          i.product.product_id === product.product_id && i.sizeKey === sizeKey
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [
        ...prev,
        {
          product,
          sizeKey,
          sizeLabel,
          quantity: 1,
          unitPrice: product[sizeKey] as number,
        },
      ];
    });
  };

  const removeFromCart = (productId: number, sizeKey: SizeKey) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.product.product_id === productId && i.sizeKey === sizeKey)
      )
    );
  };

  const updateQuantity = (productId: number, sizeKey: SizeKey, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, sizeKey);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.product_id === productId && i.sizeKey === sizeKey
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = formatRupiah(items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0));

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
