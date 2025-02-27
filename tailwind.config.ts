import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base:'hsl(49,92%,54%)',
       primaryBlue:'#0C202E',
       secondaryBlue:'#040b11',
      },
      maxWidth:{
        max:'1200px',
      },
      screens: {
        zr: "0px",
        mb: "430px",
        sm: "640px",
        md: "768px",
        lg: "991px",
        xl: "1280px",
      },
      fontFamily:{
        poppins:"Poppins",
      }
    },
  },
  plugins: [],
} satisfies Config;
