import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OrderItem = {
  productId: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  color?: string;
  size?: string;
};

export type OrderStatus = "Новый" | "Собран" | "В доставке" | "Доставлен" | "Отменён";

export type Order = {
  id: string;
  createdAt: number;
  items: OrderItem[];
  total: number;
  bonusesEarned: number;
  bonusesUsed: number;
  status: OrderStatus;
  customer: string;
  address: string;
};

type OrdersState = {
  orders: Order[];
  createOrder: (o: Omit<Order, "id" | "createdAt" | "status">) => Order;
  setStatus: (id: string, status: OrderStatus) => void;
  removeOrder: (id: string) => void;
};

const NOW = Date.now();
const DAY = 86400000;

// Seed a few mock orders so admin/account pages are not empty on first visit.
const SEED: Order[] = [
  {
    id: "YD-1042",
    createdAt: NOW - DAY * 2,
    items: [
      { productId: "p1", name: "Прогулочная коляска Nordic Cloud", image: "", price: 89900, qty: 1 },
      { productId: "p6", name: "Бутылочка антиколиковая 240 мл", image: "", price: 1490, qty: 2 },
    ],
    total: 92880,
    bonusesEarned: 4644,
    bonusesUsed: 0,
    status: "Доставлен",
    customer: "Ольга К.",
    address: "Москва, Тверская 12",
  },
  {
    id: "YD-1041",
    createdAt: NOW - DAY * 5,
    items: [{ productId: "p3", name: "Плюшевый мишка Théo", image: "", price: 4590, qty: 1 }],
    total: 4590,
    bonusesEarned: 229,
    bonusesUsed: 0,
    status: "В доставке",
    customer: "Иван П.",
    address: "СПб, Невский 88",
  },
  {
    id: "YD-1040",
    createdAt: NOW - DAY * 8,
    items: [
      { productId: "p2", name: "Кроватка-трансформер Ivory", image: "", price: 54900, qty: 1 },
      { productId: "p8", name: "Плед вязаный Cloud Knit", image: "", price: 6490, qty: 1 },
    ],
    total: 61390,
    bonusesEarned: 3069,
    bonusesUsed: 500,
    status: "Собран",
    customer: "Анна М.",
    address: "Казань, Баумана 3",
  },
  {
    id: "YD-1039",
    createdAt: NOW - DAY * 11,
    items: [{ productId: "p4", name: "Радужная пирамидка Montessori", image: "", price: 3290, qty: 3 }],
    total: 9870,
    bonusesEarned: 493,
    bonusesUsed: 0,
    status: "Новый",
    customer: "Дмитрий С.",
    address: "Екатеринбург, Ленина 24",
  },
];

export const useOrders = create<OrdersState>()(
  persist(
    (set) => ({
      orders: SEED,
      createOrder: (o) => {
        const order: Order = {
          ...o,
          id: `YD-${Math.floor(1043 + Math.random() * 900)}`,
          createdAt: Date.now(),
          status: "Новый",
        };
        set((s) => ({ orders: [order, ...s.orders] }));
        return order;
      },
      setStatus: (id, status) =>
        set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) })),
      removeOrder: (id) => set((s) => ({ orders: s.orders.filter((o) => o.id !== id) })),
    }),
    { name: "youdo-orders" },
  ),
);
