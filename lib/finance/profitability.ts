import { sub, sum, safeDiv } from "./money";

export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED" | "RETURNED";

export interface PnLLine {
  status: OrderStatus;
  grossSales: number;
  sellerDiscount: number;
  refunds: number; // partial refunds on a completed order
  cogs: number | null; // null means the product cost is missing
  marketplaceFees: number; // commission plus service fee
  packaging: number;
}

export interface PnLInput {
  lines: PnLLine[];
  adSpend: number;
  otherExpenses: number;
  attributedAdSales: number | null; // as reported by the marketplace
}

export interface PnLResult {
  grossSales: number;
  discounts: number;
  refunds: number;
  netSales: number;
  cogs: number;
  grossProfit: number;
  marketplaceFees: number;
  packaging: number;
  contributionBeforeAds: number;
  adSpend: number;
  contributionAfterAds: number;
  otherExpenses: number;
  netOperatingProfit: number;
  grossMargin: number | null;
  netMargin: number | null;
  roas: number | null;
  recognizedOrders: number;
  excludedOrders: number;
  missingCostOrders: number;
  isComplete: boolean;
}

// Policy: only COMPLETED orders are recognized. Pending, cancelled and
// returned orders are kept for reconciliation but never counted as revenue.
export function computePnL(input: PnLInput): PnLResult {
  const recognized = input.lines.filter((l) => l.status === "COMPLETED");
  const grossSales = sum(recognized.map((l) => l.grossSales));
  const discounts = sum(recognized.map((l) => l.sellerDiscount));
  const refunds = sum(recognized.map((l) => l.refunds));
  const netSales = sub(sub(grossSales, discounts), refunds);

  const missingCostOrders = recognized.filter((l) => l.cogs === null).length;
  const cogs = sum(recognized.map((l) => l.cogs ?? 0));
  const marketplaceFees = sum(recognized.map((l) => l.marketplaceFees));
  const packaging = sum(recognized.map((l) => l.packaging));

  const grossProfit = sub(netSales, cogs);
  const contributionBeforeAds = sub(sub(grossProfit, marketplaceFees), packaging);
  const contributionAfterAds = sub(contributionBeforeAds, input.adSpend);
  const netOperatingProfit = sub(contributionAfterAds, input.otherExpenses);

  return {
    grossSales,
    discounts,
    refunds,
    netSales,
    cogs,
    grossProfit,
    marketplaceFees,
    packaging,
    contributionBeforeAds,
    adSpend: input.adSpend,
    contributionAfterAds,
    otherExpenses: input.otherExpenses,
    netOperatingProfit,
    grossMargin: safeDiv(grossProfit, netSales),
    netMargin: safeDiv(netOperatingProfit, netSales),
    roas:
      input.attributedAdSales === null
        ? null
        : safeDiv(input.attributedAdSales, input.adSpend),
    recognizedOrders: recognized.length,
    excludedOrders: sub(input.lines.length, recognized.length),
    missingCostOrders,
    isComplete: missingCostOrders === 0,
  };
}

export interface BundleComponentCost {
  unitCost: number | null;
  quantity: number;
}

// Returns null when any component cost is unknown. Costs are never invented.
export function bundleCogs(
  components: BundleComponentCost[],
  extraDirectCost = 0
): number | null {
  if (components.length === 0) return null;
  if (components.some((c) => c.unitCost === null)) return null;
  const parts = components.map((c) => (c.unitCost as number) * c.quantity);
  return sum(parts) + extraDirectCost;
}
