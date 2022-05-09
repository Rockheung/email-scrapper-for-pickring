export type Converter<T, S> = (arg0: T) => S;

export const collection2csv = <T = object>(_collection: T[]): string => {
  let _csv = "";
  let keys: any[] = [];

  for (const _obj of _collection) {
    if (_csv.length === 0) {
      keys = Object.keys(_obj);
      _csv += keys.join(",");
      _csv += "\n";
    }
    _csv +=
      (keys
        ?.map((key: keyof typeof _obj) => {
          if (typeof _obj[key] === "undefined") {
            return "";
          } else if (typeof _obj[key] === "string") {
            return `"${_obj[key]}"`;
          } else if (Array.isArray(_obj[key])) {
            return (_obj[key] as unknown as string[]).join("|");
          }
          return _obj[key];
        })
        .join(",") || "") + "\n";
  }

  return _csv;
};

export const string2blob: Converter<string, Blob> = (_str) => {
  const enc = new TextEncoder();
  const _strText = enc.encode(_str);
  return new Blob([_strText], { type: "octet/stream" });
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const csvUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = csvUrl;
  anchor.download = filename;
  anchor.click();
};
