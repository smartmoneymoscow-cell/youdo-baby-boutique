import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Bestsellers } from "@/components/site/Bestsellers";
import { Catalog } from "@/components/site/Catalog";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { FavoritesDrawer } from "@/components/site/FavoritesDrawer";
import { ProductDialog } from "@/components/site/ProductDialog";
import { ChatWidget } from "@/components/site/ChatWidget";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Заказ с YouDo — премиум магазин детских товаров" },
      {
        name: "description",
        content:
          "Премиальный B2B/B2C магазин детских товаров: коляски, кроватки, игрушки, одежда. 5 000+ SKU, оптовые цены, ИИ-консультант и доставка по России.",
      },
      { property: "og:title", content: "Заказ с YouDo — премиум магазин детских товаров" },
      {
        property: "og:description",
        content: "5 000+ товаров для детей. Оптовые цены, ИИ-консультант, быстрая доставка.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Bestsellers />
        <Catalog />
      </main>
      <Footer />
      <CartDrawer />
      <FavoritesDrawer />
      <ProductDialog />
      <ChatWidget />
      <Toaster position="top-center" richColors />
    </div>
  );
}
