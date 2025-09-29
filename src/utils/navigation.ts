// An array of links for navigation bar
const navBarLinks = [
  { name: "Acasa", url: "/" },
  { name: "Proiecte", url: "/past-projects" },
  { name: "Despre noi", url: "/aboutUs" },
  { name: "Contact", url: "/contact" },
  { name: "Login", url: "/admin/login" },
];

export interface FooterSection {
  section: string;
  links: { name: string; url: string; }[];
  secondSection?: string;
  secondLink?: { name: string; url: string; }[];
  thirdSection?: string;
  thirdLink?: { name: string; url: string; }[];
  map?: {
    address: string;
    latitude: number;
    longitude: number;
    zoom: number;
    height: string;
    flag: string;
  };
}



const footerLinks: FooterSection[] = [
  {
    section: "Pastorul bisericii",
    links: [
      { name: "Popa Timotei", url: "#" },
    ],
    secondSection: "Donează",
    secondLink: [
      { name: "Biserica Credința", url: "#" },
      { name: "RO58CECB31336RON2030888", url: "#" },
      { name: "CEC BANK", url: "#" },
      { name: "CECEROBUXXX", url: "#" },
      { name: "RON", url: "#" },
    ],
  },
  {
    section: "Sună-ne",
    links: [
      { name: "+40788 980 747", url: "tel:+40788980747" },
    ],
    secondSection: "Lasă un mesaj",
    secondLink: [
      { name: "bisericacredintavoluntari@gmail.com", url: "mailto:bisericacredintavoluntari@gmail.com" },
    ],
  },

  {
    section: "Vizitează-ne",
    links: [
      { name: "Vă așteptăm la biserica din Voluntari", url: "https://maps.google.com/?q=Bulevardul+Voluntari+nr.+61A,+Voluntari,+Ilfov" },
    ],
    map: {
      address: "Bulevardul Voluntari nr. 61A, Voluntari, Ilfov",
      latitude: 44.48882326349935,
      longitude: 26.183719790624945,
      zoom: 16,
      height: "200px",
      flag: "🇷🇴"
    }
  },
];

// An object of links for social icons
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