const { getOrdersSummary } = require("../src/report");
const data = require("./fixtures.json");

function byKey(results) {
  return results.reduce((acc, r) => {
    acc[r.key] = r;
    return acc;
  }, {});
}

describe("Task A - getOrdersSummary", () => {
  test("groups by day within inclusive date range", () => {
    const out = getOrdersSummary({
      data,
      from: "2026-01-10",
      to: "2026-01-12",
      groupBy: "day"
    });

    expect(out.groupBy).toBe("day");
    expect(out.results.map(r => r.key)).toEqual(["2026-01-10", "2026-01-11", "2026-01-12"]);

    const map = byKey(out.results);

    // 2026-01-10: o1=30, o2=20 => count=2 total=50 avg=25
    expect(map["2026-01-10"]).toEqual({ key: "2026-01-10", count: 2, totalAmount: 50, avgAmount: 25 });

    // 2026-01-11: o3=50
    expect(map["2026-01-11"]).toEqual({ key: "2026-01-11", count: 1, totalAmount: 50, avgAmount: 50 });

    // 2026-01-12: o4=30, o5=20 => total=50 avg=25
    expect(map["2026-01-12"]).toEqual({ key: "2026-01-12", count: 2, totalAmount: 50, avgAmount: 25 });
  });

  test("groups by customer within inclusive date range", () => {
    const out = getOrdersSummary({
      data,
      from: "2026-01-10",
      to: "2026-01-12",
      groupBy: "customer"
    });

    expect(out.groupBy).toBe("customer");
    expect(out.results.map(r => r.key)).toEqual(["cust_1", "cust_2", "cust_3"]);

    const map = byKey(out.results);

    // cust_1: o1=30, o3=50 => total=80 avg=40
    expect(map["cust_1"]).toEqual({ key: "cust_1", count: 2, totalAmount: 80, avgAmount: 40 });

    // cust_2: o2=20, o5=20 => total=40 avg=20
    expect(map["cust_2"]).toEqual({ key: "cust_2", count: 2, totalAmount: 40, avgAmount: 20 });

    // cust_3: o4=30 => total=30 avg=30
    expect(map["cust_3"]).toEqual({ key: "cust_3", count: 1, totalAmount: 30, avgAmount: 30 });
  });

  test("applies minAmount AFTER computing totals", () => {
    const out = getOrdersSummary({
      data,
      from: "2026-01-10",
      to: "2026-01-12",
      groupBy: "day",
      minAmount: 30
    });

    // In range:
    // o1=30 include, o2=20 exclude, o3=50 include, o4=30 include, o5=20 exclude
    expect(out.results.map(r => r.key)).toEqual(["2026-01-10", "2026-01-11", "2026-01-12"]);

    const map = byKey(out.results);
    expect(map["2026-01-10"]).toEqual({ key: "2026-01-10", count: 1, totalAmount: 30, avgAmount: 30 });
    expect(map["2026-01-11"]).toEqual({ key: "2026-01-11", count: 1, totalAmount: 50, avgAmount: 50 });
    expect(map["2026-01-12"]).toEqual({ key: "2026-01-12", count: 1, totalAmount: 30, avgAmount: 30 });
  });

  test("date range is inclusive on both ends", () => {
    const out = getOrdersSummary({
      data,
      from: "2026-01-10",
      to: "2026-01-10",
      groupBy: "day"
    });

    // only o1 and o2
    expect(out.results).toEqual([
      { key: "2026-01-10", count: 2, totalAmount: 50, avgAmount: 25 }
    ]);
  });

  test("results are sorted by key ascending", () => {
    const out = getOrdersSummary({
      data,
      from: "2026-01-10",
      to: "2026-01-14",
      groupBy: "customer"
    });

    // should be lexicographic ascending
    expect(out.results.map(r => r.key)).toEqual(["cust_1", "cust_2", "cust_3"]);
  });
});
