import React, {
  ChangeEvent,
  createContext,
  FormEvent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import {
  AdBanner,
  AdminLoginForm,
  AdminPageTitle,
  AdminSidebar,
  Button,
  Card,
  CartView,
  ChatbotWidget,
  ConfirmationModal,
  Footer,
  InputField,
  LocalizedText,
  Modal,
  Navbar,
  PlusIcon,
  ProductCard,
  ProductModal,
  Table,
  Toast,
} from './components';
import {
  ADMIN_MOCK_PASSWORD,
  INITIAL_ADS,
  INITIAL_CATEGORIES,
  INITIAL_FAQS,
  INITIAL_PRODUCTS,
  INITIAL_STORE_SETTINGS,
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
} from './constants';
import { getChatbotResponse } from './geminiService';
import {
  Ad,
  CartItem,
  Category,
  ChatMessage,
  CrudItem,
  FAQ,
  LanguageCode,
  Product,
  StoreSettings,
  TranslationKeys,
  Translations,
} from './types';

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

interface AppContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  ads: Ad[];
  setAds: React.Dispatch<React.SetStateAction<Ad[]>>;
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  currentLanguage: LanguageCode;
  setCurrentLanguage: (lang: LanguageCode) => void;
  translations: Translations; // The object with all translations for the current language
  t: (key: TranslationKeys) => string; // The function to get a specific translation string
  storeSettings: StoreSettings;
  setStoreSettings: React.Dispatch<React.SetStateAction<StoreSettings>>;
  faqs: FAQ[];
  setFaqs: React.Dispatch<React.SetStateAction<FAQ[]>>;
  isChatbotOpen: boolean;
  toggleChatbot: () => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (message: string) => Promise<void>;
  isChatLoading: boolean;
  isAdminLoggedIn: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('jeancro-products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('jeancro-categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });
  const [ads, setAds] = useState<Ad[]>(() => {
    const saved = localStorage.getItem('jeancro-ads');
    return saved ? JSON.parse(saved) : INITIAL_ADS;
  });
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('jeancro-cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageCode>(
    () => {
      const savedLang = localStorage.getItem(
        'jeancro-language'
      ) as LanguageCode;
      return SUPPORTED_LANGUAGES.includes(savedLang)
        ? savedLang
        : INITIAL_STORE_SETTINGS.defaultLanguage;
    }
  );
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('jeancro-settings');
    return saved ? JSON.parse(saved) : INITIAL_STORE_SETTINGS;
  });
  const [faqs, setFaqs] = useState<FAQ[]>(() => {
    const saved = localStorage.getItem('jeancro-faqs');
    return saved ? JSON.parse(saved) : INITIAL_FAQS;
  });

  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('jeancro-admin-loggedin') === 'true';
  });

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    id: string;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem('jeancro-products', JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem('jeancro-categories', JSON.stringify(categories));
  }, [categories]);
  useEffect(() => {
    localStorage.setItem('jeancro-ads', JSON.stringify(ads));
  }, [ads]);
  useEffect(() => {
    localStorage.setItem('jeancro-cart', JSON.stringify(cartItems));
  }, [cartItems]);
  useEffect(() => {
    localStorage.setItem('jeancro-language', currentLanguage);
    document.documentElement.lang = currentLanguage.toLowerCase();
    document.documentElement.dir =
      currentLanguage === LanguageCode.AR ? 'rtl' : 'ltr';
  }, [currentLanguage]);
  useEffect(() => {
    localStorage.setItem('jeancro-settings', JSON.stringify(storeSettings));
  }, [storeSettings]);
  useEffect(() => {
    localStorage.setItem('jeancro-faqs', JSON.stringify(faqs));
  }, [faqs]);
  useEffect(() => {
    localStorage.setItem('jeancro-admin-loggedin', String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  const translations = TRANSLATIONS[currentLanguage];
  const t = useCallback(
    (key: TranslationKeys) => translations[key] || key,
    [translations]
  );

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, id: generateId() });
  };

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    showToast(t('itemAddedToCart'), 'success');
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    showToast(t('itemRemovedFromCart'), 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
      showToast(t('cartUpdated'), 'info');
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const setCurrentLanguage = (lang: LanguageCode) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      setCurrentLanguageState(lang);
    }
  };

  const toggleChatbot = () => setIsChatbotOpen(!isChatbotOpen);

  const sendChatMessage = async (messageText: string) => {
    const userMessage: ChatMessage = {
      id: generateId(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMessage]);
    setIsChatLoading(true);

    const historyForGemini = chatMessages
      .map(msg => ({
        role: msg.sender === 'user' ? ('user' as const) : ('model' as const),
        parts: [{ text: msg.text }],
      }))
      .filter(msg => msg.role === 'user' || msg.role === 'model'); // Filter out system messages if any were added

    try {
      const botResponseText = await getChatbotResponse(
        messageText,
        historyForGemini,
        faqs,
        currentLanguage
      );
      const botMessage: ChatMessage = {
        id: generateId(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending chat message:', error);
      const errorMessage: ChatMessage = {
        id: generateId(),
        text: t('errorOccurred'),
        sender: 'system',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const loginAdmin = (password: string) => {
    if (password === ADMIN_MOCK_PASSWORD) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    // Optionally navigate to home or login page
  };

  // أضف هذه الوظيفة للتحقق من تطابق البيانات
  const syncWithConstants = useCallback(() => {
    const savedProducts = localStorage.getItem('jeancro-products');
    const savedCategories = localStorage.getItem('jeancro-categories');
    const savedAds = localStorage.getItem('jeancro-ads');
    const savedFaqs = localStorage.getItem('jeancro-faqs');

    // إذا كانت البيانات المحفوظة مختلفة عن الثوابت، استخدم الثوابت
    if (JSON.stringify(JSON.parse(savedProducts || '[]')) !== JSON.stringify(INITIAL_PRODUCTS)) {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('jeancro-products', JSON.stringify(INITIAL_PRODUCTS));
    }

    if (JSON.stringify(JSON.parse(savedCategories || '[]')) !== JSON.stringify(INITIAL_CATEGORIES)) {
      setCategories(INITIAL_CATEGORIES);
      localStorage.setItem('jeancro-categories', JSON.stringify(INITIAL_CATEGORIES));
    }

    if (JSON.stringify(JSON.parse(savedAds || '[]')) !== JSON.stringify(INITIAL_ADS)) {
      setAds(INITIAL_ADS);
      localStorage.setItem('jeancro-ads', JSON.stringify(INITIAL_ADS));
    }

    if (JSON.stringify(JSON.parse(savedFaqs || '[]')) !== JSON.stringify(INITIAL_FAQS)) {
      setFaqs(INITIAL_FAQS);
      localStorage.setItem('jeancro-faqs', JSON.stringify(INITIAL_FAQS));
    }
  }, []);

  // استدعاء الوظيفة عند بدء التطبيق
  useEffect(() => {
    syncWithConstants();
  }, [syncWithConstants]);

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        categories,
        setCategories,
        ads,
        setAds,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        currentLanguage,
        setCurrentLanguage,
        translations,
        t,
        storeSettings,
        setStoreSettings,
        faqs,
        setFaqs,
        isChatbotOpen,
        toggleChatbot,
        chatMessages,
        sendChatMessage,
        isChatLoading,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        showToast,
      }}
    >
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          key={toast.id}
        />
      )}
    </AppContext.Provider>
  );
};

