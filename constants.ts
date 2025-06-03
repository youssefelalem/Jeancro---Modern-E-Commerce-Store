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
    name: { EN: 'Crochet Jacket', AR: 'جاكيت كروشيه' },
    description: {
      EN: 'Handmade crochet jacket with vintage square patterns in cream and brown tones. Perfect for stylish, cozy outfits.',
      AR: 'جاكيت كروشيه يدوي بنقوش مربعة كلاسيكية بألوان الكريمي والبني. مثالي لإطلالة أنيقة ودافئة.'
    },
    price: 300,
    imageUrl: '/assets/img/image01.jpg',
    categoryId: 'cat1',
    // يمكنك إضافة حقول جديدة مثل:
    images: ['/assets/img/image01.jpg','/assets/img/image05.jpg', '/assets/img/image06.jpg'],
    details: {
      EN: {
        features: ['100% Cotton', 'Handmade', 'Vintage Design'],
        specifications: {
          'Material': 'Cotton',
          'Size': 'L',
          'Color': 'Cream & Brown'
        }
      },
      AR: {
        features: ['قطن 100%', 'صناعة يدوية', 'تصميم كلاسيكي'],
        specifications: {
          'الخامة': 'قطن',
          'المقاس': 'L',
          'اللون': 'كريمي وبني'
        }
      }
    }
  },  {
    id: 'prod2',
    name: { EN: 'Slim Fit Jeans', AR: 'جينز بقصة ضيقة' },
    description: { EN: 'Modern slim fit jeans for a stylish look.', AR: 'جينز عصري بقصة ضيقة لإطلالة أنيقة.' },
    price: 60,
    imageUrl: 'https://picsum.photos/seed/prod2/400/300',
    categoryId: 'cat1',
    images: ['https://picsum.photos/seed/prod2/400/300', 'https://picsum.photos/seed/prod2b/400/300'],
    details: {
      EN: {
        features: ['Slim Fit', 'Cotton Blend', 'Modern Design'],
        specifications: {
          'Material': 'Cotton & Elastane',
          'Size': 'M',
          'Color': 'Blue'
        }
      },
      AR: {
        features: ['قصة ضيقة', 'مزيج قطني', 'تصميم عصري'],
        specifications: {
          'الخامة': 'قطن وإيلاستين',
          'المقاس': 'M',
          'اللون': 'أزرق'
        }
      }
    }
  },  {
    id: 'prod3',
    name: { EN: 'Summer Dress', AR: 'فستان صيفي' },
    description: { EN: 'Light and airy summer dress.', AR: 'فستان صيفي خفيف ومتجدد الهواء.' },
    price: 45,
    imageUrl: 'https://picsum.photos/seed/prod3/400/300',
    categoryId: 'cat2',
    images: ['https://picsum.photos/seed/prod3/400/300', 'https://picsum.photos/seed/prod3b/400/300'],
    details: {
      EN: {
        features: ['Lightweight', 'Cotton Fabric', 'Summer Design'],
        specifications: {
          'Material': 'Cotton',
          'Size': 'M',
          'Color': 'White'
        }
      },
      AR: {
        features: ['خفيف الوزن', 'قماش قطني', 'تصميم صيفي'],
        specifications: {
          'الخامة': 'قطن',
          'المقاس': 'M',
          'اللون': 'أبيض'
        }
      }
    }
  },  {
    id: 'prod4',
    name: { EN: 'Leather Belt', AR: 'حزام جلدي' },
    description: { EN: 'Genuine leather belt with a classic buckle.', AR: 'حزام من الجلد الطبيعي بإبزيم كلاسيكي.' },
    price: 30,
    imageUrl: 'https://picsum.photos/seed/prod4/400/300',
    categoryId: 'cat4',
    images: ['https://picsum.photos/seed/prod4/400/300', 'https://picsum.photos/seed/prod4b/400/300'],
    details: {
      EN: {
        features: ['Genuine Leather', 'Classic Design', 'Durable'],
        specifications: {
          'Material': 'Leather',
          'Size': 'M',
          'Color': 'Brown'
        }
      },
      AR: {
        features: ['جلد طبيعي', 'تصميم كلاسيكي', 'متين'],
        specifications: {
          'الخامة': 'جلد',
          'المقاس': 'M',
          'اللون': 'بني'
        }
      }
    }
  },  {
    id: 'prod5',
    name: { EN: 'Kids Hoodie', AR: 'هودي أطفال' },
    description: { EN: 'Warm and cozy hoodie for kids.', AR: 'هودي دافئ ومريح للأطفال.' },
    price: 35,
    imageUrl: 'https://picsum.photos/seed/prod5/400/300',
    categoryId: 'cat3',
    images: ['https://picsum.photos/seed/prod5/400/300', 'https://picsum.photos/seed/prod5b/400/300'],
    details: {
      EN: {
        features: ['Warm Material', 'Kid Friendly', 'Easy Care'],
        specifications: {
          'Material': 'Cotton Blend',
          'Size': 'Kids L',
          'Color': 'Gray'
        }
      },
      AR: {
        features: ['خامة دافئة', 'مناسب للأطفال', 'سهل العناية'],
        specifications: {
          'الخامة': 'مزيج قطني',
          'المقاس': 'L أطفال',
          'اللون': 'رمادي'
        }
      }
    }
  },  {
    id: 'prod6',
    name: { EN: 'Elegant Blouse', AR: 'بلوزة أنيقة' },
    description: { EN: 'Chic blouse for formal or casual occasions.', AR: 'بلوزة أنيقة للمناسبات الرسمية أو غير الرسمية.' },
    price: 50,
    imageUrl: 'https://picsum.photos/seed/prod6/400/300',
    categoryId: 'cat2',
    images: ['https://picsum.photos/seed/prod6/400/300', 'https://picsum.photos/seed/prod6b/400/300'],
    details: {
      EN: {
        features: ['Elegant Design', 'Versatile Style', 'Premium Fabric'],
        specifications: {
          'Material': 'Silk Blend',
          'Size': 'M',
          'Color': 'White'
        }
      },
      AR: {
        features: ['تصميم أنيق', 'ستايل متعدد الاستخدامات', 'قماش فاخر'],
        specifications: {
          'الخامة': 'مزيج حرير',
          'المقاس': 'M',
          'اللون': 'أبيض'
        }
      }
    }
  },
];

export const INITIAL_ADS: Ad[] = [
  {
    id: 'ad1',
    imageUrl: 'https://picsum.photos/seed/ad1/800/200',
    linkUrl: '#',
    title: { EN: 'Summer Collection Out Now!', AR: 'تشكيلة الصيف متوفرة الآن!' },
    description: { EN: 'Discover the latest trends for this summer.', AR: 'اكتشف أحدث الصيحات لهذا الصيف.' },
    placement: 'homepage-banner',
    isActive: true,
  },
  {
    id: 'ad2',
    imageUrl: 'https://picsum.photos/seed/ad2/300/250',
    linkUrl: '#',
    title: { EN: 'Special Discount on Accessories', AR: 'خصم خاص على الإكسسوارات' },
    description: { EN: 'Get 20% off on all accessories.', AR: 'احصل على خصم 20% على جميع الإكسسوارات.' },
    placement: 'sidebar',
    isActive: true,
  },
];

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
