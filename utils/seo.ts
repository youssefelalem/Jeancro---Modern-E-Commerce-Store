/**
 * نظام تحسين محركات البحث (SEO)
 * إدارة meta tags وStructured Data
 */

interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  price?: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
}

class SEOManager {
  private defaultData: SEOData;

  constructor() {
    this.defaultData = {
      title: 'جين كرو - متجر إلكتروني عصري',
      description: 'تسوق أفضل المنتجات العصرية مع تجربة تسوق مميزة وخدمة عملاء متميزة',
      keywords: ['متجر إلكتروني', 'تسوق أونلاين', 'منتجات عصرية', 'جين كرو'],
      type: 'website'
    };
  }

  /**
   * تحديث بيانات SEO للصفحة
   */
  public updateSEO(data: Partial<SEOData>): void {
    const seoData = { ...this.defaultData, ...data };
    
    this.updateTitle(seoData.title);
    this.updateMetaDescription(seoData.description);
    this.updateMetaKeywords(seoData.keywords);
    this.updateOpenGraph(seoData);
    this.updateTwitterCard(seoData);
    this.updateStructuredData(seoData);
  }

  /**
   * تحديث عنوان الصفحة
   */
  private updateTitle(title: string): void {
    document.title = title;
    this.updateMetaTag('property', 'og:title', title);
    this.updateMetaTag('name', 'twitter:title', title);
  }

  /**
   * تحديث وصف الصفحة
   */
  private updateMetaDescription(description: string): void {
    this.updateMetaTag('name', 'description', description);
    this.updateMetaTag('property', 'og:description', description);
    this.updateMetaTag('name', 'twitter:description', description);
  }

  /**
   * تحديث الكلمات المفتاحية
   */
  private updateMetaKeywords(keywords?: string[]): void {
    if (keywords && keywords.length > 0) {
      this.updateMetaTag('name', 'keywords', keywords.join(', '));
    }
  }

  /**
   * تحديث Open Graph tags
   */
  private updateOpenGraph(data: SEOData): void {
    this.updateMetaTag('property', 'og:type', data.type || 'website');
    this.updateMetaTag('property', 'og:site_name', 'جين كرو');
    
    if (data.url) {
      this.updateMetaTag('property', 'og:url', data.url);
    }
    
    if (data.image) {
      this.updateMetaTag('property', 'og:image', data.image);
      this.updateMetaTag('property', 'og:image:alt', data.title);
    }
  }

  /**
   * تحديث Twitter Card tags
   */
  private updateTwitterCard(data: SEOData): void {
    this.updateMetaTag('name', 'twitter:card', 'summary_large_image');
    this.updateMetaTag('name', 'twitter:site', '@jeancro_store');
    
    if (data.image) {
      this.updateMetaTag('name', 'twitter:image', data.image);
    }
  }

  /**
   * تحديث Structured Data (JSON-LD)
   */
  private updateStructuredData(data: SEOData): void {
    // إزالة الـ JSON-LD السابق إن وجد
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    let structuredData: any;

    if (data.type === 'product') {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: data.title,
        description: data.description,
        image: data.image,
        offers: {
          '@type': 'Offer',
          price: data.price,
          priceCurrency: data.currency || 'USD',
          availability: `https://schema.org/${data.availability || 'InStock'}`
        }
      };
    } else {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'جين كرو',
        description: data.description,
        url: data.url || window.location.href
      };
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  /**
   * تحديث meta tag
   */
  private updateMetaTag(attribute: string, value: string, content: string): void {
    let tag = document.querySelector(`meta[${attribute}="${value}"]`);
    
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attribute, value);
      document.head.appendChild(tag);
    }
    
    tag.setAttribute('content', content);
  }

  /**
   * تحديث SEO لصفحة المنتج
   */
  public updateProductSEO(product: {
    name: string;
    description: string;
    price: number;
    image?: string;
    category?: string;
    inStock?: boolean;
  }): void {    const seoData: SEOData = {
      title: `${product.name} - جين كرو`,
      description: product.description,
      keywords: [product.name, product.category || '', 'منتج', 'تسوق'],
      image: product.image || '',
      type: 'product',
      price: product.price,
      currency: 'USD',
      availability: product.inStock ? 'InStock' : 'OutOfStock',
      url: window.location.href
    };

    this.updateSEO(seoData);
  }

  /**
   * تحديث SEO لصفحة التصنيف
   */
  public updateCategorySEO(category: string, description: string): void {
    const seoData: SEOData = {
      title: `${category} - جين كرو`,
      description: description,
      keywords: [category, 'منتجات', 'تسوق', 'جين كرو'],
      type: 'website',
      url: window.location.href
    };

    this.updateSEO(seoData);
  }

  /**
   * إعادة تعيين SEO للصفحة الرئيسية
   */
  public resetToDefault(): void {
    this.updateSEO(this.defaultData);
  }

  /**
   * إضافة canonical URL
   */
  public setCanonicalURL(url: string): void {
    let link = document.querySelector('link[rel="canonical"]');
    
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    
    link.setAttribute('href', url);
  }

  /**
   * إضافة hreflang للغات متعددة
   */
  public setHrefLang(languages: { code: string; url: string }[]): void {
    // إزالة hreflang tags الموجودة
    document.querySelectorAll('link[rel="alternate"]').forEach(link => link.remove());

    languages.forEach(lang => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', lang.code);
      link.setAttribute('href', lang.url);
      document.head.appendChild(link);
    });
  }
}

// إنشاء instance واحد لإدارة SEO
export const seoManager = new SEOManager();

// تصدير النوع للاستخدام في أماكن أخرى
export type { SEOData };
