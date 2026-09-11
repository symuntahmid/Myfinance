export type TranslationKey =
  | "wealthHub"
  | "dashboard"
  | "profile"
  | "myMoney"
  | "investments"
  | "reports"
  | "settings"
  | "myProfile"
  | "profileDescription"
  | "editProfile"
  | "developerMode"
  | "financialLevel"
  | "buildingFinancialConfidence"
  | "moneySystemMessage";



type LanguageTranslation =
  Record<TranslationKey, string>;



export const translations: Record<
  string,
  LanguageTranslation
> = {



  en: {

    wealthHub:
      "Your Personal Wealth Hub",

    dashboard:
      "Dashboard",

    profile:
      "Profile",

    myMoney:
      "My Money",

    investments:
      "My Investments",

    reports:
      "Reports",

    settings:
      "Settings",


    myProfile:
      "My Profile",

    profileDescription:
      "Your financial identity, progress, and money habits.",

    editProfile:
      "Edit Profile",

    developerMode:
      "Developer Mode",

    financialLevel:
      "Financial Level",

    buildingFinancialConfidence:
      "Building financial confidence",

    moneySystemMessage:
      "You are building a stronger money system. Small actions create long-term wealth.",

  },







  bn: {

    wealthHub:
      "আপনার ব্যক্তিগত সম্পদ ব্যবস্থাপনা কেন্দ্র",

    dashboard:
      "ড্যাশবোর্ড",

    profile:
      "প্রোফাইল",

    myMoney:
      "আমার টাকা",

    investments:
      "আমার বিনিয়োগ",

    reports:
      "রিপোর্ট",

    settings:
      "সেটিংস",


    myProfile:
      "আমার প্রোফাইল",

    profileDescription:
      "আপনার আর্থিক পরিচয়, অগ্রগতি এবং অর্থ ব্যবস্থাপনার অভ্যাস।",

    editProfile:
      "প্রোফাইল সম্পাদনা করুন",

    developerMode:
      "ডেভেলপার মোড",

    financialLevel:
      "আর্থিক স্তর",

    buildingFinancialConfidence:
      "আর্থিক আত্মবিশ্বাস তৈরি হচ্ছে",

    moneySystemMessage:
      "আপনি একটি শক্তিশালী অর্থ ব্যবস্থা তৈরি করছেন। ছোট ছোট পদক্ষেপ দীর্ঘমেয়াদী সম্পদ তৈরি করে।",

  },







  hi: {

    wealthHub:
      "आपका व्यक्तिगत धन प्रबंधन केंद्र",

    dashboard:
      "डैशबोर्ड",

    profile:
      "प्रोफ़ाइल",

    myMoney:
      "मेरा पैसा",

    investments:
      "मेरे निवेश",

    reports:
      "रिपोर्ट",

    settings:
      "सेटिंग्स",


    myProfile:
      "मेरी प्रोफ़ाइल",

    profileDescription:
      "आपकी वित्तीय पहचान, प्रगति और धन संबंधी आदतें।",

    editProfile:
      "प्रोफ़ाइल संपादित करें",

    developerMode:
      "डेवलपर मोड",

    financialLevel:
      "वित्तीय स्तर",

    buildingFinancialConfidence:
      "वित्तीय आत्मविश्वास का निर्माण",

    moneySystemMessage:
      "आप एक मजबूत वित्तीय प्रणाली बना रहे हैं। छोटे कदम लंबे समय में धन बनाते हैं।",

  },









  ar: {

    wealthHub:
      "مركز إدارة ثروتك الشخصي",

    dashboard:
      "لوحة التحكم",

    profile:
      "الملف الشخصي",

    myMoney:
      "أموالي",

    investments:
      "استثماراتي",

    reports:
      "التقارير",

    settings:
      "الإعدادات",


    myProfile:
      "ملفي الشخصي",

    profileDescription:
      "هويتك المالية وتقدمك وعاداتك المالية.",

    editProfile:
      "تعديل الملف الشخصي",

    developerMode:
      "وضع المطور",

    financialLevel:
      "المستوى المالي",

    buildingFinancialConfidence:
      "بناء الثقة المالية",

    moneySystemMessage:
      "أنت تبني نظامًا ماليًا أقوى. الإجراءات الصغيرة تصنع ثروة طويلة الأجل.",

  },









  es: {

    wealthHub:
      "Tu centro personal de gestión financiera",

    dashboard:
      "Panel de control",

    profile:
      "Perfil",

    myMoney:
      "Mi dinero",

    investments:
      "Mis inversiones",

    reports:
      "Informes",

    settings:
      "Configuración",


    myProfile:
      "Mi perfil",

    profileDescription:
      "Tu identidad financiera, progreso y hábitos monetarios.",

    editProfile:
      "Editar perfil",

    developerMode:
      "Modo desarrollador",

    financialLevel:
      "Nivel financiero",

    buildingFinancialConfidence:
      "Construyendo confianza financiera",

    moneySystemMessage:
      "Estás construyendo un sistema financiero más sólido. Las pequeñas acciones crean riqueza a largo plazo.",

  },









  pt: {

    wealthHub:
      "Seu centro pessoal de gestão financeira",

    dashboard:
      "Painel",

    profile:
      "Perfil",

    myMoney:
      "Meu dinheiro",

    investments:
      "Meus investimentos",

    reports:
      "Relatórios",

    settings:
      "Configurações",


    myProfile:
      "Meu perfil",

    profileDescription:
      "Sua identidade financeira, progresso e hábitos financeiros.",

    editProfile:
      "Editar perfil",

    developerMode:
      "Modo desenvolvedor",

    financialLevel:
      "Nível financeiro",

    buildingFinancialConfidence:
      "Construindo confiança financeira",

    moneySystemMessage:
      "Você está construindo um sistema financeiro mais forte. Pequenas ações criam riqueza a longo prazo.",

  },









  fr: {

    wealthHub:
      "Votre centre personnel de gestion financière",

    dashboard:
      "Tableau de bord",

    profile:
      "Profil",

    myMoney:
      "Mon argent",

    investments:
      "Mes investissements",

    reports:
      "Rapports",

    settings:
      "Paramètres",


    myProfile:
      "Mon profil",

    profileDescription:
      "Votre identité financière, vos progrès et vos habitudes financières.",

    editProfile:
      "Modifier le profil",

    developerMode:
      "Mode développeur",

    financialLevel:
      "Niveau financier",

    buildingFinancialConfidence:
      "Construire la confiance financière",

    moneySystemMessage:
      "Vous construisez un système financier plus solide. Les petites actions créent une richesse durable.",

  },









  de: {

    wealthHub:
      "Ihr persönliches Finanzzentrum",

    dashboard:
      "Dashboard",

    profile:
      "Profil",

    myMoney:
      "Mein Geld",

    investments:
      "Meine Investitionen",

    reports:
      "Berichte",

    settings:
      "Einstellungen",


    myProfile:
      "Mein Profil",

    profileDescription:
      "Ihre finanzielle Identität, Fortschritte und Geldgewohnheiten.",

    editProfile:
      "Profil bearbeiten",

    developerMode:
      "Entwicklermodus",

    financialLevel:
      "Finanzlevel",

    buildingFinancialConfidence:
      "Finanzielles Vertrauen aufbauen",

    moneySystemMessage:
      "Sie bauen ein stärkeres Finanzsystem auf. Kleine Schritte schaffen langfristigen Wohlstand.",

  },









  id: {

    wealthHub:
      "Pusat pengelolaan keuangan pribadi Anda",

    dashboard:
      "Dasbor",

    profile:
      "Profil",

    myMoney:
      "Uang Saya",

    investments:
      "Investasi Saya",

    reports:
      "Laporan",

    settings:
      "Pengaturan",


    myProfile:
      "Profil Saya",

    profileDescription:
      "Identitas keuangan, perkembangan, dan kebiasaan uang Anda.",

    editProfile:
      "Edit Profil",

    developerMode:
      "Mode Pengembang",

    financialLevel:
      "Tingkat Keuangan",

    buildingFinancialConfidence:
      "Membangun kepercayaan finansial",

    moneySystemMessage:
      "Anda sedang membangun sistem keuangan yang lebih kuat. Tindakan kecil menciptakan kekayaan jangka panjang.",

  },









  vi: {

    wealthHub:
      "Trung tâm quản lý tài chính cá nhân của bạn",

    dashboard:
      "Bảng điều khiển",

    profile:
      "Hồ sơ",

    myMoney:
      "Tiền của tôi",

    investments:
      "Khoản đầu tư của tôi",

    reports:
      "Báo cáo",

    settings:
      "Cài đặt",


    myProfile:
      "Hồ sơ của tôi",

    profileDescription:
      "Danh tính tài chính, tiến trình và thói quen tiền bạc của bạn.",

    editProfile:
      "Chỉnh sửa hồ sơ",

    developerMode:
      "Chế độ nhà phát triển",

    financialLevel:
      "Cấp độ tài chính",

    buildingFinancialConfidence:
      "Xây dựng sự tự tin tài chính",

    moneySystemMessage:
      "Bạn đang xây dựng hệ thống tài chính vững mạnh hơn. Những hành động nhỏ tạo nên sự giàu có lâu dài.",

  },









  ko: {

    wealthHub:
      "개인 자산 관리 허브",

    dashboard:
      "대시보드",

    profile:
      "프로필",

    myMoney:
      "내 돈",

    investments:
      "내 투자",

    reports:
      "보고서",

    settings:
      "설정",


    myProfile:
      "내 프로필",

    profileDescription:
      "나의 금융 정체성, 진행 상황 및 돈 관리 습관",

    editProfile:
      "프로필 수정",

    developerMode:
      "개발자 모드",

    financialLevel:
      "재정 레벨",

    buildingFinancialConfidence:
      "금융 자신감 형성",

    moneySystemMessage:
      "더 강력한 금융 시스템을 구축하고 있습니다. 작은 행동이 장기적인 부를 만듭니다.",

  },









  ja: {

    wealthHub:
      "あなたの個人資産管理ハブ",

    dashboard:
      "ダッシュボード",

    profile:
      "プロフィール",

    myMoney:
      "私のお金",

    investments:
      "投資",

    reports:
      "レポート",

    settings:
      "設定",


    myProfile:
      "マイプロフィール",

    profileDescription:
      "あなたの金融アイデンティティ、進捗、資産管理習慣。",

    editProfile:
      "プロフィールを編集",

    developerMode:
      "開発者モード",

    financialLevel:
      "財務レベル",

    buildingFinancialConfidence:
      "金融への自信を築いています",

    moneySystemMessage:
      "より強い資産管理システムを構築しています。小さな行動が長期的な豊かさを作ります。",

  },



};