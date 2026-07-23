async function test() {
  const keys = [
    "facetValues",
    "facetValue",
    "facets",
    "facet",
    "facetValueList",
    "facetValuesList",
    "facetFilter",
    "facetFilters"
  ];

  for (const k of keys) {
    try {
      const res = await fetch('https://api.dskashmir.com/hp/itemsbyfacetvalues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          catalogName: "PRINTERS",
          countryCode: "IN",
          languageCode: "EN",
          outputHierarchyLevel: "Product",
          pageNumber: 1,
          pageSize: 2,
          requestor: "DSKASHMIR-PRO",
          [k]: ["category:PRINTERSS"]
        })
      });
      const data = await res.json();
      console.log(`Key: "${k}" -> Status: ${res.status}`);
      if (res.status === 200) {
        console.log(`  Success! hierarchyNodes count: ${Object.keys(data.hierarchyNodes || {}).length}`);
        return;
      } else {
        console.log(`  Error: ${data.desc?.StatusMessage || JSON.stringify(data)}`);
      }
    } catch (err) {
      console.error(err);
    }
  }
}

test();
