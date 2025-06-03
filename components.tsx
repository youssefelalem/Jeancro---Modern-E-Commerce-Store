import {
  Ad,
  CartItem,
  ChatMessage,
  FAQ,
  LanguageCode,
  Product,
  StoreSettings,
  TranslationKeys,
  Translations,
} from '@/types'; // Changed import type
import React, {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Link, NavLink } from 'react-router-dom'; // Changed Link to NavLink for AdminSidebar

interface IconProps extends React.SVGProps<SVGSVGElement> {
  // No additional props needed for basic Heroicons usage
}

// Heroicons (Outline) - Manually include necessary icons as SVG components
// Or use a library if preferred, but sticking to basic SVGs for simplicity and control.

const ShoppingBagIcon: React.FC<IconProps> = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    {...props}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
    />
  </svg>
);

const UserCircleIcon: React.FC<IconProps> = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    {...props}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
    />
  </svg>
);

const XMarkIcon: React.FC<IconProps> = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    {...props}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M6 18L18 6M6 6l12 12'
    />
  </svg>
);

const TrashIcon: React.FC<IconProps> = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    {...props}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c.342.052.682.107 1.022.166m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09.922-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
    />
  </svg>
);

const PencilIcon: React.FC<IconProps> = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    {...props}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
    />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    {...props}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M12 4.5v15m7.5-7.5h-15'
    />
  </svg>
);

const MinusIcon: React.FC<IconProps> = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    {...props}
  >
    <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12h-15' />
  </svg>
);

const ChevronDownIcon: React.FC<IconProps> = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    {...props}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M19.5 8.25l-7.5 7.5-7.5-7.5'
    />
  </svg>
);

const ChatBubbleLeftEllipsisIcon: React.FC<IconProps> = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    {...props}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z'
    />
  </svg>
);

const PaperAirplaneIcon: React.FC<IconProps> = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    {...props}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5'
    />
  </svg>
);

interface LocalizedTextProps {
  value: Record<LanguageCode, string>;
  lang: LanguageCode;
  className?: string;
}

export const LocalizedText: React.FC<LocalizedTextProps> = ({
  value,
  lang,
  className,
}) => {
  return (
    <span className={className}>{value[lang] || value[LanguageCode.EN]}</span>
  );
};

interface NavbarProps {
  storeName: string;
  cartItemCount: number;
  currentLanguage: LanguageCode;
  supportedLanguages: LanguageCode[];
  onLanguageChange: (lang: LanguageCode) => void;
  onCartClick: () => void;
  translations: Translations;
  isAdminLoggedIn: boolean;
  onLogout?: (() => void) | undefined;
}

