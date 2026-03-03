# Task A — Orders Summary

## Goal
Implement a function that returns a summary of orders grouped by either day or customer.

## Function to implement
getOrdersSummary({ data, from, to, groupBy, minAmount })

## Inputs
- data: array of orders (see tests/fixtures.json)
- from: YYYY-MM-DD (inclusive)
- to: YYYY-MM-DD (inclusive)
- groupBy: "day" or "customer"
- minAmount (optional): number. Minimum computed order amount.

## Domain Rules
- Date filter applies to orderDate (inclusive).
- Computed order amount = sum(quantity * unitPrice) across lineItems.
- If minAmount is provided, include only orders with computedAmount >= minAmount.
- Group key:
  - day: YYYY-MM-DD derived from orderDate
  - customer: customerId
- Aggregates per group:
  - count (number of orders)
  - totalAmount (sum of computed amounts)
  - avgAmount = totalAmount / count
- Sort results by key ascending.

## Return format
{
  groupBy: "day" | "customer",
  results: [
    { key: string, count: number, totalAmount: number, avgAmount: number }
  ]
}
