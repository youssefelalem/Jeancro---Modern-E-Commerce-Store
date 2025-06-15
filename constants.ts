import { Product, Category, Ad, FAQ, StoreSettings, LanguageCode, Translations } from './types';

export const DEFAULT_LANGUAGE: LanguageCode = LanguageCode.EN;
export const SUPPORTED_LANGUAGES: LanguageCode[] = [LanguageCode.EN, LanguageCode.AR];
export const STORE_NAME = 'Jeancro';
export const DEFAULT_CURRENCY_SYMBOL = 'د.م';
export const WHATSAPP_NUMBER = '+12345678900'; // Replace with actual WhatsApp number
export const ADMIN_MOCK_PASSWORD = 'admin'; // For demo purposes

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat1', name: { EN: 'Men', AR: 'رجال' } },
  { id: 'cat2', name: { EN: 'Women', AR: 'نساء' } },
  { id: 'cat3', name: { EN: 'Kids', AR: 'أطفال' } },
  { id: 'cat4', name: { EN: 'Accessories', AR: 'إكسسوارات' } },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
  id: 'prod1',
  name: { 
    EN: 'Versatile Vogue Jacket', 
    AR: 'جاكيت الأناقة المتجددة' 
  },
  description: {
    EN: 'Reversible handmade jacket with one side in cozy crochet featuring vintage square patterns, and the other in stylish white denim. Two looks in one — perfect for versatile, trendy outfits.',
    AR: 'جاكيت يدوي بوجهين: وجه من الكروشيه بنقوش مربعة كلاسيكية ووجه آخر من الجينز الأبيض الأنيق. إطلالتان في قطعة واحدة، مثالية لمظهر أنيق ومتعدد الاستخدامات.'
  },
  price: 1500,
  imageUrl: '/assets/img/image01.jpg',
  categoryId: 'cat1',
  inStock: true,
  images: [
    '/assets/img/image01.jpg',
    '/assets/img/image02.jpg',
    '/assets/img/image03.jpg'
  ],
  details: {
    EN: {
      features: ['Reversible', 'Handmade', 'Vintage Crochet & White Denim'],
      specifications: {
        'Material': 'Cotton Crochet & White Denim',
        'Size': 'L',
        'Color': 'Cream, Brown & White'
      }
    },
    AR: {
      features: ['بوجهين', 'صناعة يدوية', 'كروشيه كلاسيكي وجينز أبيض'],
      specifications: {
        'الخامة': 'كروشيه قطني وجينز أبيض',
        'المقاس': 'L',
        'الألوان': 'كريمي، بني، وأبيض'
      }
    }
  }
},
{
  "id": "prod2",
  "name": { 
    "EN": "Crochet Bomber Jacket", 
    "AR": "جاكيت بومبر كروشيه" 
  },
  "description": {
    "EN": "A vibrant, handmade bomber-style jacket crafted from crochet. It features a stunning large granny square design on the back, with smaller matching squares on the front and sleeves. The bold red, white, and black color combination makes it a unique statement piece that's both cozy and stylish.",
    "AR": "جاكيت بومبر حيوي مصنوع يدوياً من الكروشيه. يتميز بتصميم مذهل من مربع جدة كبير على الظهر، مع مربعات متطابقة أصغر على الأمام والأكمام. مزيج الألوان الجريء من الأحمر والأبيض والأسود يجعله قطعة فريدة تعبر عن الأناقة والدفء في آن واحد."
  },
  "price": 1850,
  "imageUrl": "/assets/img/image05.jpg",
  "categoryId": "cat2",
  "inStock": true,
  "images": [
    "/assets/img/image04.jpg",
    "/assets/img/image05.jpg",
    "/assets/img/image06.jpg",
    "/assets/img/image07.jpg"
  ],
  "details": {
    "EN": {
      "features": ["100% Handmade", "Unique Granny Square Pattern", "Bomber Style Fit"],
      "specifications": {
        "Material": "Thick Cotton Yarn",
        "Size": "L / Oversized",
        "Color": "Red, White, Black"
      }
    },
    "AR": {
      "features": ["صناعة يدوية 100%", "نقشة مربعات الجدة الفريدة", "قصة بومبر عصرية"],
      "specifications": {
        "الخامة": "خيوط قطن سميكة",
        "المقاس": "لارج / قصة واسعة",
        "الألوان": "أحمر، أبيض، أسود"
      }
    }
  }
}
];

export const INITIAL_ADS: Ad[] = [];