export const Navbar: React.FC<NavbarProps> = ({
  storeName,
  cartItemCount,
  currentLanguage,
  supportedLanguages,
  onLanguageChange,
  onCartClick,
  translations,
  isAdminLoggedIn,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className='bg-white shadow-md sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center'>
            <Link to='/' className='text-2xl font-bold text-indigo-600'>
              {storeName}
            </Link>
            <div className='hidden md:block'>
              <div
                className={`ml-10 flex items-baseline space-x-4 ${currentLanguage === LanguageCode.AR ? 'space-x-reverse' : ''}`}
              >
                <Link
                  to='/'
                  className='text-gray-700 hover:bg-indigo-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                >
                  {translations.home}
                </Link>
                {/* Products link can be added if there's a separate products page */}
              </div>
            </div>
          </div>
          <div className='hidden md:flex items-center space-x-3'>
            <LanguageSwitcher
              currentLanguage={currentLanguage}
              supportedLanguages={supportedLanguages}
              onLanguageChange={onLanguageChange}
              translations={translations}
            />
            <button
              onClick={onCartClick}
              className='relative text-gray-700 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100'
            >
              <ShoppingBagIcon className='h-6 w-6' />
              {cartItemCount > 0 && (
                <span className='absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2'>
                  {cartItemCount}
                </span>
              )}
            </button>
            <Link
              to='/admin'
              className='text-gray-700 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100'
            >
              <UserCircleIcon className='h-6 w-6' />
            </Link>
            {isAdminLoggedIn && onLogout && (
              <Button onClick={onLogout} variant='secondary' size='sm'>
                {translations.logout}
              </Button>
            )}
          </div>
          <div className='-mr-2 flex md:hidden'>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type='button'
              className='bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500'
              aria-controls='mobile-menu'
              aria-expanded='false'
            >
              <span className='sr-only'>Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className='block h-6 w-6'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
              ) : (
                <XMarkIcon className='block h-6 w-6' />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className='md:hidden' id='mobile-menu'>
          <div
            className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${currentLanguage === LanguageCode.AR ? 'text-right' : 'text-left'}`}
          >
            <Link
              to='/'
              className='text-gray-700 hover:bg-indigo-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {translations.home}
            </Link>
            <div className='px-3 py-2'>
              <LanguageSwitcher
                currentLanguage={currentLanguage}
                supportedLanguages={supportedLanguages}
                onLanguageChange={lang => {
                  onLanguageChange(lang);
                  setIsMobileMenuOpen(false);
                }}
                translations={translations}
                isMobile
              />
            </div>
            <button
              onClick={() => {
                onCartClick();
                setIsMobileMenuOpen(false);
              }}
              className='w-full text-left text-gray-700 hover:bg-indigo-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
            >
              {translations.cart} ({cartItemCount})
            </button>
            <Link
              to='/admin'
              className='text-gray-700 hover:bg-indigo-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {translations.admin}
            </Link>
            {isAdminLoggedIn && onLogout && (
              <Button
                onClick={() => {
                  if (onLogout) onLogout();
                  setIsMobileMenuOpen(false);
                }}
                variant='secondary'
                size='sm'
                className='w-full mt-2'
              >
                {translations.logout}
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

interface LanguageSwitcherProps {
  currentLanguage: LanguageCode;
  supportedLanguages: LanguageCode[];
  onLanguageChange: (lang: LanguageCode) => void;
  translations: Translations;
  isMobile?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLanguage,
  supportedLanguages,
  onLanguageChange,
  translations,
  isMobile = false,
}) => {
  if (isMobile) {
    return (
      <div className='flex flex-col space-y-1'>
        <span className='text-gray-600 text-sm font-medium mb-1'>
          {translations.selectLanguage}:
        </span>
        {supportedLanguages.map(lang => (
          <button
            key={lang}
            onClick={() => onLanguageChange(lang)}
            className={`w-full text-left px-2 py-1 rounded-md text-sm ${
              currentLanguage === lang
                ? 'bg-indigo-500 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            {lang === LanguageCode.EN ? 'English' : 'العربية'}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className='relative'>
      <select
        value={currentLanguage}
        onChange={e => onLanguageChange(e.target.value as LanguageCode)}
        className='appearance-none bg-transparent border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:border-indigo-500 text-sm'
        aria-label={translations.selectLanguage}
      >
        {supportedLanguages.map(lang => (
          <option key={lang} value={lang}>
            {lang === LanguageCode.EN ? 'English' : 'العربية'}
          </option>
        ))}
      </select>
      <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
        <ChevronDownIcon className='h-4 w-4' />
      </div>
    </div>
  );
};

interface FooterProps {
  storeName: string;
  translations: Translations;
  settings: StoreSettings;
  currentLanguage: LanguageCode;
}

export const Footer: React.FC<FooterProps> = ({
  storeName,
  translations,
  settings,
  currentLanguage,
}) => {
  return (
    <footer className='bg-gray-800 text-white mt-12'>
      <div className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div>
            <h3 className='text-lg font-semibold mb-2'>{storeName}</h3>
            <p className='text-sm text-gray-400'>
              {currentLanguage === LanguageCode.AR
                ? 'متجرك الأول للملابس العصرية.'
                : 'Your one-stop shop for trendy apparel.'}
            </p>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-2'>
              {currentLanguage === LanguageCode.AR
                ? 'روابط سريعة'
                : 'Quick Links'}
            </h3>
            <ul className='space-y-1'>
              <li>
                <Link to='/' className='text-gray-400 hover:text-white text-sm'>
                  {translations.home}
                </Link>
              </li>
              <li>
                <Link
                  to='/admin'
                  className='text-gray-400 hover:text-white text-sm'
                >
                  {translations.admin}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-2'>
              {currentLanguage === LanguageCode.AR ? 'تواصل معنا' : 'Follow Us'}
            </h3>
            <div className='flex space-x-4'>
              {settings.socialMediaLinks?.facebook && (
                <a
                  href={settings.socialMediaLinks.facebook}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-400 hover:text-white'
                >
                  Facebook
                </a>
              )}
              {settings.socialMediaLinks?.instagram && (
                <a
                  href={settings.socialMediaLinks.instagram}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-400 hover:text-white'
                >
                  Instagram
                </a>
              )}
              {settings.socialMediaLinks?.twitter && (
                <a
                  href={settings.socialMediaLinks.twitter}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-400 hover:text-white'
                >
                  Twitter
                </a>
              )}
            </div>
            {settings.whatsappNumber && (
              <p className='text-sm text-gray-400 mt-2'>
                {translations.whatsappNumber}: {settings.whatsappNumber}
              </p>
            )}
          </div>
        </div>
        <div className='mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-400'>
          &copy; {new Date().getFullYear()} {storeName}.{' '}
          {currentLanguage === LanguageCode.AR
            ? 'جميع الحقوق محفوظة.'
            : 'All rights reserved.'}
        </div>
      </div>
    </footer>
  );
};

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  currencySymbol: string;
  translations: Translations;
  currentLanguage: LanguageCode;
  onViewDetails: (product: Product) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  currencySymbol,
  translations,
  currentLanguage,
  onViewDetails,
  className = '',
}) => {
  return (
    <div className={`bg-white shadow-lg rounded-lg overflow-hidden flex flex-col group ${className}`}>
      <div className='relative h-56 w-full overflow-hidden'>
        <img
          src={product.imageUrl}
          alt={product.name[currentLanguage] || product.name[LanguageCode.EN]}
          className='max-w-full max-h-full object-cover group-hover:scale-105 transition-transform duration-300 object-position: center mx-auto'
        />
      </div>
      <div className='p-4 flex flex-col flex-grow'>
        <h3
          className='text-lg font-semibold text-gray-800 mb-1 truncate'
          title={product.name[currentLanguage] || product.name[LanguageCode.EN]}
        >
          <LocalizedText value={product.name} lang={currentLanguage} />
        </h3>
        <p
          className='text-sm text-gray-600 mb-2 h-10 overflow-hidden text-ellipsis'
          title={
            product.description[currentLanguage] ||
            product.description[LanguageCode.EN]
          }
        >
          <LocalizedText value={product.description} lang={currentLanguage} />
        </p>
        <p className='text-xl font-bold text-indigo-600 mt-auto mb-3'>
          {currencySymbol}
          {product.price.toFixed(2)}
        </p>
        <div className='mt-auto flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0'>
          <Button
            onClick={() => onAddToCart(product)}
            variant='primary'
            className='w-full sm:w-auto flex-grow'
          >
            {translations.addToCart}
          </Button>
          <Button
            onClick={() => onViewDetails(product)}
            variant='secondary'
            className='w-full sm:w-auto flex-grow'
          >
            {translations.details}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  currencySymbol: string;
  translations: Translations;
  currentLanguage: LanguageCode;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  currencySymbol,
  translations,
  currentLanguage,
}) => {
  if (!isOpen || !product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={translations.productDetails}
    >
      <div className='md:flex md:space-x-6'>
        <div className='md:w-1/2 mb-4 md:mb-0'>
          <img
            src={product.imageUrl}
            alt={product.name[currentLanguage] || product.name[LanguageCode.EN]}
            className='w-full h-auto max-h-96 object-contain rounded-lg shadow-md'
          />
        </div>
        <div className='md:w-1/2'>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>
            <LocalizedText value={product.name} lang={currentLanguage} />
          </h2>
          <p className='text-gray-600 mb-4'>
            <LocalizedText value={product.description} lang={currentLanguage} />
          </p>
          <p className='text-3xl font-bold text-indigo-600 mb-6'>
            {currencySymbol}
            {product.price.toFixed(2)}
          </p>
          <Button
            onClick={() => {
              onAddToCart(product);
              onClose();
            }}
            variant='primary'
            size='lg'
            className='w-full'
          >
            {translations.addToCart}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

interface AdBannerProps {
  ad: Ad;
  currentLanguage: LanguageCode;
  translations: Translations;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  ad,
  currentLanguage,
  // translations,
}) => {
  if (!ad.isActive) return null;

  return (
    <div
      className={`bg-gray-100 p-4 rounded-lg shadow my-4 ${ad.placement === 'homepage-banner' ? 'md:p-8' : 'md:p-4'}`}
    >
      <a
        href={ad.linkUrl}
        target='_blank'
        rel='noopener noreferrer'
        className='block group'
      >
        <img
          src={ad.imageUrl}
          alt={ad.title[currentLanguage] || ad.title[LanguageCode.EN]}
          className={`w-full rounded-md mb-3 ${ad.placement === 'homepage-banner' ? 'max-h-64' : 'max-h-48'} object-cover group-hover:opacity-90 transition-opacity`}
        />
        <h4 className='text-lg font-semibold text-indigo-700 group-hover:underline'>
          <LocalizedText value={ad.title} lang={currentLanguage} />
        </h4>
        <p className='text-sm text-gray-600'>
          <LocalizedText value={ad.description} lang={currentLanguage} />
        </p>
      </a>
    </div>
  );
};

interface CartViewProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onCheckout: () => void;
  currencySymbol: string;
  translations: Translations;
  currentLanguage: LanguageCode;
}

