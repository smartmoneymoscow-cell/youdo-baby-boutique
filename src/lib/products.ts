import stroller from "@/assets/product-stroller.jpg";
import crib from "@/assets/product-crib.jpg";
import bear from "@/assets/product-bear.jpg";
import stacker from "@/assets/product-stacker.jpg";
import clothes from "@/assets/product-clothes.jpg";
import bottle from "@/assets/product-bottle.jpg";
import blocks from "@/assets/product-blocks.jpg";
import blanket from "@/assets/product-blanket.jpg";

export type Category = "Коляски" | "Мебель" | "Игрушки" | "Одежда" | "Питание" | "Текстиль";
export type AgeGroup = "0-6 мес" | "6-12 мес" | "1-3 года" | "3-6 лет";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: Category;
  ageGroup: AgeGroup;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  isNew?: boolean;
  isBestseller?: boolean;
  description: string;
  colors: { name: string; hex: string }[];
  sizes?: string[];
};

const BASE: Product[] = [
  {
    id: "p1",
    name: "Прогулочная коляска Nordic Cloud",
    brand: "YOUDO Premium",
    category: "Коляски",
    ageGroup: "0-6 мес",
    price: 89900,
    oldPrice: 109900,
    image: stroller,
    rating: 4.9,
    reviews: 214,
    stock: 34,
    isBestseller: true,
    description:
      "Прогулочная коляска премиум-класса с алюминиевой рамой, экокожей ручкой и амортизацией нового поколения. Компактно складывается одной рукой.",
    colors: [
      { name: "Кремовый", hex: "#efe4d4" },
      { name: "Графит", hex: "#3b3b40" },
      { name: "Небесный", hex: "#c9dcef" },
    ],
  },
  {
    id: "p2",
    name: "Кроватка-трансформер Ivory",
    brand: "MAISON BABY",
    category: "Мебель",
    ageGroup: "0-6 мес",
    price: 54900,
    image: crib,
    rating: 4.8,
    reviews: 128,
    stock: 12,
    isNew: true,
    description:
      "Классическая кроватка из массива бука с ортопедическим основанием. Растёт вместе с ребёнком — трансформируется в подростковую кровать.",
    colors: [
      { name: "Белый", hex: "#f7f4ee" },
      { name: "Натуральный", hex: "#d5b892" },
    ],
  },
  {
    id: "p3",
    name: "Плюшевый мишка Théo",
    brand: "Petit Ourson",
    category: "Игрушки",
    ageGroup: "0-6 мес",
    price: 4590,
    image: bear,
    rating: 5.0,
    reviews: 512,
    stock: 240,
    isBestseller: true,
    description:
      "Мягкий мишка ручной работы из органического хлопка с шёлковым бантом. Гипоаллергенный наполнитель, безопасен с рождения.",
    colors: [
      { name: "Ваниль", hex: "#f3e7cf" },
      { name: "Пудра", hex: "#e8ccc2" },
    ],
    sizes: ["25 см", "35 см", "50 см"],
  },
  {
    id: "p4",
    name: "Радужная пирамидка Montessori",
    brand: "Wooden Lab",
    category: "Игрушки",
    ageGroup: "1-3 года",
    price: 3290,
    oldPrice: 3990,
    image: stacker,
    rating: 4.9,
    reviews: 341,
    stock: 88,
    description:
      "Развивающая пирамидка из бука с натуральными пигментами. Тренирует моторику, восприятие цвета и симметрии.",
    colors: [{ name: "Пастель", hex: "#f6d6b8" }],
  },
  {
    id: "p5",
    name: "Комплект боди Organic Soft",
    brand: "YOUDO Essentials",
    category: "Одежда",
    ageGroup: "0-6 мес",
    price: 2890,
    image: clothes,
    rating: 4.7,
    reviews: 96,
    stock: 156,
    isNew: true,
    description:
      "Комплект из 3 боди из 100% органического хлопка GOTS. Плоские швы, кнопки по всей длине — легко надевается.",
    colors: [
      { name: "Ваниль", hex: "#f5ecd6" },
      { name: "Пудра", hex: "#f2d9c9" },
      { name: "Мята", hex: "#d6ecdf" },
    ],
    sizes: ["56", "62", "68", "74", "80"],
  },
  {
    id: "p6",
    name: "Бутылочка антиколиковая 240 мл",
    brand: "PureFlow",
    category: "Питание",
    ageGroup: "0-6 мес",
    price: 1490,
    image: bottle,
    rating: 4.8,
    reviews: 187,
    stock: 320,
    description:
      "Стеклянная бутылочка с силиконовой соской медленного потока и антиколиковой системой. Без BPA, выдерживает стерилизацию.",
    colors: [
      { name: "Прозрачный", hex: "#e6edf3" },
      { name: "Пудра", hex: "#f4dccf" },
    ],
    sizes: ["150 мл", "240 мл", "300 мл"],
  },
  {
    id: "p7",
    name: "Деревянный паровозик Rainbow",
    brand: "Wooden Lab",
    category: "Игрушки",
    ageGroup: "1-3 года",
    price: 5490,
    image: blocks,
    rating: 4.9,
    reviews: 273,
    stock: 42,
    isBestseller: true,
    description:
      "Классический деревянный конструктор-паровозик, окрашенный безопасными пигментами на водной основе. Развивает воображение.",
    colors: [{ name: "Мультиколор", hex: "#f2c94c" }],
  },
  {
    id: "p8",
    name: "Плед вязаный Cloud Knit",
    brand: "MAISON BABY",
    category: "Текстиль",
    ageGroup: "0-6 мес",
    price: 6490,
    image: blanket,
    rating: 4.9,
    reviews: 152,
    stock: 60,
    description:
      "Уютный вязаный плед из мериносовой шерсти с добавлением органического хлопка. Идеален для дома и прогулок.",
    colors: [
      { name: "Ваниль", hex: "#f4ead2" },
      { name: "Небесный", hex: "#cfe0f2" },
    ],
    sizes: ["80×100", "100×120"],
  },
];

