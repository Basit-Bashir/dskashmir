async function testCatalogs() {
  const baseUrl = 'https://api.dskashmir.com/hp';
  const catalogs = [
    'Printers', 'Desktops', 'Laptops', 'Storage', 'Solutions', 'Software',
    'Services', 'Scanners', 'POS', 'Monitors', 'Supplies', 'Industries',
    'HyperX', 'Entertainment', 'Accessories', 'Desktops_Business',
    'Workstations', 'Desktops_Home', 'Laptops_Home', 'DesignJet_Printers',
    'Industrial_Printers', 'Carepacks', 'Chromebooks', 'Ink_Toner_Cartridges',
    'Printer_Supplies', 'Paper'
  ];

  console.log(`Testing ${catalogs.length} catalogs on api.dskashmir.com...\n`);

  for (const cat of catalogs) {
    try {
      const res = await fetch(`${baseUrl}/catalogitems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          catalogName: cat.toUpperCase(),
          countryCode: 'IN',
          languageCode: 'EN',
          outputHierarchyLevel: 'Product',
          pageNumber: 1,
          pageSize: 2,
          requestor: 'DSKASHMIR-PRO'
        })
      });
      const data = await res.json();
      const count = data.totalItemCount ?? Object.keys(data.hierarchyNodes || {}).length;
      console.log(`✓ [${cat}] (${res.status}) -> ${count} items found`);
    } catch (err) {
      console.error(`✗ [${cat}] ERROR:`, err.message);
    }
  }
}

testCatalogs();
