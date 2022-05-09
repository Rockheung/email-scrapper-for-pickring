async function loadGoodsPage(goodsNo: string) {
  const goodsPage = document.createElement("iframe");
  goodsPage.setAttribute(
    "style",
    "height:0;width:0;border:0;border:none;visibility:hidden;"
  );
  goodsPage.setAttribute("sandbox", "allow-same-origin");
  goodsPage.src = "https://www.musinsa.com/app/goods/" + goodsNo;
  document.body.appendChild(goodsPage);
  await new Promise((resolve) => goodsPage.addEventListener("load", resolve));
  return goodsPage;
}

async function loadBrandPage(brandName: string) {
  const brandPage = document.createElement("iframe");
  brandPage.setAttribute(
    "style",
    "height:0;width:0;border:0;border:none;visibility:hidden;"
  );
  brandPage.setAttribute("sandbox", "allow-same-origin");
  brandPage.src = "https://www.musinsa.com/brands/" + brandName;
  document.body.appendChild(brandPage);
  await new Promise((resolve) => brandPage.addEventListener("load", resolve));
  return brandPage;
}

async function main() {
  let _csv = "";
  let brandNames: string[] = [];
  const brandInfos = [];
  document
    .querySelectorAll<HTMLElement>("#brand_list_area a[data-code]")
    .forEach(function (_anchor) {
      if (_anchor.dataset["code"]) {
        brandNames.push(_anchor.dataset["code"]);
      }
    });
  for (const brandName of brandNames) {
    const brandPageIframe = await loadBrandPage(brandName);

    const goodsNo =
      brandPageIframe.contentWindow?.document.querySelector<HTMLElement>(
        "#searchList .li_box *[data-goodsno]"
      )?.dataset["goodsno"];

    if (typeof goodsNo === "undefined") {
      console.warn("brand:", brandName, "may have no goods.");
      continue;
    }

    const goodsPageIframe = await loadGoodsPage(goodsNo);

    const sellerInfoSection =
      goodsPageIframe.contentWindow?.document.querySelectorAll<HTMLElement>(
        ".sallerinfo_detail_section dl"
      );
    if (typeof sellerInfoSection === "undefined") {
      console.warn("No seller info.");
      continue;
    }
    let _brandInfo: any = {
      brandName,
    };
    sellerInfoSection.forEach((listItem, idx) => {
      const _key = listItem.querySelector("dt")?.innerText || idx + "";
      const _value = listItem.querySelector("dd")?.innerText || "";
      _brandInfo[_key] = _value;
    });
    brandInfos.push(_brandInfo);

    brandPageIframe.remove();
    goodsPageIframe.remove();
    console.log(
      "Collected:",
      Math.floor((brandInfos.length / brandNames.length) * 100),
      "%"
    );
  }

  let keys;

  for (const _brand of brandInfos) {
    const brandInfo = await _brand;
    if (!_csv.length) {
      keys = Object.keys(brandInfo) as Array<keyof typeof brandInfo>;
      _csv += keys.join(",");
      _csv += "\n";
    }
    _csv +=
      (keys
        ?.map((key) => {
          if (typeof brandInfo[key] === "string") {
            return `"${brandInfo[key]}"`;
          } else if (Array.isArray(brandInfo[key])) {
            return (brandInfo[key] as unknown as string[]).join("|");
          }
          return brandInfo[key];
        })
        .join(",") || "") + "\n";
  }

  const enc = new TextEncoder();
  const csvText = enc.encode(_csv);
  const csvBlob = new Blob([csvText], { type: "octet/stream" });
  const csvUrl = URL.createObjectURL(csvBlob);

  const anchor = document.createElement("a");
  anchor.href = csvUrl;
  anchor.download = `store_list_musinsa_jewelry_${Date.now().toString(16)}.csv`;
  anchor.click();
}

main().catch(console.error);
