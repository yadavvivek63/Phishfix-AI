// Phishfix AI — built-in multilingual cyber-safety assistant.
// Works offline with no API key. Language is auto-detected or explicitly chosen.
// Any missing language/intent falls back to English.

export type LanguageCode = "en" | "hi" | "ta" | "te" | "bn" | "mr" | "gu" | "pa" | "ur";

export interface LanguageOption {
 code: LanguageCode;
 label: string;
 native: string;
}

export const LANGUAGES: LanguageOption[] = [
 { code: "en", label: "English", native: "English" },
 { code: "hi", label: "Hindi", native: "हिन्दी" },
 { code: "ta", label: "Tamil", native: "தமிழ்" },
 { code: "te", label: "Telugu", native: "తెలుగు" },
 { code: "bn", label: "Bengali", native: "বাংলা" },
 { code: "mr", label: "Marathi", native: "मराठी" },
];

export type Intent = "kyc" | "otp" | "delivery" | "upi" | "scam" | "greeting" | "generic";

export function isLanguageCode(value: string): value is LanguageCode {
 return LANGUAGES.some((l) => l.code === value);
}

/* ------------------------------ Intent detection ------------------------------ */

const INTENT_PATTERNS: { intent: Intent; re: RegExp }[] = [
 { intent: "kyc", re: /(kyc|केवाईसी|கேஐசிஐ|కెవైస్సీ|কেসিওয়াই|केवाई|ஆதாரு|आधार)/i },
 { intent: "otp", re: /(\botp\b|cvv|\bpin\b|password|पासवर्ड|ਪਾਸਵਰਡ|پاس ورڈ|ஓடிபி|ஈடிபி|পিন|ਪਿੰਨ)/i },
 { intent: "delivery", re: /(delivery|parcel|courier|dtdc|redeliver|डिलीवरी|டெலிவரி|డెలివరీ|ডেলিভারি|ડેલિવરી|ڈیلیوری|ਡਿਲੀਵਰੀ)/i },
 { intent: "scam", re: /(scam|fraud|cheated|lost money|duped|ठगी|गबन|धोखा|ধোঁকা|ٹھگی|ਧੋਖਾ|மோசடி|మోసం|প্রতারণা|ગ્રાફારી)/i },
 { intent: "upi", re: /(upi|payment|refund|paytm|phonepe|gpay|collect|qr|பணம்|డబ్బు|টাকা|पैसा|पैसे|પૈસા|پیسے|ਪੈਸੇ)/i },
 { intent: "greeting", re: /^(hi|hello|hey|namaste|नमस्ते|नमस्कार|வணக்கம்|నమస్కారం|নমস্কার|નમસ્તે|ਸਤ ਸ੍ਰੀ ਅਕਾਲ|سلام)/i },
];

export function detectIntent(text: string): Intent {
 for (const { intent, re } of INTENT_PATTERNS) {
 if (re.test(text)) return intent;
 }
 return "generic";
}

/* ------------------------------ Language detection ------------------------------ */

export function detectLanguage(text: string): LanguageCode {
 if (/[\u0B80-\u0BFF]/.test(text)) return "ta";
 if (/[\u0C00-\u0C7F]/.test(text)) return "te";
 if (/[\u0980-\u09FF]/.test(text)) return "bn";
 if (/[\u0900-\u097F]/.test(text)) return "hi";
 return "en";
}

/* ------------------------------ Replies ------------------------------ */

type IntentMap = Record<Intent, string>;
type ReplyTable = Partial<Record<LanguageCode, Partial<IntentMap>>>;

