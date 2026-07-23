async function test() {
  const tags = ["category", "categoryName", "categoryname", "Category", "CategoryName"];
  const values = ["PRINTERSS", "printerss", "PRINTERS", "printers", "PRINTER", "printer"];

  for (const tag of tags) {
    for (const val of values) {
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
            facetValues: [`${tag}:${val}`]
          })
        });
        if (res.status === 200) {
          const data = await res.json();
          console.log(`SUCCESS! tag: "${tag}", value: "${val}" -> nodes count: ${Object.keys(data.hierarchyNodes || {}).length}`);
          return; // Stop if we found one!
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
  console.log("Done checking all combinations.");
}

test();
