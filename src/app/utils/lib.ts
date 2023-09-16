import ceil from "lodash/ceil";
import { differenceInMinutes } from "date-fns";

/**
 * GET THE DIFFERENCE DATE FORMAT
 * @param  date - which is created comment data
 * @returns string - formatted from now
 */

function getDateDifference(date: string) {
  let diff = differenceInMinutes(new Date(), new Date(date));
  if (diff < 60) return diff + " minutes ago";
  diff = ceil(diff / 60);
  if (diff < 24) return `${diff} hour${diff === 0 ? "" : "s"} ago`;
  diff = ceil(diff / 24);
  if (diff < 30) return `${diff} day${diff === 0 ? "" : "s"} ago`;
  diff = ceil(diff / 30);
  if (diff < 12) return `${diff} month${diff === 0 ? "" : "s"} ago`;
  diff = diff / 12;
  return `${diff.toFixed(1)} year${ceil(diff) === 0 ? "" : "s"} ago`;
}

/**
 * RENDER THE PRODUCT PAGINATION INFO
 * @param page - CURRENT PAGE NUMBER
 * @param perPageProduct - PER PAGE PRODUCT LIST
 * @param totalProduct - TOTAL PRODUCT NUMBER
 * @returns
 */

function renderProductCount(
  page: number,
  perPageProduct: number,
  totalProduct: number
) {
  let startNumber = (page - 1) * perPageProduct;
  let endNumber = page * perPageProduct;
  if (endNumber > totalProduct) {
    endNumber = totalProduct;
  }
  return `Showing ${startNumber - 1}-${endNumber} of ${totalProduct} products`;
}

/**
 * CALCULATE PRICE WITH PRODUCT DISCOUNT THEN RETURN NEW PRODUCT PRICES
 * @param  price - PRODUCT PRICE
 * @param  discount - DISCOUNT PERCENT
 * @returns - RETURN NEW PRICE
 */

function calculateDiscount(price = 0, discount: number) {
  const afterDiscount = Number(price - price * (discount / 100));
  return currency(afterDiscount);
}

/**
 * CHANGE THE CURRENCY FORMAT
 * @param  price - PRODUCT PRICE
 * @param  fraction - HOW MANY FRACTION WANT TO SHOW
 * @returns - RETURN PRICE WITH CURRENCY
 */

function currency(price = 0, fraction: number = 0) {
  const formatCurrency = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: fraction,
    minimumFractionDigits: fraction,
  });
  return formatCurrency.format(price);
}
export { renderProductCount, calculateDiscount, currency, getDateDifference };

export function formatToSlug(str = "") {
  // Chuyển hết sang chữ thường và xóa dấu
  const formatStr = str
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .split(",")
    .join("");

  return formatStr;
}

// Function to remove accents from Vietnamese text
export function removeAccents(str = "") {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function captitalizeStr(str = "") {
  const arr = str.split(" ");

  //loop through each element of the array and capitalize the first letter.

  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
}

export function objectToQueryString(obj: any, isMulti = false) {
  if (isMulti)
    return Object.keys(obj)
      .map((key) => {
        const value = obj[key];
        if (Array.isArray(value)) {
          return `${encodeURIComponent(key)}=${encodeURIComponent(
            value.join(",")
          )}`;
        } else {
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
      })
      .join("&");
  return Object.keys(obj)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]))
    .join("&");
}
