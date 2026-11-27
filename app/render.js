// Rendering for the deal finder: cards, verdict pills and the
// same-product comparison strip. One job: turn deal objects into
// DOM. All money is formatted here, in one place.

import { discountPercent, savingDollars } from "./filters.js";

export function money(value) {
  return "$" + value.toFixed(2).replace(/\.00$/, "");
}

const VERDICT_LABEL = {
  "new-low": "NEW LOW",
  strong: "STRONG PRICE",
  routine: "ROUTINE DEAL",
};

export function verdictLabel(verdict) {
  return VERDICT_LABEL[verdict] || "CHECKED DEAL";
}

export function dealCard(deal) {
  const pct = discountPercent(deal);
  const saved = savingDollars(deal);
  const card = document.createElement("article");
  card.className = "card verdict-" + deal.verdict;
  card.dataset.dealId = deal.id;

  const top = document.createElement("div");
  top.className = "card-top";

  const cat = document.createElement("span");
  cat.className = "card-cat";
  cat.textContent = deal.category;
  top.appendChild(cat);

  const badge = document.createElement("span");
  badge.className = "card-pct";
  badge.textContent = "-" + pct + "%";
  top.appendChild(badge);
  card.appendChild(top);

  const name = document.createElement("h3");
  name.className = "card-name";
  name.textContent = deal.name;
  card.appendChild(name);

  const store = document.createElement("p");
  store.className = "card-store";
  store.textContent = deal.store;
  card.appendChild(store);

  const prices = document.createElement("p");
  prices.className = "card-prices";
  const sale = document.createElement("span");
  sale.className = "card-sale";
  sale.textContent = money(deal.sale);
  prices.appendChild(sale);
  const was = document.createElement("span");
  was.className = "card-was";
  was.textContent = "was " + money(deal.usual);
  prices.appendChild(was);
  const save = document.createElement("span");
  save.className = "card-save";
  save.textContent = "save " + money(saved);
  prices.appendChild(save);
  card.appendChild(prices);

  const verdict = document.createElement("p");
  verdict.className = "card-verdict";
  const pill = document.createElement("span");
  pill.className = "pill pill-" + deal.verdict;
  pill.textContent = verdictLabel(deal.verdict);
  verdict.appendChild(pill);
  const ev = document.createElement("span");
  ev.className = "card-evidence";
  ev.textContent = deal.evidence;
  verdict.appendChild(ev);
  card.appendChild(verdict);

  if (deal.note) {
    const note = document.createElement("p");
    note.className = "card-note";
    note.textContent = deal.note;
    card.appendChild(note);
  }

  const meta = document.createElement("p");
  meta.className = "card-meta";
  meta.textContent = "Checked " + deal.checked + " · Source: " + deal.source;
  card.appendChild(meta);

  const link = document.createElement("a");
  link.className = "card-link";
  link.href = deal.link;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "View at " + deal.store + " →";
  card.appendChild(link);

  return card;
}

export function renderDeals(container, deals) {
  container.textContent = "";
  if (deals.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent =
      "No deals match those filters. Clear the search or lower the discount filter.";
    container.appendChild(empty);
    return;
  }
  for (const deal of deals) container.appendChild(dealCard(deal));
}

// Same product at more than one store: one row per store, cheapest first.
export function renderCompare(container, deals) {
  container.textContent = "";
  const groups = new Map();
  for (const deal of deals) {
    if (!groups.has(deal.group)) groups.set(deal.group, []);
    groups.get(deal.group).push(deal);
  }
  const multi = [...groups.values()].filter((g) => g.length > 1);
  multi.sort((a, b) => Math.min(...a.map((d) => d.sale)) - Math.min(...b.map((d) => d.sale)));
  for (const group of multi) {
    const rows = group.slice().sort((a, b) => a.sale - b.sale);
    const block = document.createElement("div");
    block.className = "compare-block";
    const title = document.createElement("h3");
    title.className = "compare-name";
    title.textContent = rows[0].name;
    block.appendChild(title);
    for (const deal of rows) {
      const row = document.createElement("p");
      row.className = "compare-row";
      const best = deal.sale === rows[0].sale;
      const store = document.createElement("span");
      store.className = "compare-store";
      store.textContent = deal.store;
      row.appendChild(store);
      const price = document.createElement("span");
      price.className = "compare-price";
      price.textContent = money(deal.sale);
      row.appendChild(price);
      const flag = document.createElement("span");
      flag.className = "compare-flag";
      if (best && group.length > 1 && rows[0].sale < rows[rows.length - 1].sale) {
        flag.textContent = "cheapest";
      } else if (best) {
        flag.textContent = "same price at both stores";
      } else {
        flag.textContent =
          "+" + money(deal.sale - rows[0].sale) + " for the 1TB model";
      }
      row.appendChild(flag);
      const link = document.createElement("a");
      link.className = "compare-link";
      link.href = deal.link;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "View →";
      row.appendChild(link);
      block.appendChild(row);
    }
    container.appendChild(block);
  }
}
