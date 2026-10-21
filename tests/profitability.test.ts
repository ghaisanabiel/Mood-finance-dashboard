import { describe, it, expect } from "vitest";
import { computePnL, bundleCogs, PnLLine } from "../lib/finance/profitability";

const done = (o: Partial<PnLLine> = {}): PnLLine => ({
  status: "COMPLETED",
  grossSales: 100000,
  sellerDiscount: 10000,
  refunds: 5000,
  cogs: 30000,
  marketplaceFees: 12000,
  packaging: 2000,
  ...o,
});

const base = { adSpend: 10000, otherExpenses: 1000, attributedAdSales: 50000 };

describe("computePnL", () => {
  it("calculates a full chain for one completed order", () => {
    const r = computePnL({ ...base, lines: [done()] });
    expect(r.netSales).toBe(85000);
    expect(r.grossProfit).toBe(55000);
    expect(r.contributionBeforeAds).toBe(41000);
    expect(r.contributionAfterAds).toBe(31000);
    expect(r.netOperatingProfit).toBe(30000);
    expect(r.roas).toBe(5);
    expect(r.isComplete).toBe(true);
  });

  it("returns N/A margins when there are no sales", () => {
    const r = computePnL({ ...base, lines: [] });
    expect(r.netMargin).toBeNull();
    expect(r.grossMargin).toBeNull();
  });

  it("returns null ROAS when ad spend is zero", () => {
    const r = computePnL({ ...base, adSpend: 0, lines: [done()] });
    expect(r.roas).toBeNull();
  });

  it("excludes cancelled, returned and pending orders", () => {
    const r = computePnL({
      ...base,
      lines: [done(), done({ status: "CANCELLED" }), done({ status: "RETURNED" }), done({ status: "PENDING" })],
    });
    expect(r.recognizedOrders).toBe(1);
    expect(r.excludedOrders).toBe(3);
    expect(r.netSales).toBe(85000);
  });

  it("handles a full refund as zero net sales", () => {
    const r = computePnL({ ...base, lines: [done({ sellerDiscount: 0, refunds: 100000 })] });
    expect(r.netSales).toBe(0);
    expect(r.netMargin).toBeNull();
  });

  it("flags missing product cost instead of guessing", () => {
    const r = computePnL({ ...base, lines: [done({ cogs: null })] });
    expect(r.isComplete).toBe(false);
    expect(r.missingCostOrders).toBe(1);
  });
});

describe("bundleCogs", () => {
  it("sums components and extra direct cost", () => {
    const c = bundleCogs(
      [{ unitCost: 15000, quantity: 1 }, { unitCost: 12000, quantity: 2 }],
      1000
    );
    expect(c).toBe(40000);
  });

  it("returns null when a component cost is missing", () => {
    expect(bundleCogs([{ unitCost: null, quantity: 1 }])).toBeNull();
  });

  it("returns null for an empty bundle", () => {
    expect(bundleCogs([])).toBeNull();
  });
});
