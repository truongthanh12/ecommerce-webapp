interface DictionaryEntry {
  homeHeader: string;
  homeContent: string;
  aboutHeader: string;
  aboutContent: string;
}

export const dictionary: Record<string, DictionaryEntry> = {
  en: {
    homeHeader: "Home",
    homeContent: "Welcome to my home.",
    aboutHeader: "About Me",
    aboutContent:
      "Here is some information about me. English is my primary language.",
  },
  vi: {
    homeHeader: "Trang chủ",
    homeContent: "Mừng bạn đến với TapHoa",
    aboutHeader: "About me",
    aboutContent: "Hehehe about me.",
  },
};
