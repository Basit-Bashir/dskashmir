async function test() {
  const cases = [
    { catalogName: "LAPTOPS", facetValues: ["category:PRINTERSS"] },
    { catalogName: "Laptops", facetValues: ["category:PRINTERSS"] },
    { catalogName: "LAPTOPS", facetValues: ["category:PRINTERS"] }
  ];

  for (const c of cases) {
    try {
      const res = await fetch('https://api.dskashmir.com/hp/itemsbyfacetvalues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countryCode: "IN",
          languageCode: "EN",
          outputHierarchyLevel: "Product",
          pageNumber: 1,
          pageSize: 2,
          requestor: "DSKASHMIR-PRO",
          ...c
        })
      });
      console.log(`catalogName: ${c.catalogName}, facetValues: ${JSON.stringify(c.facetValues)} -> Status: ${res.status}`);
      const data = await res.json();
      if (res.status === 200) {
        console.log(`  Success! hierarchyNodes count: ${Object.keys(data.hierarchyNodes || {}).length}`);
      } else {
        console.log(`  Error: ${data.desc?.StatusMessage || JSON.stringify(data)}`);
      }
    } catch (err) {
      console.error(err);
    }
  }
}

test();