// Pages
const HomePage: React.FC = () => {
  const {
    products,
    categories,
    ads,
    addToCart,
    currentLanguage,
    t,
    storeSettings,
    translations,
    showToast,
  } = useAppContext(); // Added translations
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleFilter = useCallback(() => {
    let tempProducts = [...products];
    if (selectedCategory !== 'all') {
      tempProducts = tempProducts.filter(
        p => p.categoryId === selectedCategory
      );
    }
    if (searchTerm) {
      tempProducts = tempProducts.filter(
        p =>
          (p.name[currentLanguage] || p.name[LanguageCode.EN])
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (p.description[currentLanguage] || p.description[LanguageCode.EN])
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }
    if (minPrice) {
      tempProducts = tempProducts.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      tempProducts = tempProducts.filter(p => p.price <= parseFloat(maxPrice));
    }
    setFilteredProducts(tempProducts);
  }, [
    products,
    selectedCategory,
    searchTerm,
    minPrice,
    maxPrice,
    currentLanguage,
  ]);

  useEffect(() => {
    handleFilter();
  }, [handleFilter]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setFilteredProducts(products);
  };

  const activeAds = ads.filter(ad => ad.isActive);
  const homepageBannerAd = activeAds.find(
    ad => ad.placement === 'homepage-banner'
  );
  const sidebarAds = activeAds.filter(ad => ad.placement === 'sidebar');

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {homepageBannerAd && (
        <div className='mb-8'>
          <AdBanner
            ad={homepageBannerAd}
            currentLanguage={currentLanguage}
            translations={translations}
          />
        </div>
      )}
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Filters Sidebar */}
          <aside className='lg:col-span-1 bg-white p-6 rounded-lg shadow-lg h-fit'>
            <h2 className='text-xl font-semibold mb-4 text-gray-800'>
              {t('filterByCategory')}
            </h2>
            <div className='mb-6'>
              <label
                htmlFor='search'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                {t('search')}
              </label>
              <input
                type='text'
                id='search'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={t('searchProducts')}
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
              />
            </div>
            <div className='mb-6'>
              <label
                htmlFor='category'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                {t('category')}
              </label>
              <select
                id='category'
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white'
              >
                <option value='all'>{t('allCategories')}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    <LocalizedText value={cat.name} lang={currentLanguage} />
                  </option>
                ))}
              </select>
            </div>
            <div className='mb-6'>
              <h3 className='text-sm font-medium text-gray-700 mb-1'>
                {t('priceRange')}
              </h3>
              <div className='flex space-x-2'>
                <input
                  type='number'
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  placeholder={t('minPrice')}
                  className='w-1/2 p-2 border border-gray-300 rounded-md'
                />
                <input
                  type='number'
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  placeholder={t('maxPrice')}
                  className='w-1/2 p-2 border border-gray-300 rounded-md'
                />
              </div>
            </div>
            <div className='flex flex-col space-y-2'>
              <Button onClick={handleFilter} variant='primary'>
                {t('applyFilters')}
              </Button>
              <Button onClick={resetFilters} variant='outline'>
                {t('resetFilters')}
              </Button>
            </div>

            {sidebarAds.length > 0 && (
              <div className='mt-8'>
                <h3 className='text-lg font-semibold mb-3 text-gray-700'>
                  {t('internalAds')}
                </h3>
                {sidebarAds.map(ad => (
                  <AdBanner
                    key={ad.id}
                    ad={ad}
                    currentLanguage={currentLanguage}
                    translations={translations}
                  />
                ))}
              </div>
            )}
            {sidebarAds.length === 0 && (
              <div className='mt-8 text-sm text-gray-500'>
                {t('noAdsAvailable')}
              </div>
            )}
          </aside>

          {/* Products Grid */}
          <main className='lg:col-span-3'>
            <h1 className='text-3xl font-bold text-gray-800 mb-6'>
              {t('ourProducts')}
            </h1>
            {filteredProducts.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={p => {
                      addToCart(p);
                      showToast(t('itemAddedToCart'), 'success');
                    }}
                    currencySymbol={storeSettings.currencySymbol}
                    translations={translations}
                    currentLanguage={currentLanguage}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <div className='text-center py-10'>
                <p className='text-xl text-gray-600'>{t('noProductsFound')}</p>
              </div>
            )}
          </main>
        </div>
      </div>
      <ProductModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        product={selectedProduct}
        onAddToCart={p => {
          addToCart(p);
          showToast(t('itemAddedToCart'), 'success');
        }}
        currencySymbol={storeSettings.currencySymbol}
        translations={translations}
        currentLanguage={currentLanguage}
      />
    </div>
  );
};

const AdminLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentLanguage, logoutAdmin, translations } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin');
  };

  return (
    <div
      className={`flex h-screen bg-gray-100 ${currentLanguage === LanguageCode.AR ? 'flex-row-reverse' : ''}`}
    >
      <AdminSidebar
        translations={translations}
        currentLanguage={currentLanguage}
        onLogout={handleLogout}
      />{' '}
      {/* Pass translations object */}
      <main
        className={`flex-1 p-8 overflow-y-auto ${currentLanguage === LanguageCode.AR ? 'mr-64' : 'ml-64'}`}
      >
        {children}
      </main>
    </div>
  );
};

const AdminDashboardPage: React.FC = () => {
  const { products, categories, ads, t } = useAppContext();
  // Simulated data for visitors and orders
  const simulatedVisitors = 1258;
  const simulatedOrders = 58;

  const stats = [
    { label: t('totalProducts'), value: products.length, icon: '🛍️' },
    { label: t('totalCategories'), value: categories.length, icon: '🏷️' },
    {
      label: t('totalAds'),
      value: ads.filter(ad => ad.isActive).length,
      icon: '📢',
    },
    { label: t('simulatedVisitors'), value: simulatedVisitors, icon: '👥' },
    { label: t('simulatedOrders'), value: simulatedOrders, icon: '📦' },
  ];

  return (
    <div>
      <AdminPageTitle title={t('dashboard')} />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {stats.map(stat => (
          <Card key={stat.label} className='text-center'>
            <div className='text-4xl mb-2'>{stat.icon}</div>
            <h3 className='text-xl font-semibold text-gray-700'>
              {stat.label}
            </h3>
            <p className='text-3xl font-bold text-indigo-600 mt-1'>
              {stat.value}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Generic CRUD Page Component (Example for Products)
function createCrudPage<T extends CrudItem>(
  entityNameKey: TranslationKeys,
  getItems: () => T[],
  setItems: React.Dispatch<React.SetStateAction<T[]>>,
  initialFormState: Omit<T, 'id'>,
  formFieldsFactory: (
    item: Omit<T, 'id'>,
    onChange: (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => void,
    t: (key: TranslationKeys) => string, // Changed from translations: Translations
    currentLanguage: LanguageCode,
    categories?: Category[],
    onLocalizedChange?: (
      lang: LanguageCode,
      field: keyof Omit<T, 'id'>,
      value: string
    ) => void
  ) => ReactNode[],
  columnsFactory: (
    t: (key: TranslationKeys) => string, // Changed from translations: Translations
    currentLanguage: LanguageCode,
    categories?: Category[]
  ) => {
    key: keyof T | 'actions';
    header: string;
    render?: (item: T) => ReactNode;
  }[]
) {
  const CrudPage: React.FC = () => {
    const {
      t,
      translations,
      currentLanguage,
      categories: appCategories,
      showToast,
    } = useAppContext(); // Get both t and translations
    const items = getItems();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<T | null>(null);
    const [formData, setFormData] = useState<Omit<T, 'id'>>(initialFormState);
    const [itemToDelete, setItemToDelete] = useState<T | null>(null);

    const handleLocalizedChange = (
      lang: LanguageCode,
      field: keyof Omit<T, 'id'>,
      value: string
    ) => {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...(prev[field] as Record<LanguageCode, string>),
          [lang]: value,
        },
      }));
    };

    const handleChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target;
      if (type === 'checkbox') {
        setFormData(prev => ({
          ...prev,
          [name]: (e.target as HTMLInputElement).checked,
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: type === 'number' ? parseFloat(value) : value,
        }));
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const entityDisplayName = t(entityNameKey); // Use t for display
      if (editingItem) {
        setItems(prev =>
          prev.map(item =>
            item.id === editingItem.id
              ? ({ ...formData, id: editingItem.id } as T)
              : item
          )
        );
        showToast(`${entityDisplayName} ${t('cartUpdated')}`, 'success'); // Example: "Products updated!"
      } else {
        setItems(prev => [...prev, { ...formData, id: generateId() } as T]);
        showToast(`${entityDisplayName} ${t('itemAddedToCart')}`, 'success'); // Example: "Products added!"
      }
      closeModal();
    };

    const openModal = (item?: T) => {
      if (item) {
        setEditingItem(item);
        setFormData(item);
      } else {
        setEditingItem(null);
        const resetState = { ...initialFormState };
        Object.keys(resetState).forEach(key => {
          const K = key as keyof typeof resetState;
          // Ensure localized fields are reset to empty objects for EN/AR
          if (
            typeof resetState[K] === 'object' &&
            resetState[K] !== null &&
            initialFormState[K] &&
            typeof initialFormState[K] === 'object' &&
            'EN' in (initialFormState[K] as object) &&
            'AR' in (initialFormState[K] as object)
          ) {
            (resetState[K] as any) = {
              [LanguageCode.EN]: '',
              [LanguageCode.AR]: '',
            };
          }
        });
        setFormData(resetState);
      }
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setIsModalOpen(false);
      setEditingItem(null);
      const resetState = { ...initialFormState };
      Object.keys(resetState).forEach(key => {
        const K = key as keyof typeof resetState;
        if (
          typeof resetState[K] === 'object' &&
          resetState[K] !== null &&
          initialFormState[K] &&
          typeof initialFormState[K] === 'object' &&
          'EN' in (initialFormState[K] as object) &&
          'AR' in (initialFormState[K] as object)
        ) {
          (resetState[K] as any) = {
            [LanguageCode.EN]: '',
            [LanguageCode.AR]: '',
          };
        }
      });
      setFormData(resetState);
    };

    const handleDelete = (item: T) => {
      setItemToDelete(item);
    };

    const confirmDelete = () => {
      if (itemToDelete) {
        setItems(prev => prev.filter(i => i.id !== itemToDelete.id));
        const entityDisplayName = t(entityNameKey);
        showToast(`${entityDisplayName} ${t('removeFromCart')}`, 'info'); // Example: "Product removed."
        setItemToDelete(null);
      }
    };

    // Pass t function instead of the full translations object
    const columns = columnsFactory(
      t,
      currentLanguage,
      entityNameKey === 'manageProducts' ? appCategories : undefined
    );
    const formFields = formFieldsFactory(
      formData,
      handleChange,
      t,
      currentLanguage,
      entityNameKey === 'manageProducts' ? appCategories : undefined,
      handleLocalizedChange
    );

    return (
      <div>
        <div className='flex justify-between items-center mb-6'>
          <AdminPageTitle title={t(entityNameKey)} />
          <Button onClick={() => openModal()} variant='primary' size='md'>
            <PlusIcon className='h-5 w-5 mr-2' />
            {t('add')}{' '}
            {t(
              entityNameKey === 'manageProducts'
                ? 'products'
                : entityNameKey === 'manageCategories'
                  ? 'category'
                  : entityNameKey === 'manageAds'
                    ? 'adTitle' /* approx */
                    : entityNameKey === 'manageFAQs'
                      ? 'faqQuestion' /* approx */
                      : ('item' as TranslationKeys)
            )}
          </Button>
        </div>

        <Table<T>
          columns={columns}
          data={items}
          onEdit={openModal}
          onDelete={handleDelete}
          translations={translations} // Table still needs full translations for its internal actions like Edit/Delete button labels
          currentLanguage={currentLanguage}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={
            editingItem
              ? `${t('edit')} ${t(entityNameKey)}`
              : `${t('add')} ${t(entityNameKey)}`
          }
          size='lg'
        >
          <form onSubmit={handleSubmit} className='space-y-4'>
            {formFields}
            <div className='flex justify-end space-x-3 pt-4'>
              <Button type='button' onClick={closeModal} variant='outline'>
                {t('cancel')}
              </Button>
              <Button type='submit' variant='primary'>
                {t('saveChanges')}
              </Button>
            </div>
          </form>
        </Modal>

        <ConfirmationModal
          isOpen={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          onConfirm={confirmDelete}
          title={t('confirmDelete')}
          message={`${t('areYouSureDelete')} ${itemToDelete ? (typeof itemToDelete.name === 'object' ? itemToDelete.name[currentLanguage] : itemToDelete.name || itemToDelete.id) : ''}?`}
          translations={translations}
        />
      </div>
    );
  };
  return CrudPage;
}

const AdminProductsPage = createCrudPage<Product>(
  'manageProducts',
  () => useAppContext().products,
  setter => useAppContext().setProducts(setter),
  {
    name: { [LanguageCode.EN]: '', [LanguageCode.AR]: '' },
    description: { [LanguageCode.EN]: '', [LanguageCode.AR]: '' },
    price: 0,
    imageUrl: '',
    categoryId: '',
  },
  (item, onChange, t, lang, categories, onLocalizedChange) => [
    <InputField
      key='name'
      label={t('productName')}
      id='name'
      name='name'
      localizedValue={(item as Product).name}
      onLocalizedChange={(l, v) => onLocalizedChange?.(l, 'name', v)}
      lang={lang}
      required
    />,
    <InputField
      key='description'
      label={t('productDescription')}
      id='description'
      name='description'
      localizedValue={(item as Product).description}
      onLocalizedChange={(l, v) => onLocalizedChange?.(l, 'description', v)}
      lang={lang}
      isTextArea
      required
    />,
    <InputField
      key='price'
      label={t('productPrice')}
      id='price'
      name='price'
      type='number'
      value={(item as Product).price}
      onChange={onChange}
      required
    />,
    <InputField
      key='imageUrl'
      label={t('productImageURL')}
      id='imageUrl'
      name='imageUrl'
      value={(item as Product).imageUrl}
      onChange={onChange}
      required
      placeholder='https://example.com/image.jpg'
    />,
    <InputField
      key='categoryId'
      label={t('productCategory')}
      id='categoryId'
      name='categoryId'
      value={(item as Product).categoryId}
      onChange={onChange}
      options={categories?.map(c => ({
        value: c.id,
        label: c.name[lang] || c.name[LanguageCode.EN],
      }))}
      required
    />,
  ],
  (t, lang, categories) => [
    { key: 'name', header: t('productName') },
    {
      key: 'categoryId',
      header: t('productCategory'),
      render: item => (
        <LocalizedText
          value={
            categories?.find(c => c.id === item.categoryId)?.name || {
              EN: '',
              AR: '',
            }
          }
          lang={lang}
        />
      ),
    },
    {
      key: 'price',
      header: t('productPrice'),
      render: item =>
        `${useAppContext().storeSettings.currencySymbol}${item.price.toFixed(2)}`,
    },
    { key: 'actions', header: t('actions') },
  ]
);

const AdminCategoriesPage = createCrudPage<Category>(
  'manageCategories',
  () => useAppContext().categories,
  setter => useAppContext().setCategories(setter),
  { name: { [LanguageCode.EN]: '', [LanguageCode.AR]: '' } },
  (item, _onChange, t, lang, _, onLocalizedChange) => [
    <InputField
      key='name'
      label={t('categoryName')}
      id='name'
      name='name'
      localizedValue={(item as Category).name}
      onLocalizedChange={(l, v) => onLocalizedChange?.(l, 'name', v)}
      lang={lang}
      required
    />,
  ],
  t => [
    { key: 'name', header: t('categoryName') },
    { key: 'actions', header: t('actions') },
  ]
);

const AdminAdsPage = createCrudPage<Ad>(
  'manageAds',
  () => useAppContext().ads,
  setter => useAppContext().setAds(setter),
  {
    title: { [LanguageCode.EN]: '', [LanguageCode.AR]: '' },
    description: { [LanguageCode.EN]: '', [LanguageCode.AR]: '' },
    imageUrl: '',
    linkUrl: '#',
    placement: 'homepage-banner',
    isActive: true,
  },
  (item, _onChange, t, lang, _, onLocalizedChange) => [
    <InputField
      key='title'
      label={t('adTitle')}
      id='title'
      name='title'
      localizedValue={(item as Ad).title}
      onLocalizedChange={(l, v) => onLocalizedChange?.(l, 'title', v)}
      lang={lang}
      required
    />,
    <InputField
      key='description'
      label={t('adDescription')}
      id='description'
      name='description'
      localizedValue={(item as Ad).description}
      onLocalizedChange={(l, v) => onLocalizedChange?.(l, 'description', v)}
      lang={lang}
      isTextArea
      required
    />,
    <InputField
      key='imageUrl'
      label={t('adImageURL')}
      id='imageUrl'
      name='imageUrl'
      value={(item as Ad).imageUrl}
      onChange={_onChange}
      required
      placeholder='https://example.com/ad-image.jpg'
    />,
    <InputField
      key='linkUrl'
      label={t('adLinkURL')}
      id='linkUrl'
      name='linkUrl'
      value={(item as Ad).linkUrl}
      onChange={_onChange}
      placeholder='https://example.com/target-page'
    />,
    <InputField
      key='placement'
      label={t('adPlacement')}
      id='placement'
      name='placement'
      value={(item as Ad).placement}
      onChange={_onChange}
      options={[
        { value: 'homepage-banner', label: 'Homepage Banner' },
        { value: 'sidebar', label: 'Sidebar Ad' },
      ]}
      required
    />,
    <InputField
      key='isActive'
      label={t('adIsActive')}
      id='isActive'
      name='isActive'
      isCheckbox
      checked={(item as Ad).isActive}
      onChange={_onChange}
    />,
  ],
  t => [
    { key: 'title', header: t('adTitle') },
    { key: 'placement', header: t('adPlacement') },
    { key: 'isActive', header: t('adIsActive') },
    { key: 'actions', header: t('actions') },
  ]
);

const AdminChatbotPage: React.FC = () => {
  const { faqs, setFaqs } = useAppContext();

  const initialFaqState: Omit<FAQ, 'id'> = {
    question: { [LanguageCode.EN]: '', [LanguageCode.AR]: '' },
    answer: { [LanguageCode.EN]: '', [LanguageCode.AR]: '' },
  };

  const faqPage = createCrudPage<FAQ>(
    'manageFAQs' as TranslationKeys, // Explicitly cast if 'manageFAQs' is a TranslationKey
    () => faqs,
    setFaqs,
    initialFaqState,
    (item, _onChange, tFunc, lang, _, onLocalizedChange) => [
      // tFunc to avoid conflict with outer scope t
      <InputField
        key='question'
        label={tFunc('faqQuestion')}
        id='question'
        name='question'
        localizedValue={(item as FAQ).question}
        onLocalizedChange={(l, v) => onLocalizedChange?.(l, 'question', v)}
        lang={lang}
        required
      />,
      <InputField
        key='answer'
        label={tFunc('faqAnswer')}
        id='answer'
        name='answer'
        localizedValue={(item as FAQ).answer}
        onLocalizedChange={(l, v) => onLocalizedChange?.(l, 'answer', v)}
        lang={lang}
        isTextArea
        required
      />,
    ],
    tFunc => [
      // tFunc to avoid conflict
      { key: 'question', header: tFunc('faqQuestion') },
      { key: 'answer', header: tFunc('faqAnswer') },
      { key: 'actions', header: tFunc('actions') },
    ]
  );

  // Render the created CRUD page component
  const FaqCrudComponent = faqPage; // Assign to a variable starting with uppercase for JSX
  return <FaqCrudComponent />;
};

const AdminSettingsPage: React.FC = () => {
  const { storeSettings, setStoreSettings, t, showToast } = useAppContext();
  const [formData, setFormData] = useState<StoreSettings>(storeSettings);

  useEffect(() => {
    setFormData(storeSettings); // Sync with global state if it changes elsewhere
  }, [storeSettings]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialMediaLinks: {
        ...prev.socialMediaLinks,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStoreSettings(formData);
    showToast(t('settingsSuccessfullySaved'), 'success');
  };

  return (
    <div>
      <AdminPageTitle title={t('storeSettings')} />
      <Card>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <InputField
            label={t('storeName')}
            id='storeName'
            name='storeName'
            value={formData.storeName}
            onChange={handleChange}
            required
          />
          <InputField
            label={t('defaultLanguage')}
            id='defaultLanguage'
            name='defaultLanguage'
            value={formData.defaultLanguage}
            onChange={handleChange}
            options={SUPPORTED_LANGUAGES.map(lang => ({
              value: lang,
              label: lang,
            }))}
            required
          />
          <InputField
            label={t('currencySymbol')}
            id='currencySymbol'
            name='currencySymbol'
            value={formData.currencySymbol}
            onChange={handleChange}
            required
          />
          <InputField
            label={t('whatsappNumber')}
            id='whatsappNumber'
            name='whatsappNumber'
            value={formData.whatsappNumber}
            onChange={handleChange}
            required
            placeholder='+1234567890'
          />

          <fieldset className='border p-4 rounded-md'>
            <legend className='text-lg font-medium text-gray-700 px-1'>
              {t('socialMediaLinks')}
            </legend>
            <div className='space-y-4 mt-2'>
              <InputField
                label={t('facebook')}
                id='facebook'
                name='facebook'
                value={formData.socialMediaLinks?.facebook || ''}
                onChange={handleSocialChange}
                placeholder='https://facebook.com/yourpage'
              />
              <InputField
                label={t('instagram')}
                id='instagram'
                name='instagram'
                value={formData.socialMediaLinks?.instagram || ''}
                onChange={handleSocialChange}
                placeholder='https://instagram.com/yourprofile'
              />
              <InputField
                label={t('twitter')}
                id='twitter'
                name='twitter'
                value={formData.socialMediaLinks?.twitter || ''}
                onChange={handleSocialChange}
                placeholder='https://twitter.com/yourhandle'
              />
            </div>
          </fieldset>

          <div className='flex justify-end'>
            <Button type='submit' variant='primary'>
              {t('saveChanges')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

const AdminLoginPage: React.FC = () => {
  const { loginAdmin, t, translations } = useAppContext(); // Pass full translations object
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (password: string) => {
    if (loginAdmin(password)) {
      navigate('/admin/dashboard');
    } else {
      setError(t('loginFailed'));
    }
  };
  return (
    <AdminLoginForm
      onLogin={handleLogin}
      error={error}
      translations={translations}
    />
  );
};

const ProtectedAdminRoute: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isAdminLoggedIn } = useAppContext();
  if (!isAdminLoggedIn) {
    return <Navigate to='/admin' replace />;
  }
  return <AdminLayout>{children}</AdminLayout>;
};

// Main App Component
const App: React.FC = () => {
  const {
    storeSettings,
    cartItems,
    currentLanguage,
    setCurrentLanguage,
    translations,
    t,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    isChatbotOpen,
    toggleChatbot,
    chatMessages,
    sendChatMessage,
    isChatLoading,
    faqs,
    isAdminLoggedIn,
    logoutAdmin,
    showToast,
  } = useContext(AppContext)!; // Use non-null assertion as App is wrapped by AppProvider

  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    const messageParts: string[] = [
      `${t('orderSummary')}:`,
      ...cartItems.map(
        item =>
          `- ${item.name[currentLanguage] || item.name[LanguageCode.EN]} (x${item.quantity}): ${storeSettings.currencySymbol}${(item.price * item.quantity).toFixed(2)}`
      ),
      `${t('total')}: ${storeSettings.currencySymbol}${cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)}`,
    ];
    const whatsappMessage = encodeURIComponent(messageParts.join('\n'));
    const whatsappUrl = `https://wa.me/${storeSettings.whatsappNumber.replace(/\D/g, '')}?text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank');
    showToast(t('sendOrder'), 'success');
    clearCart(); // Optionally clear cart after sending
    setIsCartOpen(false);
  };

  return (
    <div
      className={`flex flex-col min-h-screen ${currentLanguage === LanguageCode.AR ? 'rtl' : 'ltr'}`}
      dir={currentLanguage === LanguageCode.AR ? 'rtl' : 'ltr'}
    >
      <Navbar
        storeName={storeSettings.storeName}
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        currentLanguage={currentLanguage}
        supportedLanguages={SUPPORTED_LANGUAGES}
        onLanguageChange={setCurrentLanguage}
        onCartClick={() => setIsCartOpen(true)}
        translations={translations}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={isAdminLoggedIn ? logoutAdmin : undefined}
      />
      <div className='flex-grow'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route
            path='/admin'
            element={
              isAdminLoggedIn ? (
                <Navigate to='/admin/dashboard' />
              ) : (
                <AdminLoginPage />
              )
            }
          />
          <Route
            path='/admin/dashboard'
            element={
              <ProtectedAdminRoute>
                <AdminDashboardPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path='/admin/products'
            element={
              <ProtectedAdminRoute>
                <AdminProductsPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path='/admin/categories'
            element={
              <ProtectedAdminRoute>
                <AdminCategoriesPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path='/admin/ads'
            element={
              <ProtectedAdminRoute>
                <AdminAdsPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path='/admin/chatbot'
            element={
              <ProtectedAdminRoute>
                <AdminChatbotPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path='/admin/settings'
            element={
              <ProtectedAdminRoute>
                <AdminSettingsPage />
              </ProtectedAdminRoute>
            }
          />
          {/* Catch-all for client-side, could redirect to home or a 404 component */}
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </div>
      <CartView
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateCartQuantity}
        onCheckout={handleCheckout}
        currencySymbol={storeSettings.currencySymbol}
        translations={translations}
        currentLanguage={currentLanguage}
      />
      <ChatbotWidget
        isOpen={isChatbotOpen}
        onToggle={toggleChatbot}
        messages={chatMessages}
        onSendMessage={sendChatMessage}
        faqs={faqs}
        currentLanguage={currentLanguage}
        translations={translations}
        isLoading={isChatLoading}
      />
      <Footer
        storeName={storeSettings.storeName}
        translations={translations}
        settings={storeSettings}
        currentLanguage={currentLanguage}
      />
    </div>
  );
};

const WrappedApp = () => (
  <AppProvider>
    <HashRouter>
      <App />
    </HashRouter>
  </AppProvider>
);

export default WrappedApp;
