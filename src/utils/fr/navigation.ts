
const navBarLinks = [
  { name: "Home", url: "/fr" },
  { name: "Projects", url: "/fr/products?filter=past" },
  { name: "Projets futurs", url: "/fr/products?filter=future" },
  { name: "History", url: "/fr/services" },
  { name: "Contact", url: "/fr/contact" },
  { name: "Login", url: "/admin/login" },
];

const footerLinks = [

  {
    section: "Sportiv Club",
    links: [
      { name: "About us", url: "#" },
      { name: "Projects", url: "/fr/products" },
      { name: "History", url: "/fr/services" },
      { name: "Contact", url: "/fr/contact" },

    ],
  },
];

const socialLinks = {
  facebook: "https://www.facebook.com/bcbcredintavoluntari",
  instagram: "https://www.instagram.com/",
  youtube: "https://www.youtube.com/",
  tiktok: "https://www.tiktok.com/",
};

export default {
  navBarLinks,
  footerLinks,
  socialLinks,
};