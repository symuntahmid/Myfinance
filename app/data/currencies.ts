export type Currency = {
  code: string;
  name: string;
  symbol: string;
  flag: string;
};

export const currencies: Currency[] = [
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
  { code: "AFN", name: "Afghan Afghani", symbol: "؋", flag: "🇦🇫" },
  { code: "ALL", name: "Albanian Lek", symbol: "L", flag: "🇦🇱" },
  { code: "AMD", name: "Armenian Dram", symbol: "֏", flag: "🇦🇲" },
  { code: "ARS", name: "Argentine Peso", symbol: "$", flag: "🇦🇷" },
  { code: "AUD", name: "Australian Dollar", symbol: "$", flag: "🇦🇺" },
  { code: "AZN", name: "Azerbaijani Manat", symbol: "₼", flag: "🇦🇿" },

  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", flag: "🇧🇩" },
  { code: "BHD", name: "Bahraini Dinar", symbol: ".د.ب", flag: "🇧🇭" },
  { code: "BND", name: "Brunei Dollar", symbol: "$", flag: "🇧🇳" },
  { code: "BOB", name: "Bolivian Boliviano", symbol: "Bs", flag: "🇧🇴" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  { code: "BTN", name: "Bhutanese Ngultrum", symbol: "Nu.", flag: "🇧🇹" },
  { code: "BYN", name: "Belarusian Ruble", symbol: "Br", flag: "🇧🇾" },

  { code: "CAD", name: "Canadian Dollar", symbol: "$", flag: "🇨🇦" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
  { code: "CLP", name: "Chilean Peso", symbol: "$", flag: "🇨🇱" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "COP", name: "Colombian Peso", symbol: "$", flag: "🇨🇴" },
  { code: "CRC", name: "Costa Rican Colón", symbol: "₡", flag: "🇨🇷" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", flag: "🇨🇿" },

  { code: "DKK", name: "Danish Krone", symbol: "kr", flag: "🇩🇰" },
  { code: "DOP", name: "Dominican Peso", symbol: "$", flag: "🇩🇴" },

  { code: "EGP", name: "Egyptian Pound", symbol: "£", flag: "🇪🇬" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "GEL", name: "Georgian Lari", symbol: "₾", flag: "🇬🇪" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", flag: "🇬🇭" },
  { code: "GTQ", name: "Guatemalan Quetzal", symbol: "Q", flag: "🇬🇹" },

  { code: "HKD", name: "Hong Kong Dollar", symbol: "$", flag: "🇭🇰" },
  { code: "HNL", name: "Honduran Lempira", symbol: "L", flag: "🇭🇳" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", flag: "🇭🇺" },

  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩" },
  { code: "ILS", name: "Israeli New Shekel", symbol: "₪", flag: "🇮🇱" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "IQD", name: "Iraqi Dinar", symbol: "ع.د", flag: "🇮🇶" },
  { code: "IRR", name: "Iranian Rial", symbol: "﷼", flag: "🇮🇷" },
  { code: "ISK", name: "Icelandic Króna", symbol: "kr", flag: "🇮🇸" },

  { code: "JOD", name: "Jordanian Dinar", symbol: "د.ا", flag: "🇯🇴" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },

  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", flag: "🇰🇪" },
  { code: "KGS", name: "Kyrgyzstani Som", symbol: "с", flag: "🇰🇬" },
  { code: "KHR", name: "Cambodian Riel", symbol: "៛", flag: "🇰🇭" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
  { code: "KZT", name: "Kazakhstani Tenge", symbol: "₸", flag: "🇰🇿" },

  { code: "LAK", name: "Lao Kip", symbol: "₭", flag: "🇱🇦" },
  { code: "LBP", name: "Lebanese Pound", symbol: "£", flag: "🇱🇧" },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs", flag: "🇱🇰" },

  { code: "MAD", name: "Moroccan Dirham", symbol: "د.م.", flag: "🇲🇦" },
  { code: "MDL", name: "Moldovan Leu", symbol: "L", flag: "🇲🇩" },
  { code: "MMK", name: "Myanmar Kyat", symbol: "K", flag: "🇲🇲" },
  { code: "MNT", name: "Mongolian Tögrög", symbol: "₮", flag: "🇲🇳" },
  { code: "MOP", name: "Macanese Pataca", symbol: "MOP$", flag: "🇲🇴" },
  { code: "MUR", name: "Mauritian Rupee", symbol: "₨", flag: "🇲🇺" },
  { code: "MVR", name: "Maldivian Rufiyaa", symbol: "Rf", flag: "🇲🇻" },
  { code: "MXN", name: "Mexican Peso", symbol: "$", flag: "🇲🇽" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾" },

  { code: "NAD", name: "Namibian Dollar", symbol: "$", flag: "🇳🇦" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴" },
  { code: "NPR", name: "Nepalese Rupee", symbol: "₨", flag: "🇳🇵" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "$", flag: "🇳🇿" },

  { code: "OMR", name: "Omani Rial", symbol: "ر.ع.", flag: "🇴🇲" },

  { code: "PEN", name: "Peruvian Sol", symbol: "S/", flag: "🇵🇪" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", flag: "🇵🇭" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", flag: "🇵🇰" },
  { code: "PLN", name: "Polish Złoty", symbol: "zł", flag: "🇵🇱" },
  { code: "PYG", name: "Paraguayan Guaraní", symbol: "₲", flag: "🇵🇾" },

  { code: "QAR", name: "Qatari Riyal", symbol: "ر.ق", flag: "🇶🇦" },

  { code: "RON", name: "Romanian Leu", symbol: "lei", flag: "🇷🇴" },
  { code: "RSD", name: "Serbian Dinar", symbol: "дин.", flag: "🇷🇸" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", flag: "🇷🇺" },

  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
  { code: "SGD", name: "Singapore Dollar", symbol: "$", flag: "🇸🇬" },
  { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },

  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴", flag: "🇺🇦" },
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "UYU", name: "Uruguayan Peso", symbol: "$U", flag: "🇺🇾" },
  { code: "UZS", name: "Uzbekistani Som", symbol: "so'm", flag: "🇺🇿" },

  { code: "VND", name: "Vietnamese Đồng", symbol: "₫", flag: "🇻🇳" },

  { code: "XAF", name: "Central African CFA Franc", symbol: "FCFA", flag: "🌍" },
  { code: "XOF", name: "West African CFA Franc", symbol: "CFA", flag: "🌍" },

  { code: "YER", name: "Yemeni Rial", symbol: "﷼", flag: "🇾🇪" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  { code: "ZMW", name: "Zambian Kwacha", symbol: "ZK", flag: "🇿🇲" },
];