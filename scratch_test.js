const { fetchCatalogProducts, fetchCatalogSummary } = require('./lib/hp-api');

async function main() {
  console.log("Testing fetchCatalogProducts for Printers...");
  const res = await fetchCatalogProducts({ catalogName: "Printers", pageSize: 20 });
  console.log("Returned products count:", res.products.length, "Total:", res.total);
  console.log("Product SKUs:", res.products.map(p => ({ sku: p.productNumber || p.id, name: p.name, category: p.category })));
}

main().catch(console.error);