const REPLIES: ReplyTable = {
 en: {
 kyc: "🔍 'Update/verify your KYC' messages with a link are almost always scams. Real banks never ask you to update KYC via an SMS or WhatsApp link. Do this: 1) Do NOT click the link. 2) Check KYC status only in your bank's official app or website. 3) Forward the message to your bank's official fraud number and report at cybercrime.gov.in.",
 otp: "⚠️ Never share your OTP, UPI PIN, password, CVV or full Aadhaar with anyone — no bank or company asks for these on a call, SMS or WhatsApp. If you already shared them: 1) Call your bank now to block the account/card. 2) Change your netbanking and UPI PIN. 3) Report at cybercrime.gov.in or call 1930. Never approve a UPI collect request.",
 delivery: "📦 Delivery-fee or 'redelivery' messages with a short link are a common courier scam — the link opens a fake card/OTP page. Do this: 1) Never pay a 'delivery fee' from an SMS link. 2) Track parcels only on the courier's official site or app. 3) If you already paid, call your bank immediately, then report at cybercrime.gov.in / 1930.",
 upi: "💸 You never need a PIN or to scan a 'payment' QR to RECEIVE money. Anyone asking you to scan a QR or approve a collect request to 'receive' money is scamming you. Do this: 1) Decline the collect request. 2) Never share your UPI PIN. 3) If money was debited, raise a UPI dispute in your app and report at cybercrime.gov.in / 1930.",
 scam: "🆘 If you've already been scammed, act fast: 1) Call 1930 (national cybercrime helpline) and report at cybercrime.gov.in immediately — early reporting improves the chance of freezing funds. 2) Contact your bank/UPI app to block the transaction and freeze accounts. 3) Save screenshots, SMS, transaction IDs and phone numbers as evidence. 4) File an FIR if asked. Tell me what happened and I'll guide you step by step.",
 greeting: "Hi, I'm Phishfix AI 🛡️. I can check whether a message, link, QR code, UPI ID or phone number is suspicious and guide you step by step. You can also use the scanners in the sidebar for a detailed risk analysis. Is this about a message, a website, a payment/UPI, or money you've already lost?",
 generic: "I'm Phishfix AI 🛡️. Tell me a little more — is this about a message, a website, a payment/UPI, or money you've already lost? I'll give you exact steps.",
 },
 hi: {
 kyc: "🔍 लिंक वाले 'KYC अपडेट/सत्यापित करें' मैसेज लगभग हमेशा घोटाला होते हैं। असली बैंक SMS/WhatsApp लिंक से KYC अपडेट नहीं माँगते। करें: 1) लिंक पर क्लिक न करें। 2) KYC स्थिति सिर्फ बैंक के आधिकारिक ऐप/वेबसाइट पर देखें। 3) मैसेज बैंक के फ्रॉड नंबर पर फॉरवर्ड करें और cybercrime.gov.in पर रिपोर्ट करें।",
 otp: "⚠️ अपना OTP, UPI PIN, पासवर्ड, CVV या पूरा आधार किसी के साथ साझा न करें — कोई भी बैंक या कंपनी कॉल, SMS या WhatsApp पर ये नहीं माँगती। अगर साझा कर दिया है: 1) तुरंत बैंक को कॉल कर खाता/कार्ड ब्लॉक करें। 2) नेटबैंकिंग और UPI PIN बदलें। 3) cybercrime.gov.in पर रिपोर्ट करें या 1930 पर कॉल करें। कोई भी UPI collect request approve न करें।",
 delivery: "📦 छोटे लिंक वाले 'डिलीवरी फीस' या 'रीडिलीवरी' मैसेज कूरियर घोटाला हैं — लिंक फेक कार्ड/OTP पेज खोलता है। करें: 1) SMS लिंक से कोई 'डिलीवरी फीस' न दें। 2) पार्सल ट्रैकिंग सिर्फ कूरियर की आधिकारिक साइट/ऐप पर करें। 3) पैसा गया हो तो तुरंत बैंक को कॉल करें और cybercrime.gov.in / 1930 पर रिपोर्ट करें।",
 upi: "💸 पैसे प्राप्त करने के लिए कभी PIN डालने या 'payment' QR स्कैन करने की ज़रूरत नहीं होती। जो 'पैसे मिलेंगे' कहकर QR स्कैन या collect request approve करने को कहे, वो घोटाला है। करें: 1) collect request reject करें। 2) UPI PIN कभी साझा न करें। 3) पैसे कट गए हों तो ऐप में UPI dispute उठाएं और cybercrime.gov.in / 1930 पर रिपोर्ट करें।",
 scam: "🆘 अगर आपको पहले ही ठग लिया गया है, तुरंत करें: 1) 1930 (साइबरक्राइम हेल्पलाइन) पर कॉल करें और cybercrime.gov.in पर तुरंत रिपोर्ट करें — जल्दी रिपोर्ट से पैसे रोकने की संभावना बढ़ती है। 2) बैंक/UPI ऐप से ट्रांज़ैक्शन ब्लॉक कराएं और खाता फ्रीज़ करें। 3) स्क्रीनशॉट, SMS, ट्रांज़ैक्शन ID और नंबर सुरक्षित रखें। 4) ज़रورت पर FIR दर्ज कराएं। बताइए क्या हुआ, मैं हर कदम में मदद करूंगा।",
 greeting: "नमस्ते, मैं Phishfix AI 🛡️ हूँ। मैं मैसेज, लिंक, QR कोड, UPI ID या फोन नंबर को संदिग्ध है या नहीं, यह जांचने में मदद करता हूँ और हर कदम पर मार्गदर्शन करता हूँ। साइडबार के स्कैनर्स से विस्तृत रिस्क एनालिसिस भी कर सकते हैं। बताइए — यह मैसेज, वेबसाइट, पेमेंट/UPI या पहले ही पैसा गंवाने से जुड़ा है?",
 generic: "मैं Phishfix AI 🛡️ हूँ। थोड़ा और बताइए — यह मैसेज, वेबसाइट, पेमेंट/UPI या पहले ही गंवाए पैसों से जुड़ा है? मैं सटीक कदम बताऊंगा।",
 },
 ta: {
 kyc: "🔍 இணைப்புடன் வரும் 'KYC புதுப்பிக்கவும்/சரிபார்க்கவும்' செய்திகள் கிட்டத்தட்ட எப்போதும் மோசடி. உண்மையான வங்கிகள் SMS/WhatsApp இணைப்பு மூலம் KYC கேட்காது. செய்யுங்கள்: 1) இணைப்பை கிளிக் செய்ய வேண்டாம். 2) KYC நிலையை வங்கியின் அதிகாரப்பூர்வ செயலி/இணையதளத்தில் மட்டும் பாருங்கள். 3) செய்தியை வங்கியின் மோசடி எண்ணுக்கு அனுப்பி cybercrime.gov.in இல் புகார் அளிக்கவும்.",
 otp: "⚠️ உங்கள் OTP, UPI PIN, கடவுச்சொல், CVV அல்லது முழு ஆதாரை யாருடனும் பகிர வேண்டாம் — எந்த வங்கியும் நிறுவனமும் அழைப்பு, SMS அல்லது WhatsApp மூலம் இவற்றைக் கேட்காது. ஏற்கனவே பகிர்ந்திருந்தால்: 1) உடனே வங்கியை அழைத்து கணக்கு/அட்டையை மூடுங்கள். 2) நெட்பேங்கிங் மற்றும் UPI PIN மாற்றுங்கள். 3) cybercrime.gov.in இல் புகார் அளிக்கவும் அல்லது 1930 ஐ அழைக்கவும். UPI collect request ஐ அங்கீகரிக்க வேண்டாம்.",
 delivery: "📦 சிறிய இணைப்புடன் வரும் 'டெலிவரி கட்டணம்' அல்லது 'மீண்டும் டெலிவரி' செய்திகள் கூரியர் மோசடி — இணைப்பு போலி அட்டை/OTP பக்கத்திற்கு அழைத்துச் செல்லும். செய்யுங்கள்: 1) SMS இணைப்பு மூலம் 'டெலிவரி கட்டணம்' செலுத்த வேண்டாம். 2) பார்சலை கூரியரின் அதிகாரப்பூர்வ இணையதளம்/செயலியில் மட்டும் கண்காணிக்கவும். 3) பணம் செலுத்தியிருந்தால் உடனே வங்கியை அழைத்து cybercrime.gov.in / 1930 இல் புகார் அளிக்கவும்.",
 upi: "💸 பணம் பெற PIN அல்லது 'payment' QR ஐ ஸ்கேன் செய்ய தேவையில்லை. 'பணம் வரும்' என்று சொல்லி QR ஸ்கேன் அல்லது collect request அங்கீகரிக்கச் சொல்பவர் மோசடியவர். செய்யுங்கள்: 1) collect request ஐ நிராகரிக்கவும். 2) UPI PIN ஐ சொல்ல வேண்டாம். 3) பணம் வெட்டப்பட்டால் செயலியில் UPI dispute எடுத்து cybercrime.gov.in / 1930 இல் புகார் அளிக்கவும்.",
 scam: "🆘 ஏற்கனவே மோசடி செய்யப்பட்டிருந்தால் உடனே செயல்படுங்கள்: 1) 1930 (சைபர் கிரைம் உதவி எண்) ஐ அழைத்து cybercrime.gov.in இல் உடனே புகார் அளிக்கவும் — விரைவாக புகார் செய்தால் பணத்தை உறைவதற்கான வாய்ப்பு அதிகம். 2) வங்கி/UPI செயலியை அணுகி பரிவர்த்தனையை தடுக்கவும். 3) ஸ்கிரீன்ஷாட், SMS, பரிவர்த்தனை ID ஆகியவற்றை சேமிக்கவும். 4) தேவைப்பட்டால் FIR பதிவு செய்யவும். என்ன நடந்தது என்று சொல்லுங்கள், நான் படிப்படியாக உதவுகிறேன்.",
 greeting: "வணக்கம், நான் Phishfix AI 🛡️. செய்தி, இணைப்பு, QR குறியீடு, UPI ID அல்லது தொலைபேசி எண் சந்தேகத்திற்குரியதா என்று சரிபார்க்கவும், படிப்படியாக வழிகாட்டவும் நான் உதவுகிறேன். பக்கப்பட்டியலில் உள்ள ஸ்கேனர்களில் விரிவான ஆபத்து பகுப்பாய்வு செய்யலாம். இது செய்தி, இணையதளம், பணம்/UPI அல்லது ஏற்கனவே இழந்த பணம் பற்றியதா?",
 generic: "நான் Phishfix AI 🛡️. இது செய்தி, இணையதளம், UPI பணம் அல்லது ஏற்கனவே இழந்த பணம் பற்றியதா?",
 },
 te: {
 kyc: "🔍 లింక్‌తో వచ్చే 'KYC అప్‌డేట్ చేయండి' సందేశాలు దాదాపు ఎప్పుడూ మోసం. నిజమైన బ్యాంకులు SMS/WhatsApp లింక్ ద్వారా KYC అడగవు. చేయండి: 1) లింక్ క్లిక్ చేయవద్దు. 2) KYC స్థితిని బ్యాంకు అధికారిక యాప్/వెబ్‌సైట్‌లో మాత్రమే చూడండి. 3) సందేశాన్ని బ్యాంకు మోసం నంబర్‌కు పంపి cybercrime.gov.in లో ఫిర్యాదు చేయండి.",
 otp: "⚠️ మీ OTP, UPI PIN, పాస్‌వర్డ్, CVV లేదా పూర్తి ఆధార్ ఎవరికీ చెప్పవద్దు — ఏ బ్యాంకు/కంపెనీ అయినా కాల్, SMS లేదా WhatsApp ద్వారా ఇవి అడగదు. చెప్పేసి ఉంటే: 1) వెంటనే బ్యాంకుకు కాల్ చేసి ఖాతా/కార్డ్ బ్లాక్ చేయండి. 2) నెట్ బ్యాంకింగ్ మరియు UPI PIN మార్చండి. 3) cybercrime.gov.in లో ఫిర్యాదు చేయండి లేదా 1930 కు కాల్ చేయండి. UPI collect request ఆమోదించకండి.",
 delivery: "📦 చిన్న లింక్‌తో వచ్చే 'డెలివరీ ఫీజు' లేదా 'రీ-డెలివరీ' సందేశాలు కూరియర్ మోసం — లింక్ నకली కార్డ్/OTP పేజీకి తీసుకెళ్తుంది. చేయండి: 1) SMS లింక్ ద్వారా 'డెలివరీ ఫీజు' చెల్లించకండి. 2) కూరియర్ అధికారిక సైట్/యాప్‌లో ట్రాకింగ్ చేయండి. 3) డబ్బు చెల్లించి ఉంటే వెంటనే బ్యాంకుకు కాల్ చేసి cybercrime.gov.in / 1930 లో ఫిర్యాదు చేయండి.",
 upi: "💸 డబ్బు అందుకోవడానికి PIN లేదా 'payment' QR స్కాన్ చేయాల్సిన అవసరం లేదు. 'డబ్బు వస్తుంది' అని చెప్పి QR స్కాన్ లేదా collect request ఆమోదించమని అడిగేవారు మోసవాళ్లు. చేయండి: 1) collect request తిరస్కరించండి. 2) UPI PIN ఎప్పటికీ చెప్పవద్దు. 3) డబ్బు కట్ అయితే యాప్‌లో UPI dispute ఎత్తి cybercrime.gov.in / 1930 లో ఫిర్యాదు చేయండి.",
 scam: "🆘 ఇప్పటికే మోసం జరిగిందా? వెంటనే 1930 కు కాల్ చేసి cybercrime.gov.in లో ఫిర్యాదు చేయండి — త్వరగా ఫిర్యాదు చేస్తే డబ్బు ఆపే అవకాశం ఎక్కువ. బ్యాంకు ద్వారా కార్డ్ బ్లాక్ చేయండి, స్క్రీన్‌షాట్/SMS/ట్రాన్సాక్షన్ ID భద్రంగా ఉంచండి, అవసరమైతే FIR నమోదు చేయండి.",
 greeting: "నమస్కారం, నేను Phishfix AI 🛡️. అనుమానాస్పద సందేశం, లింక్, QR కోడ్, UPI ID లేదా ఫోన్ నంబర్ గురించి అడగండి, నేను దశలవారీగా మార్గదర్శకం చేస్తాను. ఇది సందేశం, వెబ్‌సైట్, UPI చెల్లింపు లేదా ఇప్పటికే కోల్పోయిన డబ్బు గురించా?",
 generic: "నేను Phishfix AI 🛡️. ఇది సందేశం, వెబ్‌సైట్, UPI చెల్లింపు లేదా ఇప్పటికే కోల్పోయిన డబ్బు గురించా?",
 },
 bn: {
 kyc: "🔍 লিঙ্কসহ আসা 'KYC আপডেট করুন' বার্তা প্রায় সবসময় প্রতারণা। আসল ব্যাংক SMS/WhatsApp লিঙ্ক দিয়ে KYC চায় না। করুন: 1) লিঙ্কে ক্লিক করবেন না। 2) KYC অবস্থা শুধু ব্যাংকের অফিসিয়াল অ্যাপ/ওয়েবসাইটে দেখুন। 3) বার্তাটি ব্যাংকের ফ্রড নম্বরে পাঠান এবং cybercrime.gov.in-এ রিপোর্ট করুন।",
 otp: "⚠️ আপনার OTP, UPI PIN, পাসওয়ার্ড, CVV বা সম্পূর্ণ আধার কাউকে বলবেন না — কোনো ব্যাংক/কোম্পানি কল, SMS বা WhatsApp-এ এগুলো চায় না। বলে ফেলে থাকলে: 1) ব্যাংককে কল করে অ্যাকাউন্ট/কার্ড ব্লক করুন। 2) নেটব্যাংকিং ও UPI PIN বদলান। 3) cybercrime.gov.in-এ রিপোর্ট করুন বা 1930-এ কল করুন।",
 delivery: "📦 ছোট লিঙ্কসহ আসা 'ডেলিভারি ফি' বা 'রি-ডেলিভারি' বার্তা কুরিয়ার প্রতারণা — এটি নকল কার্ড/OTP পেজ খোলে। করুন: 1) SMS লিঙ্ক থেকে 'ডেলিভারি ফি' দেবেন না। 2) কুরিয়ারের অফিসিয়াল সাইটে ট্র্যাক করুন। 3) টাকা দিয়ে থাকলে ব্যাংককে কল করুন এবং cybercrime.gov.in / 1930-এ রিপোর্ট করুন।",
 upi: "💸 টাকা নিতে PIN বা 'payment' QR স্ক্যান করার দরকার নেই। 'টাকা আসবে' বলে QR স্ক্যান বা collect request অনুমোদন করতে বললে সে প্রতারক। করুন: 1) collect request প্রত্যাখ্যান করুন। 2) UPI PIN কখনো বলবেন না। 3) টাকা কাটা গেলে অ্যাপে UPI dispute করুন এবং cybercrime.gov.in / 1930-এ রিপোর্ট করুন।",
 scam: "🆘 আগেই প্রতারিত হয়েছেন? সঙ্গে সঙ্গে 1930-এ কল করুন এবং cybercrime.gov.in-এ রিপোর্ট করুন — দ্রুত রিপোর্ট করলে টাকা আটকানোর সম্ভাবনা বাড়ে। ব্যাংকের মাধ্যমে কার্ড ব্লক করুন, স্ক্রিনশট/SMS/লেনদেনের ID রাখুন, প্রয়োজনে FIR করুন।",
 greeting: "নমস্কার, আমি Phishfix AI 🛡️। সন্দেহজনক বার্তা, লিঙ্ক, QR কোড, UPI ID বা ফোন নম্বর সম্পর্কে জিজ্ঞাসা করুন, আমি ধাপে ধাপে সাহায্য করব। এটি বার্তা, ওয়েবসাইট, UPI পেমেন্ট নাকি আগেই হারানো টাকা সম্পর্কে?",
 generic: "আমি Phishfix AI 🛡️। এটি বার্তা, ওয়েবসাইট, UPI পেমেন্ট নাকি আগেই হারানো টাকা সম্পর্কে?",
 },
 mr: {
 kyc: "🔍 लिंकसह येणारे 'KYC अपडेट करा' संदेश जवळपास नेहमी फसवणूक असतात. खरी बँक SMS/WhatsApp लिंकद्वारे KYC मागत नाही. करा: 1) लिंकवर क्लिक करू नका. 2) KYC स्थिती फक्त बँकेच्या अधिकृत ॲप/वेबसाइटवर तपासा. 3) संदेश बँकेच्या फसवणूक क्रमांकावर पाठवा आणि cybercrime.gov.in वर तक्रार नोंदवा.",
 otp: "⚠️ तुमचा OTP, UPI PIN, पासवर्ड, CVV किंवा संपूर्ण आधार कोणालाही सांगू नका — कोणतीही बँक/कंपनी कॉल, SMS किंवा WhatsApp वर हे मागत नाही. सांगितले असेल: 1) बँकेला कॉल करून खाते/कार्ड ब्लॉक करा. 2) नेटबँकिंग आणि UPI PIN बदला. 3) cybercrime.gov.in वर तक्रार नोंदवा किंवा 1930 वर कॉल करा.",
 delivery: "📦 लहान लिंकसह येणारे 'डिलिव्हरी फी' किंवा 'री-डिलिव्हरी' संदेश कुरिअर फसवणूक आहेत — ते बनावट कार्ड/OTP पेज उघडतात. करा: 1) SMS लिंकद्वारे 'डिलिव्हरी फी' देऊ नका. 2) कुरिअरच्या अधिकृत साइटवर ट्रॅक करा. 3) पैसे गेले असल्यास बँकेला कॉल करा आणि cybercrime.gov.in / 1930 वर तक्रार नोंदवा.",
 upi: "💸 पैसे घेण्यासाठी PIN किंवा 'payment' QR स्कॅन करण्याची गरज नाही. 'पैसे मिळतील' असे सांगून QR स्कॅन किंवा collect request मंजूर करायला सांगणारा फसवणूक करतो. करा: 1) collect request नाकारा. 2) UPI PIN कधीही सांगू नका. 3) पैसे गेले असल्यास ॲपमध्ये UPI dispute उठवा आणि cybercrime.gov.in / 1930 वर तक्रार नोंदवा.",
 scam: "🆘 आधीच फसवणूक झाली आहे? तात्काळ 1930 वर कॉल करा आणि cybercrime.gov.in वर तक्रार नोंदवा — लवकर तक्रार केल्यास पैसे रोखण्याची शक्यता वाढते. बँकेद्वारे कार्ड ब्लॉक करा, स्क्रीनशॉट/SMS/व्यवहार ID ठेवा, गरज असल्यास FIR दाखल करा.",
 greeting: "नमस्कार, मी Phishfix AI 🛡️ आहे. संशयास्पद संदेश, लिंक, QR कोड, UPI ID किंवा फोन क्रमांकाबद्दल विचारा, मी टप्प्याटप्प्याने मार्गदर्शन करेन. हा संदेश, वेबसाइट, UPI पेमेंट की आधीच गमावलेले पैसे याबद्दल आहे का?",
 generic: "मी Phishfix AI 🛡️ आहे. हा संदेश, वेबसाइट, UPI पेमेंट की आधीच गमावलेले पैसे याबद्दल आहे का?",
 },
};

