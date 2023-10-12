// import "server-only";
import { Locale } from "./next-i18next.config";

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries: any = {
  en: () =>
    import("@/app/dictionaries/en.json").then((module) => module.default),
  vi: () =>
    import("@/app/dictionaries/vi.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.en();
