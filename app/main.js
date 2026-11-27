// Wiring for the deal finder: toolbar state, counts and rendering.
//
// One job: connect the toolbar controls to the deal list. Filtering
// and sorting live in filters.js, markup lives in render.js.

import { DEALS, CHECKED_AT } from "./deals.js";
import {
  applyToolbar,
  countNewLows,
  biggestDiscount,
} from "./filters.js";
import { renderDeals, renderCompare } from "./render.js";

const state = {
  query: "",
  category: "all",
  store: "all",
  minDiscount: 0,
  newLowsOnly: false,
  sort: "discount",
};

function fillOptions(select, values) {
  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value === "all" ? "All" : value;
    select.appendChild(option);
  }
}

function refresh() {
  const shown = applyToolbar(DEALS, state);
  renderDeals(document.getElementById("deals"), shown);
  const count = document.getElementById("result-count");
  count.textContent =
    shown.length +
    " of " +
    DEALS.length +
    " deals · " +
    countNewLows(shown) +
    " new lows";
  const summary = document.getElementById("filter-summary");
  const bits = [];
  if (state.query) bits.push('matching "' + state.query + '"');
  if (state.category !== "all") bits.push(state.category);
  if (state.store !== "all") bits.push("at " + state.store);
  if (state.minDiscount > 0) bits.push(state.minDiscount + "% off or more");
  if (state.newLowsOnly) bits.push("new lows only");
  summary.textContent = bits.length
    ? "Showing: " + bits.join(" · ")
    : "Showing all deals, biggest discount first.";
}

function init() {
  const categories = ["all", ...[...new Set(DEALS.map((d) => d.category))].sort()];
  const stores = ["all", ...[...new Set(DEALS.map((d) => d.store))].sort()];
  fillOptions(document.getElementById("category"), categories);
  fillOptions(document.getElementById("store"), stores);

  document.getElementById("stat-deals").textContent = String(DEALS.length);
  document.getElementById("stat-lows").textContent = String(countNewLows(DEALS));
  document.getElementById("stat-best").textContent =
    "-" + biggestDiscount(DEALS) + "%";
  document.getElementById("stat-checked").textContent = CHECKED_AT;
  document.getElementById("checked-line").textContent =
    "Every price on this page was read at the store or in a roundup naming the store on " +
    CHECKED_AT +
    ". Prices move fast on Black Friday — check the price at checkout before you buy.";

  renderCompare(document.getElementById("compare"), DEALS);

  document.getElementById("search").addEventListener("input", (event) => {
    state.query = event.target.value;
    refresh();
  });
  document.getElementById("category").addEventListener("change", (event) => {
    state.category = event.target.value;
    refresh();
  });
  document.getElementById("store").addEventListener("change", (event) => {
    state.store = event.target.value;
    refresh();
  });
  document.getElementById("min-discount").addEventListener("change", (event) => {
    state.minDiscount = Number(event.target.value);
    refresh();
  });
  document.getElementById("new-lows").addEventListener("change", (event) => {
    state.newLowsOnly = event.target.checked;
    refresh();
  });
  document.getElementById("sort").addEventListener("change", (event) => {
    state.sort = event.target.value;
    refresh();
  });
  document.getElementById("clear-filters").addEventListener("click", () => {
    state.query = "";
    state.category = "all";
    state.store = "all";
    state.minDiscount = 0;
    state.newLowsOnly = false;
    state.sort = "discount";
    document.getElementById("search").value = "";
    document.getElementById("category").value = "all";
    document.getElementById("store").value = "all";
    document.getElementById("min-discount").value = "0";
    document.getElementById("new-lows").checked = false;
    document.getElementById("sort").value = "discount";
    refresh();
  });

  refresh();
}

init();
