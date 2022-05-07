export {};

declare global {
  interface Window {
    $: JQuery;
  }
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
  console.log(
    "🚀 ~ file: musinsa-jewelry.ts ~ line 13 ~ brandNames ~ brandNames",
    brandNames
  );
}

main().catch(console.error);
