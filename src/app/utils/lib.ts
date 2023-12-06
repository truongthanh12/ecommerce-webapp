import ceil from "lodash/ceil";
import {
  format,
  isValid,
  parseISO,
  differenceInMinutes,
  addDays,
} from "date-fns";
import { FieldValue, Timestamp, serverTimestamp } from "firebase/firestore";

/**
 * GET THE DIFFERENCE DATE FORMAT
 * @param  date - which is created comment data
 * @returns string - formatted from now
 */

function getDateDifference(date: Timestamp) {
  const jsDate = date?.toDate();

  let diff = differenceInMinutes(new Date(), jsDate);
  if (diff < 60) return diff + " minutes ago";
  diff = ceil(diff / 60);
  if (diff < 24) return `${diff} hour${diff === 0 ? "" : "s"} ago`;
  diff = ceil(diff / 24);
  if (diff < 30) return `${diff} day${diff === 0 ? "" : "s"} ago`;
  diff = ceil(diff / 30);
  if (diff < 12) return `${diff} month${diff === 0 ? "" : "s"} ago`;
  diff = diff / 12;
  return "seconds ago";
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

function calculateDiscount(price = 0, discount: number, voucher?: number) {
  const afterDiscount = Number(
    price - price * (discount / 100) - (voucher || 0)
  );
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

export function addAccents(str = "") {
  const accentMap = {
    a: "áàâäã",
    e: "éèêë",
    i: "íìîï",
    o: "óòôöõ",
    u: "úùûü",
    c: "ç",
    n: "ñ",
    // Add more mappings as needed
  };

  // Loop through each character in the string
  return str
    .split("")
    .map((char) => {
      for (const [accent, chars] of Object.entries(accentMap)) {
        if (chars.includes(char)) {
          return accent; // Replace accented character with the base character
        }
      }
      return char; // If not accented, keep the character as is
    })
    .join("");
}

export function capitalizeStr(str = "") {
  const arr = str?.split(" ");

  // Loop through each element of the array and capitalize the first letter.
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }

  // Join the array back into a string and return it.
  return arr.join(" ");
}

export function objectToQueryString(obj: any, isMulti = false) {
  const excludedKeys = ["lang", "slug"];

  if (isMulti) {
    return Object.keys(obj)
      .filter((key) => !excludedKeys.includes(key))
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
  }

  return Object.keys(obj)
    .filter((key) => !excludedKeys.includes(key))
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join("&");
}

export const formatDate = (dateString: string) => {
  // Check if the date string is valid
  if (!dateString || !isValid(parseISO(dateString))) {
    return "Invalid Date";
  }

  return format(new Date(dateString), "dd/MM/yyyy");
};

export function tryFormatDate(date: any) {
  try {
    return format(new Date(date.seconds * 1000), "MMM dd, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}

export function calculateFutureDate(baseDate: any, date = 3) {
  try {
    const futureDate = addDays(baseDate, date);
    const formattedFutureDate = format(futureDate, "MMM dd, yyyy");
    return formattedFutureDate;
  } catch (error) {
    console.error("Error calculating future date:", error);
    return "";
  }
}
export function formatNumberWithThousandSeparators(number: number) {
  if (number >= 1000 && number < 10000) {
    return (number / 1000).toFixed(1) + "k";
  } else if (number >= 10000) {
    return (number / 1000).toFixed(0) + "k";
  } else {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
}

export function calculateAverageRating(comments: any) {
  if (comments.length === 0) {
    return 0;
  }

  const totalRating = comments.reduce(
    (sum: any, comment: any) => sum + comment.rating,
    0
  );
  return totalRating / comments.length;
}

export const formatTimestamp = (): FieldValue => {
  return serverTimestamp();
};
