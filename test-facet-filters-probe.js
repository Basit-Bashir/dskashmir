async function test() {
  const payloads = [
    {
      catalogName: "PRINTERS",
      countryCode: "IN",
      languageCode: "EN",
      requestor: "DSKASHMIR-PRO"
    },
    {
      catalogName: "PRINTERS",
      countryCode: "IN",
      languageCode: "EN",
      layoutName: "ALL-Specs",
      requestor: "DSKASHMIR-PRO"
    },
    {
      catalogName: "Laptops",
      countryCode: "IN",
      languageCode: "EN",
      layoutName: "ALL-Specs",
      requestor: "DSKASHMIR-PRO"
    }
  ];

  for (const [idx, p] of payloads.entries()) {
    try {
      const res = await fetch('https://api.dskashmir.com/hp/catalogfacetfilters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      const data = await res.json();
      console.log(`Payload ${idx} -> Status: ${res.status}`);
      console.log(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(err);
    }
  }
}

test();
