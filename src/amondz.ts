import Cookies from "js-cookie";

type InfoPayload = {
  storeId: number;
};

type ListPayload = {
  exceptAllCount: boolean;
  startIndex: number;
};

const getCompanyInfo = (body: InfoPayload) =>
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
  });

const getCompanyList = (body: ListPayload) =>
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
  });

async function main() {
  let _csv = "";
  throw await getCompanyList({
    startIndex: 0,
    exceptAllCount: true,
  });
}

main().catch(console.error);