export const CartView: React.FC<CartViewProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
  currencySymbol,
  translations,
  currentLanguage,
}) => {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col ${currentLanguage === LanguageCode.AR ? 'text-right' : 'text-left'}`}
      >
        <div className='flex justify-between items-center p-4 border-b'>
          <h3 className='text-xl font-semibold text-gray-800'>
            {translations.cart}
          </h3>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <XMarkIcon className='h-6 w-6' />
          </button>
        </div>

        <div className='p-4 overflow-y-auto flex-grow'>
          {cartItems.length === 0 ? (
            <p className='text-gray-600 text-center py-8'>
              {translations.emptyCart}
            </p>
          ) : (
            <ul className='space-y-4'>
              {cartItems.map(item => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onRemoveItem={onRemoveItem}
                  onUpdateQuantity={onUpdateQuantity}
                  currencySymbol={currencySymbol}
                  translations={translations}
                  currentLanguage={currentLanguage}
                />
              ))}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className='p-4 border-t'>
            <div className='flex justify-between items-center mb-4'>
              <span className='text-lg font-semibold text-gray-700'>
                {translations.total}:
              </span>
              <span className='text-xl font-bold text-indigo-600'>
                {currencySymbol}
                {totalAmount.toFixed(2)}
              </span>
            </div>
            <Button
              onClick={onCheckout}
              variant='primary'
              size='lg'
              className='w-full'
            >
              {translations.checkoutViaWhatsApp}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

interface CartItemCardProps {
  item: CartItem;
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  currencySymbol: string;
  translations: Translations;
  currentLanguage: LanguageCode;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onRemoveItem,
  onUpdateQuantity,
  currencySymbol,
  // translations,
  currentLanguage,
}) => {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      onUpdateQuantity(item.id, newQuantity);
    } else if (newQuantity === 0) {
      onRemoveItem(item.id);
    }
  };

  return (
    <li className='flex items-center space-x-3 p-3 bg-gray-50 rounded-md'>
      <img
        src={item.imageUrl}
        alt={item.name[currentLanguage] || item.name[LanguageCode.EN]}
        className='w-16 h-16 rounded object-cover'
      />
      <div className='flex-grow'>
        <h4 className='text-sm font-semibold text-gray-800'>
          <LocalizedText value={item.name} lang={currentLanguage} />
        </h4>
        <p className='text-xs text-gray-600'>
          {currencySymbol}
          {item.price.toFixed(2)}
        </p>
      </div>
      <div className='flex items-center space-x-2'>
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className='p-1 rounded hover:bg-gray-200 text-gray-600'
        >
          <MinusIcon className='h-4 w-4' />
        </button>
        <span className='text-sm w-6 text-center'>{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className='p-1 rounded hover:bg-gray-200 text-gray-600'
        >
          <PlusIcon className='h-4 w-4' />
        </button>
      </div>
      <button
        onClick={() => onRemoveItem(item.id)}
        className='text-red-500 hover:text-red-700 p-1'
      >
        <TrashIcon className='h-5 w-5' />
      </button>
    </li>
  );
};

interface ChatbotWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => Promise<void>;
  faqs: FAQ[];
  currentLanguage: LanguageCode;
  translations: Translations;
  isLoading: boolean;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  isOpen,
  onToggle,
  messages,
  onSendMessage,
  faqs,
  currentLanguage,
  translations,
  isLoading,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (inputMessage.trim()) {
      await onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleFaqClick = async (question: string) => {
    // Simulate user sending the FAQ question
    // This will display the question as if user typed it, then bot will respond.
    await onSendMessage(question);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={onToggle}
          className='fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 z-50'
          aria-label={translations.askChatbot}
        >
          <ChatBubbleLeftEllipsisIcon className='h-8 w-8' />
        </button>
      )}

      {isOpen && (
        <div
          className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-96 h-full sm:h-[70vh] max-h-[600px] bg-white rounded-lg shadow-xl flex flex-col z-50 ${currentLanguage === LanguageCode.AR ? 'sm:left-6 sm:right-auto text-right' : 'text-left'}`}
        >
          <div className='flex justify-between items-center p-4 bg-indigo-600 text-white rounded-t-lg'>
            <h3 className='font-semibold'>
              {translations.chatWithOurAssistant}
            </h3>
            <button
              onClick={onToggle}
              className='text-indigo-200 hover:text-white'
            >
              <XMarkIcon className='h-6 w-6' />
            </button>
          </div>

          <div className='flex-grow p-4 overflow-y-auto space-y-3 bg-gray-50'>
            {messages.map(msg => (
              <ChatMessageBubble
                key={msg.id}
                message={msg}
                currentLanguage={currentLanguage}
              />
            ))}
            {isLoading && (
              <ChatMessageBubble
                message={{
                  id: 'loading',
                  text: translations.chatbotLoading,
                  sender: 'system',
                  timestamp: new Date(),
                }}
                currentLanguage={currentLanguage}
              />
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 0 && !isLoading && (
            <div className='p-4 border-t'>
              <p className='text-sm text-gray-600 mb-2'>
                {translations.chatbotWelcome}
              </p>
              <div className='space-y-1'>
                {faqs.slice(0, 3).map(faq => (
                  <Button
                    key={faq.id}
                    variant='outline'
                    size='sm'
                    className='w-full text-sm'
                    onClick={() =>
                      handleFaqClick(
                        faq.question[currentLanguage] ||
                          faq.question[LanguageCode.EN]
                      )
                    }
                  >
                    <LocalizedText
                      value={faq.question}
                      lang={currentLanguage}
                    />
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className='p-3 border-t bg-white'>
            <div className='flex items-center space-x-2'>
              <input
                type='text'
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyPress={e =>
                  e.key === 'Enter' && !isLoading && handleSend()
                }
                placeholder={translations.typeYourMessage}
                className='flex-grow p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm'
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !inputMessage.trim()}
                variant='primary'
                className='p-2'
              >
                <PaperAirplaneIcon className='h-5 w-5' />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface ChatMessageBubbleProps {
  message: ChatMessage;
  currentLanguage: LanguageCode;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  currentLanguage,
}) => {
  const isUser = message.sender === 'user';
  const isBot = message.sender === 'bot';
  const isSystem = message.sender === 'system';

  return (
    <div
      className={`flex ${isUser ? (currentLanguage === LanguageCode.AR ? 'justify-start' : 'justify-end') : currentLanguage === LanguageCode.AR ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] p-3 rounded-lg shadow ${
          isUser
            ? 'bg-indigo-500 text-white'
            : isBot
              ? 'bg-gray-200 text-gray-800'
              : 'bg-yellow-100 text-yellow-800 text-xs italic'
        } ${isUser ? (currentLanguage === LanguageCode.AR ? 'rounded-r-none' : 'rounded-l-none') : currentLanguage === LanguageCode.AR ? 'rounded-l-none' : 'rounded-r-none'}`}
      >
        <p className='text-sm whitespace-pre-wrap'>{message.text}</p>
        {!isSystem && (
          <p
            className={`text-xs mt-1 ${isUser ? 'text-indigo-200' : 'text-gray-500'} ${isUser ? 'text-right' : 'text-left'}`}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>
    </div>
  );
};

interface AdminLoginFormProps {
  onLogin: (password: string) => void;
  error?: string;
  translations: Translations;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  onLogin,
  error,
  translations,
}) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            {translations.adminLogin}
          </h2>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <input type='hidden' name='remember' defaultValue='true' />
          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <label htmlFor='password' className='sr-only'>
                {translations.password}
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                placeholder={translations.password}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className='text-sm text-red-600'>{error}</p>}

          <div>
            <Button type='submit' variant='primary' className='w-full'>
              {translations.login}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AdminSidebarProps {
  translations: Translations;
  currentLanguage: LanguageCode;
  onLogout: () => void;
}
export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  translations,
  currentLanguage,
  onLogout,
}) => {
  const commonLinkClass =
    'flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-500 hover:text-white rounded-lg transition-colors duration-150';
  const activeLinkClass = 'bg-indigo-600 text-white';

  const navItems = [
    { to: '/admin/dashboard', labelKey: 'dashboard' as TranslationKeys },
    { to: '/admin/products', labelKey: 'manageProducts' as TranslationKeys },
    {
      to: '/admin/categories',
      labelKey: 'manageCategories' as TranslationKeys,
    },
    { to: '/admin/ads', labelKey: 'manageAds' as TranslationKeys },
    { to: '/admin/chatbot', labelKey: 'chatbotManagement' as TranslationKeys }, // This was manageFAQs, changed to chatbotManagement based on labelKey
    { to: '/admin/settings', labelKey: 'storeSettings' as TranslationKeys },
  ];
  return (
    <div
      className={`w-64 bg-white shadow-lg h-screen fixed top-0 ${currentLanguage === LanguageCode.AR ? 'right-0 border-l' : 'left-0 border-r'} flex flex-col`}
    >
      <div className='p-6 border-b'>
        <h1 className='text-2xl font-bold text-indigo-600'>
          {translations.admin}
        </h1>
      </div>
      
      {/* رابط العودة للمتجر */}
      <div className='p-4 border-b'>
        <Link
          to='/'
          className='flex items-center px-4 py-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-150 border border-indigo-200'
        >
          <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
          </svg>
          {translations.backToStore}
        </Link>
      </div>
      
      <nav className='flex-grow p-4 space-y-2 overflow-y-auto'>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }: { isActive: boolean }) =>
              `${commonLinkClass} ${isActive ? activeLinkClass : ''}`
            }
          >
            {translations[item.labelKey]}
          </NavLink>
        ))}
      </nav>
      <div className='p-4 border-t'>
        <Button onClick={onLogout} variant='secondary' className='w-full'>
          {translations.logout}
        </Button>
      </div>
    </div>
  );
};

interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  type?: string;
  value?: string | number;
  onChange?: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  required?: boolean;
  options?: { value: string; label: string }[] | undefined;
  isTextArea?: boolean;
  isCheckbox?: boolean;
  checked?: boolean;
  lang?: LanguageCode;
  onLocalizedChange?: (lang: LanguageCode, value: string) => void;
  localizedValue?: Record<LanguageCode, string>;
  placeholder?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  required,
  options,
  isTextArea,
  isCheckbox,
  checked,
  lang,
  onLocalizedChange,
  localizedValue,
  placeholder,
}) => {
  const commonClasses =
    'mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';

  if (isCheckbox) {
    return (
      <div className='flex items-center'>
        <input
          id={id}
          name={name}
          type='checkbox'
          checked={checked}
          onChange={onChange}
          className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
        />
        <label htmlFor={id} className='ml-2 block text-sm text-gray-700'>
          {label}
        </label>
      </div>
    );
  }

  if (localizedValue && onLocalizedChange && lang) {
    return (
      <div>
        <label
          htmlFor={`${id}-${lang}`}
          className='block text-sm font-medium text-gray-700'
        >
          {label} ({lang.toUpperCase()})
        </label>
        {isTextArea ? (
          <textarea
            id={`${id}-${lang}`}
            name={`${name}-${lang}`}
            rows={3}
            className={commonClasses}
            value={localizedValue[lang] || ''}
            onChange={e => onLocalizedChange(lang, e.target.value)}
            required={required}
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            id={`${id}-${lang}`}
            name={`${name}-${lang}`}
            className={commonClasses}
            value={localizedValue[lang] || ''}
            onChange={e => onLocalizedChange(lang, e.target.value)}
            required={required}
            placeholder={placeholder}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={id} className='block text-sm font-medium text-gray-700'>
        {label}
      </label>
      {isTextArea ? (
        <textarea
          id={id}
          name={name}
          rows={3}
          className={commonClasses}
          value={value || ''}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
        />
      ) : options ? (
        <select
          id={id}
          name={name}
          className={commonClasses}
          value={value || ''}
          onChange={onChange}
          required={required}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          className={commonClasses}
          value={value || (type === 'number' ? 0 : '')}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center border font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150';

  const variants = {
    primary:
      'bg-indigo-600 hover:bg-indigo-700 text-white border-transparent focus:ring-indigo-500',
    secondary:
      'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-transparent focus:ring-indigo-500',
    danger:
      'bg-red-600 hover:bg-red-700 text-white border-transparent focus:ring-red-500',
    outline:
      'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 focus:ring-indigo-500',
    ghost:
      'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent focus:ring-indigo-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg
          className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
        >
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
          ></circle>
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4'
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col overflow-hidden`}
        onClick={e => e.stopPropagation()} // Prevent click inside modal from closing it
      >
        <div className='flex justify-between items-center p-4 border-b'>
          <h3 className='text-xl font-semibold text-gray-800'>{title}</h3>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <XMarkIcon className='h-6 w-6' />
          </button>
        </div>
        <div className='p-6 overflow-y-auto'>{children}</div>
      </div>
    </div>
  );
};

export const LoadingSpinner: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div className={`flex justify-center items-center p-8 ${className}`}>
    <svg
      className='animate-spin h-10 w-10 text-indigo-600'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
    >
      <circle
        className='opacity-25'
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        strokeWidth='4'
      ></circle>
      <path
        className='opacity-75'
        fill='currentColor'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
      ></path>
    </svg>
  </div>
);

interface TableProps<T> {
  columns: {
    key: keyof T | 'actions';
    header: string;
    render?: (item: T) => ReactNode;
  }[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  translations: Translations; // Expects the full translations object
  currentLanguage: LanguageCode;
}

export function Table<
  T extends { id: string; name?: Record<LanguageCode, string> | string },
>({
  columns,
  data,
  onEdit,
  onDelete,
  translations,
  currentLanguage,
}: TableProps<T>) {
  return (
    <div className='overflow-x-auto bg-white shadow rounded-lg'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            {columns.map(col => (
              <th
                key={String(col.key)}
                scope='col'
                className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${currentLanguage === LanguageCode.AR ? 'text-right' : 'text-left'}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center'
              >
                No data available.{' '}
                {/* This could be translated too if needed */}
              </td>
            </tr>
          )}
          {data.map(item => (
            <tr key={item.id} className='hover:bg-gray-50'>
              {columns.map(col => (
                <td
                  key={String(col.key)}
                  className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${currentLanguage === LanguageCode.AR ? 'text-right' : 'text-left'}`}
                >
                  {col.key === 'actions' ? (
                    <div
                      className={`flex space-x-2 ${currentLanguage === LanguageCode.AR ? 'flex-row-reverse space-x-reverse' : ''}`}
                    >
                      {onEdit && (
                        <Button
                          onClick={() => onEdit(item)}
                          variant='outline'
                          size='sm'
                        >
                          <PencilIcon className='h-4 w-4 mr-1' />
                          {translations.edit}
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          onClick={() => onDelete(item)}
                          variant='danger'
                          size='sm'
                        >
                          <TrashIcon className='h-4 w-4 mr-1' />
                          {translations.delete}
                        </Button>
                      )}
                    </div>
                  ) : col.render ? (
                    col.render(item)
                  ) : typeof item[col.key] === 'object' &&
                    item[col.key] !== null &&
                    typeof (item[col.key] as any).EN === 'string' &&
                    typeof (item[col.key] as any).AR === 'string' ? (
                    <LocalizedText
                      value={item[col.key] as Record<LanguageCode, string>}
                      lang={currentLanguage}
                    />
                  ) : typeof item[col.key] === 'boolean' ? (
                    item[col.key] ? (
                      translations.yesDelete.split(',')[0]
                    ) : (
                      translations.noCancel.split(',')[0]
                    ) // Basic Yes/No from existing translations
                  ) : (
                    String(item[col.key] ?? '')
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  translations: Translations;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  translations,
}) => {
  if (!isOpen) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size='sm'>
      <p className='text-gray-600 mb-6'>{message}</p>
      <div className='flex justify-end space-x-3'>
        <Button onClick={onClose} variant='outline'>
          {translations.noCancel}
        </Button>
        <Button onClick={onConfirm} variant='danger'>
          {translations.yesDelete}
        </Button>
      </div>
    </Modal>
  );
};

export const Toast: React.FC<{
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const bgColor =
    type === 'success'
      ? 'bg-green-500'
      : type === 'error'
        ? 'bg-red-500'
        : 'bg-blue-500';

  return (
    <div
      className={`fixed top-20 right-5 ${bgColor} text-white px-6 py-3 rounded-md shadow-lg z-[100] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {message}
      <button
        onClick={() => {
          setIsVisible(false);
          onClose();
        }}
        className='absolute top-1 right-1 text-white p-1'
      >
        <XMarkIcon className='h-4 w-4' />
      </button>
    </div>
  );
};

export const AdminPageTitle: React.FC<{ title: string }> = ({ title }) => (
  <h1 className='text-3xl font-bold text-gray-800 mb-6'>{title}</h1>
);

export const Card: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={`bg-white shadow-lg rounded-lg p-6 ${className}`}>
    {children}
  </div>
);
