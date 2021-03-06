import Cookies from "js-cookie";
import _ from "lodash";
import { collection2csv, downloadBlob, string2blob } from "./utils";

const BRAND_SIZE = 30;

type ResWithData<T> = {
  data: T;
};

type InfoPayload = {
  storeId: number;
};

type ListPayload = {
  exceptAllCount: boolean;
  startIndex: number;
};

type BrandStoreInfo = {
  storeId: number;
  storeName: string;
};

type BrandInfo = {
  asPhone: string;
  brandName: string;
  companyAddress: string;
  email: string;
  kakaoAccount: string;
  returnAddress: string;
};

type BrandListData = {
  allBrandCount: number;
  allBrandList: BrandStoreInfo[];
  topBrandList: any[];
};

const getBrandInfo = (body: InfoPayload): Promise<ResWithData<BrandInfo>> =>
  fetch("https://api.amondz.com/api/brand/detail/info/web/v1", {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,la;q=0.6",
      "cache-control": "no-cache",
      "content-type": "application/json;charset=UTF-8",
      "device-type": "2",
      os: "Mac",
      "page-view": "9",
      pragma: "no-cache",
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-key": "null",
      uuid: Cookies.get("amondz_uuid"),
    } as HeadersInit,
    referrer: "https://www.amondz.com/",
    referrerPolicy: "strict-origin-when-cross-origin",
    method: "POST",
    mode: "cors",
    credentials: "include",
    body: JSON.stringify(body),
  }).then((res) => res.json());

const getBrandList = (body: ListPayload): Promise<ResWithData<BrandListData>> =>
  fetch("https://api.amondz.com/api/brand/list/pagination/web/v1", {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,la;q=0.6",
      "cache-control": "no-cache",
      "content-type": "application/json;charset=UTF-8",
      "device-type": "2",
      os: "Mac",
      "page-view": "4",
      pragma: "no-cache",
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-key": "null",
      uuid: Cookies.get("amondz_uuid"),
    } as HeadersInit,
    referrer: "https://www.amondz.com/",
    referrerPolicy: "strict-origin-when-cross-origin",
    method: "POST",
    mode: "cors",
    credentials: "include",
    body: JSON.stringify(body),
  }).then((res) => res.json());

async function main() {
  let _csv = "";
  let startIndex = 0;
  let brands: BrandStoreInfo[] = [];
  let allCount = Number.MAX_SAFE_INTEGER;

  console.log(Cookies.get("amondz_uuid"));

  for (; startIndex < allCount; startIndex += BRAND_SIZE) {
    const { data } = await getBrandList({ exceptAllCount: false, startIndex });
    allCount = data.allBrandCount;
    brands = brands.concat(data.allBrandList);
  }

  const brandsInfos: (BrandInfo & BrandStoreInfo)[] = [];

  const _brandRequests = brands.map((brand) =>
    getBrandInfo({ storeId: brand.storeId }).then(({ data }) => {
      brandsInfos.push({
        ...brand,
        ...data,
      });
    })
  );

  for (const _brandRequest of _brandRequests) {
    await _brandRequest;
  }

  const csv = collection2csv<BrandInfo & BrandStoreInfo>(brandsInfos);
  const csvBlob = string2blob(csv);
  downloadBlob(csvBlob, `store_list_amondz_${Date.now().toString(16)}.csv`);
}

main().then(console.log).catch(console.error);
