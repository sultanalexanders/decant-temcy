export interface Product {
  product_id: number;
  brand: string;
  product_name: string;
  concentration: string;
  top_notes: string;
  middle_notes: string;
  base_notes: string;
  price_1ml: number;
  price_2ml: number;
  price_3ml: number;
  price_5ml: number;
  image_filename: string;
}

export const products: Product[] = [
  {
    product_id: 1,
    brand: "HMNS Parfum",
    product_name: "Above The Cloud",
    concentration: "EDP",
    top_notes: "Bergamot, Lemon",
    middle_notes: "Jasmine, Amber",
    base_notes: "Musk, Cedarwood",
    price_1ml: 9400,
    price_2ml: 16000,
    price_3ml: 22000,
    price_5ml: 29000,
    image_filename: "hmns_above.png",
  },
  {
    product_id: 2,
    brand: "Afnan",
    product_name: "Turathi Electric",
    concentration: "EDP",
    top_notes: "Pear, Mandarin Orange, Bergamot",
    middle_notes: "Apple, Cedarwood",
    base_notes: "Vanilla, Amber, Musk",
    price_1ml: 9400,
    price_2ml: 16000,
    price_3ml: 22000,
    price_5ml: 29000,
    image_filename: "default.png",
  },
];

export const sizeOptions = [
  { label: "1ml", key: "price_1ml" as const },
  { label: "2ml", key: "price_2ml" as const },
  { label: "3ml", key: "price_3ml" as const },
  { label: "5ml", key: "price_5ml" as const },
];

export function getPrice(product: Product, sizeKey: Product[keyof Product] extends number ? keyof Product : never): number {
  return product[sizeKey] as number;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}
