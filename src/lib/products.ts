import stroller from "@/assets/product-stroller.jpg";
import crib from "@/assets/product-crib.jpg";
import bear from "@/assets/product-bear.jpg";
import stacker from "@/assets/product-stacker.jpg";
import clothes from "@/assets/product-clothes.jpg";
import bottle from "@/assets/product-bottle.jpg";
import blocks from "@/assets/product-blocks.jpg";
import blanket from "@/assets/product-blanket.jpg";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: "Коляски" | "Мебель" | "Игрушки" | "Одежда" | "Питание" | "Текстиль";
  ageGroup: "0-6 мес" | "6-12 мес" | "1-3 года" | "3-6 лет";
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestseller?: boolean;
  description: string;
  colors: { name: string; hex: string }[];
  sizes?: string[];
};

export const PRODUCTS: Product[] = [
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
    description:
      "Уютный вязаный плед из мериносовой шерсти с добавлением органического хлопка. Идеален для дома и прогулок.",
    colors: [
      { name: "Ваниль", hex: "#f4ead2" },
      { name: "Небесный", hex: "#cfe0f2" },
    ],
    sizes: ["80×100", "100×120"],
  },
];

export const CATEGORIES: Product["category"][] = [
  "Коляски",
  "Мебель",
  "Игрушки",
  "Одежда",
  "Питание",
  "Текстиль",
];

export const AGE_GROUPS: Product["ageGroup"][] = [
  "0-6 мес",
  "6-12 мес",
  "1-3 года",
  "3-6 лет",
];

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(n) + " ₽";