/* ------------------------------ Suggestions ------------------------------ */

const SUGGESTION_TABLE: Partial<Record<LanguageCode, string[]>> = {
 en: [
 "I got a message to update my KYC with a link. Is it safe?",
 "Someone is asking for an OTP to send me money.",
 "I already paid a delivery fee and think it's a scam.",
 "I lost money to a UPI scam. What do I do?",
 ],
 hi: [
 "लिंक से KYC अपडेट करने का मैसेज आया है, क्या यह सुरक्षित है?",
 "कोई पैसे भेजने के लिए OTP मांग रहा है।",
 "मैंने डिलीवरी फीस दे दी है, लगता है यह घोटाला है।",
 "UPI घोटाले में पैसे गंवा दिए, क्या करूँ?",
 ],
};

export function suggestionsFor(lang: LanguageCode): string[] {
 return SUGGESTION_TABLE[lang] ?? SUGGESTION_TABLE.en!;
}

/* ------------------------------ Public API ------------------------------ */

export interface AssistantReply {
 reply: string;
 lang: LanguageCode;
 intent: Intent;
 fallback: boolean;
}

export function assistantReply(message: string, lang: LanguageCode | "auto"): AssistantReply {
 const language = lang === "auto" ? detectLanguage(message) : lang;
 const intent = detectIntent(message);
 const localized = REPLIES[language]?.[intent];
 return {
 reply: localized ?? REPLIES.en![intent]!,
 lang: language,
 intent,
 fallback: !localized,
 };
}

export function greetingFor(lang: LanguageCode): string {
 return REPLIES[lang]?.greeting ?? REPLIES.en!.greeting!;
}