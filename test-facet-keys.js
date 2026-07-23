async function test() {
  const tags = [
    "category",
    "categoryName",
    "category_name",
    "categoryname",
    "prod_category",
    "product_category",
    "productCategory",
    "catalog",
    "catalogName",
    "catalog_name"
  ];

  for (const tag of tags) {
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
          facetValues: [`${tag}:PRINTERSS`]
        })
      });
      const data = await res.json();
      console.log(`Tag: "${tag}" -> Status: ${res.status}`);
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
