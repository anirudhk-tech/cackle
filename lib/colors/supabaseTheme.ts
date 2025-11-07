import { colors } from "./colors";

export const customSupabaseTheme = {
  default: {
    colors: {
      brand: colors.primary,
      brandAccent: colors.primaryAccent,
      brandButtonText: colors.buttonText,
      defaultButtonBackground: colors.primary,
      defaultButtonBackgroundHover: colors.primaryAccent,
      defaultText: colors.textLight,
      defaultBackground: colors.backgroundLight,
      defaultSubText: colors.textSubtle,
    },
  },
  dark: {
    colors: {
      brand: colors.primary,
      brandAccent: colors.primaryAccent,
      brandButtonText: colors.buttonText,
      defaultButtonBackground: "#2e2e2e",
      defaultButtonBackgroundHover: "#3e3e3e",
      defaultText: colors.textLight,
      defaultBackground: colors.backgroundDark,
      defaultSubText: colors.textSubtle,
    },
  },
  evenDarker: {
    colors: {
      brand: colors.primary,
      brandAccent: colors.primaryAccent,
      brandButtonText: colors.buttonText,
      defaultButtonBackground: "#1e1e1e",
      defaultButtonBackgroundHover: "#2e2e2e",
      defaultText: colors.textLight,
      defaultBackground: "#0f0f0f",
      defaultSubText: colors.textSubtle,
    },
  },
};
