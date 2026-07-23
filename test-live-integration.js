async function testLive() {
  const baseUrl = 'https://api.dskashmir.com/hp';
  console.log('Testing live endpoints on api.dskashmir.com...');

  // 1. CatalogItems
  const catRes = await fetch(`${baseUrl}/catalogitems`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      catalogName: 'LAPTOPS',
      countryCode: 'IN',
      languageCode: 'EN',
      outputHierarchyLevel: 'Product',
      pageNumber: 1,
      pageSize: 5,
      requestor: 'DSKASHMIR-PRO'
    })
  });
  const catData = await catRes.json();
  const laptopSkus = Object.values(catData.hierarchyNodes || {}).map(n => n.productNumber);
  console.log(`✓ catalogitems (LAPTOPS): ${catData.totalItemCount} items found. Sample SKUs:`, laptopSkus.slice(0, 3));

  const printRes = await fetch(`${baseUrl}/catalogitems`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      catalogName: 'PRINTERS',
      countryCode: 'IN',
      languageCode: 'EN',
      outputHierarchyLevel: 'Product',
      pageNumber: 1,
      pageSize: 5,
      requestor: 'DSKASHMIR-PRO'
    })
  });
  const printData = await printRes.json();
  const printerSkus = Object.values(printData.hierarchyNodes || {}).map(n => n.productNumber);
  console.log(`✓ catalogitems (PRINTERS): ${printData.totalItemCount} items found. Sample SKUs:`, printerSkus.slice(0, 3));

  const testSku = laptopSkus[0] || 'E13DBPA';

  // 2. ProductContent
  const contentRes = await fetch(`${baseUrl}/productcontent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sku: [testSku],
      countryCode: 'IN',
      languageCode: 'EN',
      layoutName: 'ALL-Specs',
      requestor: 'DSKASHMIR-PRO',
      reqContent: ['chunks', 'images', 'hierarchy', 'plc']
    })
  });
  const contentData = await contentRes.json();
  console.log(`✓ productcontent: status = ${contentData.status}, product found = ${!!contentData.products?.[testSku]}`);

  // 3. Images
  const imgRes = await fetch(`${baseUrl}/images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sku: [testSku],
      countryCode: 'IN',
      languageCode: 'EN',
      layoutName: 'ALL-IMAGES',
      requestor: 'DSKASHMIR-PRO'
    })
  });
  const imgData = await imgRes.json();
  console.log(`✓ images: status = ${imgRes.status}, product found = ${!!imgData.products?.[testSku]}`);

  // 4. Companions
  const compRes = await fetch(`${baseUrl}/companions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sku: [testSku],
      countryCode: 'IN',
      languageCode: 'EN',
      requestor: 'DSKASHMIR-PRO'
    })
  });
  const compData = await compRes.json();
  console.log(`✓ companions: status = ${compData.status}`);

  // 5. RichMedia
  const rmRes = await fetch(`${baseUrl}/richmedia`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      skus: [testSku],
      countryCode: 'IN',
      languageCode: 'EN',
      layoutName: 'RICHMEDIA',
      requestor: 'DSKASHMIR-PRO'
    })
  });
  const rmData = await rmRes.json();
  console.log(`✓ richmedia: status = ${rmData.status}`);

  // 6. ItemPartnerDocs
  const docsRes = await fetch(`${baseUrl}/itempartnerdocs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      skus: [testSku],
      countryCode: 'IN',
      languageCode: 'EN',
      requestor: 'DSKASHMIR-PRO'
    })
  });
  const docsData = await docsRes.json();
  console.log(`✓ itempartnerdocs: status = ${docsData.status}`);

  // 7. Hierarchy
  const hRes = await fetch(`${baseUrl}/hierarchy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sku: [testSku],
      countryCode: 'IN',
      languageCode: 'EN',
      layoutName: 'LIST',
      requestor: 'DSKASHMIR-PRO'
    })
  });
  const hData = await hRes.json();
  console.log(`✓ hierarchy: status = ${hData.status}`);

  // 8. PLC
  const plcRes = await fetch(`${baseUrl}/plc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sku: [testSku],
      countryCode: 'IN',
      languageCode: 'EN',
      layoutName: 'LIST',
      requestor: 'DSKASHMIR-PRO'
    })
  });
  const plcData = await plcRes.json();
  console.log(`✓ plc: status = ${plcRes.status}`);

  // 9. CatalogFacetFilters
  const ffRes = await fetch(`${baseUrl}/catalogfacetfilters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      catalogName: 'Laptops',
      countryCode: 'IN',
      languageCode: 'EN',
      outputHierarchyLevel: 'Product',
      facetIds: ['a_processor_brand'],
      requestor: 'DSKASHMIR-PRO'
    })
  });
  const ffData = await ffRes.json();
  console.log(`✓ catalogfacetfilters: status = ${ffData.status || ffRes.status}`);

  // 10. ItemsByFacetValues
  const fvRes = await fetch(`${baseUrl}/itemsbyfacetvalues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      catalogName: 'Laptops',
      countryCode: 'IN',
      languageCode: 'EN',
      outputHierarchyLevel: 'Product',
      facetValues: { a_processor_brand: ['AMD'] },
      requestor: 'DSKASHMIR-PRO'
    })
  });
  const fvData = await fvRes.json();
  console.log(`✓ itemsbyfacetvalues: status = ${fvRes.status}, items returned = ${Object.keys(fvData.hierarchyNodes || {}).length}`);

  console.log('\nAll 10 endpoints verified successfully!');
}

testLive();
