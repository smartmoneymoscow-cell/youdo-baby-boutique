import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./products";

type CartItem = {
  productId: string;
  qty: number;
  color?: string;
  size?: string;
};

type UIState = {
  cartOpen: boolean;
  favOpen: boolean;
  chatOpen: boolean;
  activeProductId: string | null;
  cartBump: number;
  setCartOpen: (v: boolean) => void;
  setFavOpen: (v: boolean) => void;
  setChatOpen: (v: boolean) => void;
  setActiveProduct: (id: string | null) => void;
  bumpCart: () => void;
};

export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  favOpen: false,
  chatOpen: false,
  activeProductId: null,
  cartBump: 0,
  setCartOpen: (v) => set({ cartOpen: v }),
  setFavOpen: (v) => set({ favOpen: v }),
  setChatOpen: (v) => set({ chatOpen: v }),
  setActiveProduct: (id) => set({ activeProductId: id }),
  bumpCart: () => set((s) => ({ cartBump: s.cartBump + 1 })),
}));

type ShopState = {
  cart: CartItem[];
  favorites: string[];
  addToCart: (p: Product, opts?: { color?: string; size?: string; qty?: number }) => void;
  updateQty: (idx: number, qty: number) => void;
  removeFromCart: (idx: number) => void;
  toggleFavorite: (id: string) => void;
  clearCart: () => void;
};

export const useShop = create<ShopState>()(
  persist(
    (set) => ({
      cart: [],
      favorites: [],
      addToCart: (p, opts) =>
        set((s) => {
          const color = opts?.color ?? p.colors[0]?.name;
          const size = opts?.size ?? p.sizes?.[0];
          const qty = opts?.qty ?? 1;
          const idx = s.cart.findIndex(
            (c) => c.productId === p.id && c.color === color && c.size === size,
          );
          if (idx >= 0) {
            const next = [...s.cart];
            next[idx] = { ...next[idx], qty: next[idx].qty + qty };
            return { cart: next };
          }
          return { cart: [...s.cart, { productId: p.id, qty, color, size }] };
        }),
      updateQty: (idx, qty) =>
        set((s) => {
          const next = [...s.cart];
          if (qty <= 0) next.splice(idx, 1);
          else next[idx] = { ...next[idx], qty };
          return { cart: next };
        }),
      removeFromCart: (idx) =>
        set((s) => {
          const next = [...s.cart];
          next.splice(idx, 1);
          return { cart: next };
        }),
      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),
      clearCart: () => set({ cart: [] }),
    }),
    { name: "youdo-shop" },
  ),
);