export const INITIAL_FAQS: FAQ[] = [
  {
    id: 'faq1',
    question: { EN: 'What are the shipping options?', AR: 'ما هي خيارات الشحن؟' },
    answer: { EN: 'We offer standard and express shipping.', AR: 'نحن نقدم الشحن القياسي والسريع.' },
  },
  {
    id: 'faq2',
    question: { EN: 'What is your return policy?', AR: 'ما هي سياسة الإرجاع الخاصة بكم؟' },
    answer: { EN: 'You can return items within 30 days of purchase.', AR: 'يمكنك إرجاع المنتجات خلال 30 يومًا من تاريخ الشراء.' },
  },
  {
    id: 'faq3',
    question: { EN: 'How can I track my order?', AR: 'كيف يمكنني تتبع طلبي؟' },
    answer: { EN: 'Once your order is shipped, you will receive a tracking number via email.', AR: 'بمجرد شحن طلبك، ستتلقى رقم تتبع عبر البريد الإلكتروني.' },
  },
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: STORE_NAME,
  defaultLanguage: DEFAULT_LANGUAGE,
  currencySymbol: DEFAULT_CURRENCY_SYMBOL,
  whatsappNumber: WHATSAPP_NUMBER,
  socialMediaLinks: {
    facebook: 'https://facebook.com/jeancro',
    instagram: 'https://instagram.com/jeancro',
    twitter: 'https://twitter.com/jeancro',
  },
  appearance: {
    primaryColor: '#4F46E5', // اللون الأساسي (Indigo)
    accentColor: '#EC4899', // لون الإبراز (Pink)
    logo: '/assets/img/logo.png',
    bannerImage: '/assets/img/banner.jpg',
    darkMode: false,
  },
  seo: {
    metaTitle: {
      EN: 'Jeancro - Modern E-Commerce Store',
      AR: 'جينكرو - متجر إلكتروني حديث'
    },
    metaDescription: {
      EN: 'Discover our collection of modern clothing and accessories.',
      AR: 'اكتشف مجموعتنا من الملابس والإكسسوارات الحديثة.'
    },
    keywords: {
      EN: 'clothing, fashion, online shopping, accessories, modern',
      AR: 'ملابس، أزياء، تسوق إلكتروني، إكسسوارات، حديث'
    }
  },
  chatbot: {
    enabled: true,
    welcomeMessage: {
      EN: 'Welcome to Jeancro! How can I help you today?',
      AR: 'مرحباً بك في جينكرو! كيف يمكنني مساعدتك اليوم؟'
    },
    autoShowOnPage: false
  },
  shipping: {
    freeShippingThreshold: 500,
    shippingCost: 50,
    shippingMethods: ['Standard Shipping', 'Express Shipping']
  }
};

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  [LanguageCode.EN]: {
    appName: 'Jeancro',
    home: 'Home',
    products: 'Products',
    cart: 'Cart',
    admin: 'Admin',
    login: 'Login',
    logout: 'Logout',
    addToCart: 'Add to Cart',
    removeFromCart: 'Remove',
    viewCart: 'View Cart',
    checkoutViaWhatsApp: 'Checkout via WhatsApp',
    quantity: 'Qty',
    price: 'Price',
    total: 'Total',
    emptyCart: 'Your cart is empty.',
    searchProducts: 'Search products...',
    filterByCategory: 'Filter by Category',
    allCategories: 'All Categories',
    productName: 'Product Name',
    productDescription: 'Description',
    productPrice: 'Price',
    productCategory: 'Category',
    productImageURL: 'Image URL',
    categoryName: 'Category Name',
    adTitle: 'Ad Title',
    adDescription: 'Ad Description',
    adImageURL: 'Ad Image URL',
    adLinkURL: 'Ad Link URL',
    adPlacement: 'Placement',
    adIsActive: 'Active',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    new: 'New',
    dashboard: 'Dashboard',
    manageProducts: 'Manage Products',
    manageCategories: 'Manage Categories',
    manageAds: 'Manage Ads',
    storeSettings: 'Store Settings',
    chatbotManagement: 'Chatbot Management',
    statistics: 'Statistics',
    totalProducts: 'Total Products',
    totalCategories: 'Total Categories',
    totalAds: 'Total Ads',
    simulatedVisitors: 'Simulated Visitors',
    simulatedOrders: 'Simulated Orders Sent',
    storeName: 'Store Name',
    defaultLanguage: 'Default Language',
    currencySymbol: 'Currency Symbol',
    whatsappNumber: 'WhatsApp Number',
    socialMediaLinks: 'Social Media Links',
    facebook: 'Facebook',
    instagram: 'Instagram',
    twitter: 'Twitter',
    faqQuestion: 'Question',
    faqAnswer: 'Answer',
    askChatbot: 'Ask Jeancro Bot',
    typeYourMessage: 'Type your message...',
    sendMessage: 'Send',
    chatbotWelcome: 'Hello! How can I help you today? You can ask about our products, shipping, or return policy. Here are some common questions:',
    chatbotLoading: 'Jeancro Bot is thinking...',
    errorOccurred: 'An error occurred. Please try again.',
    password: 'Password',
    adminLogin: 'Admin Login',
    loginFailed: 'Login Failed. Invalid password.',
    selectLanguage: 'Select Language',
    ourProducts: 'Our Products',
    featuredAds: 'Featured Ads',
    confirmDelete: 'Confirm Delete',
    areYouSureDelete: 'Are you sure you want to delete this item?',
    yesDelete: 'Yes, Delete',
    noCancel: 'No, Cancel',
    actions: 'Actions',
    description: 'Description',
    title: 'Title',
    link: 'Link',
    imageURL: 'Image URL',
    placement: 'Placement',
    active: 'Active',
    internalAds: 'Internal Ads',
    quickHelp: 'Quick Help',
    failedToParseJsonResponse: 'Failed to parse JSON response from AI.',
    noProductsFound: 'No products found matching your criteria.',
    continueShopping: 'Continue Shopping',
    orderSummary: 'Order Summary',
    sendOrder: 'Send Order via WhatsApp',
    selectCategory: 'Select Category',
    all: 'All',
    priceRange: 'Price Range',
    minPrice: 'Min Price',
    maxPrice: 'Max Price',
    applyFilters: 'Apply Filters',
    resetFilters: 'Reset Filters',
    details: 'Details',
    manageFAQs: 'Manage FAQs',
    addFAQ: 'Add FAQ',
    editFAQ: 'Edit FAQ',
    deleteFAQ: 'Delete FAQ',
    question: 'Question',
    answer: 'Answer',
    settingsSuccessfullySaved: 'Settings saved successfully!',
    itemAddedToCart: 'Item added to cart!',
    itemRemovedFromCart: 'Item removed from cart.',
    cartUpdated: 'Cart updated.',
    chatWithOurAssistant: 'Chat with our Assistant',
    howCanIHelpYou: 'How can I help you today?',
    search: 'Search',
    category: 'Category',
    productDetails: 'Product Details',    close: 'Close',
    noAdsAvailable: 'No ads available at the moment.',
    learnMore: 'Learn More',
    features: 'Features',
    specifications: 'Specifications',
    productNotFound: 'Product Not Found',
    goBack: 'Go Back',
    inStock: 'In Stock',
    exploreOurCollection: 'Explore Our Collection',
    productsFound: 'Products Found',
    sortBy: 'Sort By',
    name: 'Name',
    priceLowToHigh: 'Price: Low to High',
    priceHighToLow: 'Price: High to Low',
    newest: 'Newest',
    showing: 'Showing',
    of: 'of',
    tryDifferentFilters: 'Try different filters',
    previous: 'Previous',
    next: 'Next',
    backToStore: 'Back to Store',
  },
  [LanguageCode.AR]: {
    appName: 'جينكرو',
    home: 'الرئيسية',
    products: 'المنتجات',
    cart: 'السلة',
    admin: 'الإدارة',
    login: 'دخول',
    logout: 'خروج',
    addToCart: 'أضف إلى السلة',
    removeFromCart: 'إزالة',
    viewCart: 'عرض السلة',
    checkoutViaWhatsApp: 'الدفع عبر واتساب',
    quantity: 'الكمية',
    price: 'السعر',
    total: 'الإجمالي',
    emptyCart: 'سلتك فارغة.',
    searchProducts: 'ابحث عن المنتجات...',
    filterByCategory: 'تصفية حسب الفئة',
    allCategories: 'جميع الفئات',
    productName: 'اسم المنتج',
    productDescription: 'الوصف',
    productPrice: 'السعر',
    productCategory: 'الفئة',
    productImageURL: 'رابط الصورة',
    categoryName: 'اسم الفئة',
    adTitle: 'عنوان الإعلان',
    adDescription: 'وصف الإعلان',
    adImageURL: 'رابط صورة الإعلان',
    adLinkURL: 'رابط الإعلان',
    adPlacement: 'مكان العرض',
    adIsActive: 'نشط',
    saveChanges: 'حفظ التغييرات',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    new: 'جديد',
    dashboard: 'لوحة التحكم',
    manageProducts: 'إدارة المنتجات',
    manageCategories: 'إدارة الفئات',
    manageAds: 'إدارة الإعلانات',
    storeSettings: 'إعدادات المتجر',
    chatbotManagement: 'إدارة الشات بوت',
    statistics: 'الإحصائيات',
    totalProducts: 'إجمالي المنتجات',
    totalCategories: 'إجمالي الفئات',
    totalAds: 'إجمالي الإعلانات',
    simulatedVisitors: 'الزوار (محاكاة)',
    simulatedOrders: 'الطلبات المرسلة (محاكاة)',
    storeName: 'اسم المتجر',
    defaultLanguage: 'اللغة الافتراضية',
    currencySymbol: 'رمز العملة',
    whatsappNumber: 'رقم واتساب',
    socialMediaLinks: 'روابط التواصل الاجتماعي',
    facebook: 'فيسبوك',
    instagram: 'انستجرام',
    twitter: 'تويتر',
    faqQuestion: 'السؤال',
    faqAnswer: 'الإجابة',
    askChatbot: 'اسأل جينكرو بوت',
    typeYourMessage: 'اكتب رسالتك...',
    sendMessage: 'إرسال',
    chatbotWelcome: 'مرحباً! كيف يمكنني مساعدتك اليوم؟ يمكنك السؤال عن منتجاتنا، الشحن، أو سياسة الإرجاع. إليك بعض الأسئلة الشائعة:',
    chatbotLoading: 'جينكرو بوت يفكر...',
    errorOccurred: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    password: 'كلمة المرور',
    adminLogin: 'دخول المسؤول',
    loginFailed: 'فشل تسجيل الدخول. كلمة مرور خاطئة.',
    selectLanguage: 'اختر اللغة',
    ourProducts: 'منتجاتنا',
    featuredAds: 'إعلانات مميزة',
    confirmDelete: 'تأكيد الحذف',
    areYouSureDelete: 'هل أنت متأكد أنك تريد حذف هذا العنصر؟',
    yesDelete: 'نعم، احذف',
    noCancel: 'لا، ألغِ',
    actions: 'الإجراءات',
    description: 'الوصف',
    title: 'العنوان',
    link: 'الرابط',
    imageURL: 'رابط الصورة',
    placement: 'الموضع',
    active: 'نشط',
    internalAds: 'الإعلانات الداخلية',
    quickHelp: 'مساعدة سريعة',
    failedToParseJsonResponse: 'فشل في تحليل استجابة JSON من الذكاء الاصطناعي.',
    noProductsFound: 'لم يتم العثور على منتجات تطابق معاييرك.',
    continueShopping: 'متابعة التسوق',
    orderSummary: 'ملخص الطلب',
    sendOrder: 'إرسال الطلب عبر واتساب',
    selectCategory: 'اختر الفئة',
    all: 'الكل',
    priceRange: 'نطاق السعر',
    minPrice: 'أقل سعر',
    maxPrice: 'أعلى سعر',
    applyFilters: 'تطبيق الفلاتر',
    resetFilters: 'إعادة تعيين الفلاتر',
    details: 'تفاصيل',
    manageFAQs: 'إدارة الأسئلة الشائعة',
    addFAQ: 'إضافة سؤال شائع',
    editFAQ: 'تعديل سؤال شائع',
    deleteFAQ: 'حذف سؤال شائع',
    question: 'السؤال',
    answer: 'الجواب',
    settingsSuccessfullySaved: 'تم حفظ الإعدادات بنجاح!',
    itemAddedToCart: 'تمت إضافة المنتج إلى السلة!',
    itemRemovedFromCart: 'تمت إزالة المنتج من السلة.',
    cartUpdated: 'تم تحديث السلة.',
    chatWithOurAssistant: 'تحدث مع مساعدنا',
    howCanIHelpYou: 'كيف يمكنني مساعدتك اليوم؟',    search: 'بحث',
    category: 'الفئة',
    productDetails: 'تفاصيل المنتج',    close: 'إغلاق',
    noAdsAvailable: 'لا توجد إعلانات متاحة في الوقت الحالي.',
    learnMore: 'اعرف المزيد',
    features: 'المميزات',
    specifications: 'المواصفات',
    productNotFound: 'المنتج غير موجود',
    goBack: 'العودة',
    inStock: 'متوفر في المخزون',
    exploreOurCollection: 'استكشف مجموعتنا',
    productsFound: 'منتج موجود',
    sortBy: 'ترتيب حسب',
    name: 'الاسم',
    priceLowToHigh: 'السعر: من الأقل للأعلى',
    priceHighToLow: 'السعر: من الأعلى للأقل',
    newest: 'الأحدث',
    showing: 'عرض',
    of: 'من',
    tryDifferentFilters: 'جرب فلاتر مختلفة',
    previous: 'السابق',
    next: 'التالي',
    backToStore: 'العودة للمتجر',
  },
};