export const CATEGORIES: Category[] = ["Коляски", "Мебель", "Игрушки", "Одежда", "Питание", "Текстиль"];
export const AGE_GROUPS: AgeGroup[] = ["0-6 мес", "6-12 мес", "1-3 года", "3-6 лет"];
export const BRANDS = ["YOUDO Premium", "YOUDO Essentials", "MAISON BABY", "Petit Ourson", "Wooden Lab", "PureFlow", "Nordic Nest", "Bébé Chic", "Little Cloud", "Aurora Kids"];

const NAME_PREFIX: Record<Category, string[]> = {
  Коляски: ["Nordic", "Cloud", "Sky", "Air", "Urban", "Compact", "Grand"],
  Мебель: ["Ivory", "Oak", "Nordic", "Provence", "Milano", "Petit"],
  Игрушки: ["Rainbow", "Montessori", "Wooden", "Forest", "Little Bear", "Cosmo", "Étoile"],
  Одежда: ["Organic", "Soft", "Baby", "Merino", "Cotton", "Milk", "Cloud"],
  Питание: ["Pure", "Fresh", "Silicone", "Glass", "Nature"],
  Текстиль: ["Cloud", "Knit", "Merino", "Dream", "Cozy", "Linen"],
};
const NAME_ITEM: Record<Category, string[]> = {
  Коляски: ["коляска", "трансформер", "трость", "прогулка 2-в-1", "тревел-система"],
  Мебель: ["кроватка", "комод", "пеленальный столик", "манеж", "стульчик"],
  Игрушки: ["конструктор", "пирамидка", "игровой набор", "мишка", "каталка", "лабиринт", "паровозик"],
  Одежда: ["комбинезон", "боди", "комплект", "костюмчик", "шапочка", "пижама"],
  Питание: ["бутылочка", "соска", "поильник", "тарелка", "ложка"],
  Текстиль: ["плед", "конверт", "спальный мешок", "полотенце", "простынь"],
};

// Deterministically build a large catalog (~200 items) reusing the 8 real images.
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateExtras(): Product[] {
  const rand = seededRandom(42);
  const out: Product[] = [];
  const images = [stroller, crib, bear, stacker, clothes, bottle, blocks, blanket];
  const cats: Category[] = ["Коляски", "Мебель", "Игрушки", "Одежда", "Питание", "Текстиль"];
  const catImg: Record<Category, string[]> = {
    Коляски: [stroller],
    Мебель: [crib],
    Игрушки: [bear, stacker, blocks],
    Одежда: [clothes],
    Питание: [bottle],
    Текстиль: [blanket],
  };

  for (let i = 0; i < 200; i++) {
    const cat = cats[Math.floor(rand() * cats.length)];
    const brand = BRANDS[Math.floor(rand() * BRANDS.length)];
    const age = AGE_GROUPS[Math.floor(rand() * AGE_GROUPS.length)];
    const prefix = NAME_PREFIX[cat][Math.floor(rand() * NAME_PREFIX[cat].length)];
    const item = NAME_ITEM[cat][Math.floor(rand() * NAME_ITEM[cat].length)];
    const suffix = ["Signature", "Premium", "Classic", "Essential", "Deluxe", "Kids", ""][Math.floor(rand() * 7)];
    const name = `${item.charAt(0).toUpperCase() + item.slice(1)} ${prefix}${suffix ? ` ${suffix}` : ""}`;
    const basePrice = [890, 1290, 1990, 2490, 3490, 4990, 6990, 9990, 14990, 24990, 39990, 59990, 89990][Math.floor(rand() * 13)];
    const hasDiscount = rand() > 0.6;
    const imgArr = catImg[cat] ?? images;
    out.push({
      id: `g${i + 1}`,
      name,
      brand,
      category: cat,
      ageGroup: age,
      price: basePrice,
      oldPrice: hasDiscount ? Math.round(basePrice * (1.15 + rand() * 0.35)) : undefined,
      image: imgArr[Math.floor(rand() * imgArr.length)],
      rating: Math.round((3.8 + rand() * 1.2) * 10) / 10,
      reviews: Math.floor(rand() * 900) + 5,
      stock: Math.floor(rand() * 300),
      isNew: rand() > 0.85,
      isBestseller: rand() > 0.88,
      description:
        "Премиальный товар из подборки Заказ с YouDo. Проверенное качество, безопасные материалы, оригинал от бренда.",
      colors: [
        { name: "Ваниль", hex: "#f3e7cf" },
        { name: "Небесный", hex: "#c9dcef" },
        { name: "Пудра", hex: "#e8ccc2" },
      ].slice(0, 1 + Math.floor(rand() * 3)),
      sizes: cat === "Одежда" ? ["56", "62", "68", "74", "80", "86"] : undefined,
    });
  }
  return out;
}

export const PRODUCTS: Product[] = [...BASE, ...generateExtras()];

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(n) + " ₽";
