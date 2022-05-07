async function loadGoodsPage(goodsNo: string) {
  const goodsPage = document.createElement("iframe");
  goodsPage.setAttribute(
    "style",
    "height:0;width:0;border:0;border:none;visibility:hidden;"
  );
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
  brandPage.src = "https://www.musinsa.com/brands/" + brandName;
  document.body.appendChild(brandPage);
  await new Promise((resolve) => brandPage.addEventListener("load", resolve));
  return brandPage;
}

async function main() {
  let brandNames: string[] = [];
  document
    .querySelectorAll<HTMLElement>("#brand_list_area a[data-code]")
    .forEach(function (_anchor) {
      if (_anchor.dataset["code"]) {
        brandNames.push(_anchor.dataset["code"]);
      }
    });
  brandNames.slice(0, 1).map(loadBrandPage);
}

main().catch(console.error);
