import { components } from "./components";
import { primary, themeColors } from "./themeColors";
import { typography } from "./typography";
const THEMES = {
  GIFT: "GIFT",
  HEALTH: "HEALTH",
  DEFAULT: "DEFAULT",
  GROCERY: "GROCERY",
  FURNITURE: "FURNITURE",
};
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
};

/*
WE CREATED MULTIPLE THEME OPTIONS FOR DIFFERENT SHOP VARIATION.

YOU CAN JUST KEEP [THEMES.DEFAULT] AND REMOVE OTHER THEME OPTIONS.
*/
const themesOptions = {
  [THEMES.DEFAULT]: {
    typography,
    breakpoints,
    components: {
      ...components,
    },
    palette: {
      primary: {
        ...primary,
        light: primary[100],
      },
      ...themeColors,
    },
  },
};
const themeOptions = (publicRuntimeConfig: any, pathname: string) => {
  let themeOptions;

  const updateTheme = (themeName: string) => {
    publicRuntimeConfig.theme = themeName;
    themeOptions = themesOptions[publicRuntimeConfig.theme];
  };
  switch (pathname) {
    case "/":
      break;
    default:
      themeOptions = themesOptions[publicRuntimeConfig.theme];
      updateTheme(THEMES.DEFAULT);
      break;
  }

  return themeOptions;
};
export default themeOptions;
