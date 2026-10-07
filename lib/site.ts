export const siteConfig = {
  name: "Krishan Tours Sri Lanka",
  legalName: "Krishan Tours Sri Lanka",
  url: "https://krishantours.com",
  email: "iwantu226@gmail.com",
  phone: "+94776039102",
  phoneDisplay: "+94 77 603 9102",
  whatsapp: "94776039102",
  whatsappMessage: "Hello Krishan Tours Sri Lanka, I’d like help planning a journey through Sri Lanka.",
  address: {
    street: "109B, Waduranmulla Watta",
    locality: "Waduran Mulla",
    city: "Panadura",
    region: "Western Province",
    postalCode: "12500",
    country: "Sri Lanka",
  },
  geo: { latitude: 6.7132, longitude: 79.9074 },
  social: {
    tripadvisor: "https://www.tripadvisor.com/Search?q=Krishan+Tours+Sri+Lanka+Panadura",
    facebook: "https://www.facebook.com/krishantourssrilanka",
    instagram: "https://www.instagram.com/krishantourssrilanka",
  },
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_ID || "G-Q73YFBCYLS",
};

export function whatsappUrl(message = siteConfig.whatsappMessage) {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

