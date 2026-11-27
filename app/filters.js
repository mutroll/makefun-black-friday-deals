// Filtering and sorting for the deal list.
//
// One job: given the full deal list and the toolbar state, return the
// deals to show, in the order to show them. No DOM work lives here.

export function discountPercent(deal) {
  return Math.round(((deal.usual - deal.sale) / deal.usual) * 100);
}

export function savingDollars(deal) {
  return Math.round((deal.usual - deal.sale) * 100) / 100;
}

export const SORTS = {
  discount: "Biggest discount",
  saving: "Biggest saving ($)",
  newlow: "New lows first",
  price: "Lowest price first",
};

export function sortDeals(deals, sortKey) {
  const list = deals.slice();
  if (sortKey === "discount") {
    list.sort((a, b) => discountPercent(b) - discountPercent(a));
  } else if (sortKey === "saving") {
    list.sort((a, b) => savingDollars(b) - savingDollars(a));
  } else if (sortKey === "newlow") {
    const rank = (d) => (d.verdict === "new-low" ? 0 : 1);
    list.sort(
      (a, b) => rank(a) - rank(b) || discountPercent(b) - discountPercent(a),
    );
  } else if (sortKey === "price") {
    list.sort((a, b) => a.sale - b.sale);
  }
  return list;
}

export function filterDeals(deals, state) {
  const query = state.query.trim().toLowerCase();
  return deals.filter((deal) => {
    if (query) {
      const hay = (deal.name + " " + deal.store + " " + deal.category).toLowerCase();
      if (!hay.includes(query)) return false;
    }
    if (state.category !== "all" && deal.category !== state.category) return false;
    if (state.store !== "all" && deal.store !== state.store) return false;
    if (state.minDiscount > 0 && discountPercent(deal) < state.minDiscount) return false;
    if (state.newLowsOnly && deal.verdict !== "new-low") return false;
    return true;
  });
}

export function applyToolbar(deals, state) {
  return sortDeals(filterDeals(deals, state), state.sort);
}

export function countNewLows(deals) {
  return deals.filter((d) => d.verdict === "new-low").length;
}

export function biggestDiscount(deals) {
  return deals.reduce((best, d) => Math.max(best, discountPercent(d)), 0);
}
