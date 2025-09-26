// Church Color Palette - Extracted from Design
// This file provides easy access to the custom church colors

export const churchColors = {
    // Primary Colors
    primary: '#001B48',      // Dark Blue
    secondary: '#02457A',    // Medium Dark Blue
    accent: '#08BABE',       // Bright Blue/Cyan
    light: '#97CADB',        // Light Blue
    pale: '#D6E8EE',         // Very Light Blue/Off-white

    // Extended Palette
    darker: '#000F2E',       // Darker Blue
    ultraLight: '#F0F8FA',   // Ultra Light Blue

    // Gradients
    gradients: {
        primary: 'linear-gradient(135deg, #001B48 0%, #02457A 50%, #08BABE 100%)',
        subtle: 'linear-gradient(135deg, #D6E8EE 0%, #97CADB 100%)',
        accent: 'linear-gradient(135deg, #08BABE 0%, #97CADB 100%)',
    },

    // Tailwind Classes
    classes: {
        primary: 'text-[#001B48]',
        secondary: 'text-[#02457A]',
        accent: 'text-[#08BABE]',
        light: 'text-[#97CADB]',
        pale: 'text-[#D6E8EE]',

        bgPrimary: 'bg-[#001B48]',
        bgSecondary: 'bg-[#02457A]',
        bgAccent: 'bg-[#08BABE]',
        bgLight: 'bg-[#97CADB]',
        bgPale: 'bg-[#D6E8EE]',

        borderPrimary: 'border-[#001B48]',
        borderSecondary: 'border-[#02457A]',
        borderAccent: 'border-[#08BABE]',
        borderLight: 'border-[#97CADB]',
        borderPale: 'border-[#D6E8EE]',
    }
};

// CSS Custom Properties for use in styles
export const churchCSSVars = `
  :root {
    --church-primary: #001B48;
    --church-secondary: #02457A;
    --church-accent: #08BABE;
    --church-light: #97CADB;
    --church-pale: #D6E8EE;
    --church-darker: #000F2E;
    --church-ultra-light: #F0F8FA;
  }
`;

export default churchColors;
