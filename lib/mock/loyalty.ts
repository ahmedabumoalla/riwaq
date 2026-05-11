export type LoyaltyTier = "ذهبي" | "فضي" | "برونزي";

export type LoyaltyCustomer = {
  id: string;
  name: string;
  phone: string;
  points: number;
  lastVisit: string;
  tier: LoyaltyTier;
};

export const initialLoyaltyCustomers: LoyaltyCustomer[] = [
  {
    id: "lc1",
    name: "نورة العجمي",
    phone: "+966 55 102 3344",
    points: 1840,
    lastVisit: "١٠ مايو ٢٠٢٦",
    tier: "ذهبي",
  },
  {
    id: "lc2",
    name: "فيصل الدوسري",
    phone: "+966 50 887 1209",
    points: 620,
    lastVisit: "٩ مايو ٢٠٢٦",
    tier: "فضي",
  },
  {
    id: "lc3",
    name: "لينا الشمري",
    phone: "+966 54 221 0098",
    points: 210,
    lastVisit: "٨ مايو ٢٠٢٦",
    tier: "برونزي",
  },
  {
    id: "lc4",
    name: "خالد القحطاني",
    phone: "+966 56 400 7781",
    points: 945,
    lastVisit: "١٠ مايو ٢٠٢٦",
    tier: "فضي",
  },
];

export type RewardRulesState = {
  pointsPerDiscount: number;
  discountPercent: number;
  freeDrinkThreshold: number;
  specialGiftThreshold: number;
};

export const defaultRewardRules: RewardRulesState = {
  pointsPerDiscount: 100,
  discountPercent: 10,
  freeDrinkThreshold: 250,
  specialGiftThreshold: 500,
};
