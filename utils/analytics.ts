/**
 * نظام التحليلات وتتبع سلوك المستخدمين
 * يدعم Google Analytics و Vercel Analytics
 */

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

interface UserProperties {
  language: string;
  currency: string;
  device_type: 'mobile' | 'tablet' | 'desktop';
  user_agent: string;
}

class AnalyticsManager {
  private isInitialized = false;
  private isProduction: boolean;
  private gaTrackingId?: string;

  constructor() {
    this.isProduction = import.meta.env.PROD;
    this.gaTrackingId = import.meta.env.VITE_GA_TRACKING_ID;
  }

  /**
   * تهيئة التحليلات
   */
  public initialize(): void {
    if (this.isInitialized || !this.isProduction) return;

    // تهيئة Google Analytics
    if (this.gaTrackingId) {
      this.initializeGoogleAnalytics();
    }

    // تهيئة Vercel Analytics
    this.initializeVercelAnalytics();

    this.isInitialized = true;
  }

  /**
   * تهيئة Google Analytics
   */
  private initializeGoogleAnalytics(): void {
    // إضافة Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaTrackingId}`;
    document.head.appendChild(script1);

    // إضافة كود التهيئة
    const script2 = document.createElement('script');
    script2.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${this.gaTrackingId}', {
        page_title: document.title,
        page_location: window.location.href
      });
    `;
    document.head.appendChild(script2);

    // إضافة gtag للwindow
    (window as any).gtag = (window as any).gtag || function() {
      ((window as any).dataLayer = (window as any).dataLayer || []).push(arguments);
    };
  }

  /**
   * تهيئة Vercel Analytics
   */
  private initializeVercelAnalytics(): void {
    // Vercel Analytics يتم تحميله تلقائياً في بيئة Vercel
    // يمكن إضافة تكوين إضافي هنا إذا لزم الأمر
    if (typeof window !== 'undefined' && 'va' in window) {
      console.log('Vercel Analytics initialized');
    }
  }

  /**
   * تتبع مشاهدة الصفحة
   */
  public trackPageView(page: string, title?: string): void {
    if (!this.isProduction) {
      console.log('Page view:', { page, title });
      return;
    }

    // Google Analytics
    if (this.gaTrackingId && (window as any).gtag) {
      (window as any).gtag('config', this.gaTrackingId, {
        page_path: page,
        page_title: title || document.title
      });
    }

    // Vercel Analytics
    if ((window as any).va) {
      (window as any).va('track', 'pageview', { page, title });
    }
  }

  /**
   * تتبع حدث مخصص
   */
  public trackEvent(event: AnalyticsEvent): void {
    if (!this.isProduction) {
      console.log('Event:', event);
      return;
    }

    // Google Analytics
    if (this.gaTrackingId && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters
      });
    }

    // Vercel Analytics
    if ((window as any).va) {
      (window as any).va('track', event.action, {
        category: event.category,
        label: event.label,
        value: event.value,
        ...event.custom_parameters
      });
    }
  }

  /**
   * تتبع المنتجات
   */
  public trackProductView(productId: string, productName: string, category: string, price: number): void {
    this.trackEvent({
      action: 'view_item',
      category: 'ecommerce',
      label: productName,
      custom_parameters: {
        item_id: productId,
        item_name: productName,
        item_category: category,
        price: price,
        currency: 'USD'
      }
    });
  }

  /**
   * تتبع إضافة إلى السلة
   */
  public trackAddToCart(productId: string, productName: string, quantity: number, price: number): void {
    this.trackEvent({
      action: 'add_to_cart',
      category: 'ecommerce',
      label: productName,
      value: price * quantity,
      custom_parameters: {
        item_id: productId,
        item_name: productName,
        quantity: quantity,
        price: price,
        currency: 'USD'
      }
    });
  }

  /**
   * تتبع إزالة من السلة
   */
  public trackRemoveFromCart(productId: string, productName: string, quantity: number, price: number): void {
    this.trackEvent({
      action: 'remove_from_cart',
      category: 'ecommerce',
      label: productName,
      value: price * quantity,
      custom_parameters: {
        item_id: productId,
        item_name: productName,
        quantity: quantity,
        price: price,
        currency: 'USD'
      }
    });
  }

  /**
   * تتبع بداية عملية الدفع
   */
  public trackBeginCheckout(cartItems: any[], totalValue: number): void {
    this.trackEvent({
      action: 'begin_checkout',
      category: 'ecommerce',
      value: totalValue,
      custom_parameters: {
        currency: 'USD',
        items: cartItems.map(item => ({
          item_id: item.id,
          item_name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      }
    });
  }

  /**
   * تتبع البحث
   */
  public trackSearch(searchTerm: string, resultsCount: number): void {
    this.trackEvent({
      action: 'search',
      category: 'engagement',
      label: searchTerm,
      value: resultsCount,
      custom_parameters: {
        search_term: searchTerm,
        results_count: resultsCount
      }
    });
  }

  /**
   * تتبع تغيير اللغة
   */
  public trackLanguageChange(from: string, to: string): void {
    this.trackEvent({
      action: 'language_change',
      category: 'user_preference',
      label: `${from}_to_${to}`,
      custom_parameters: {
        previous_language: from,
        new_language: to
      }
    });
  }

  /**
   * تتبع استخدام الدردشة الذكية
   */
  public trackChatbotInteraction(action: 'open' | 'close' | 'send_message', messageType?: string): void {
    this.trackEvent({
      action: `chatbot_${action}`,
      category: 'engagement',
      label: messageType,
      custom_parameters: {
        interaction_type: action,
        message_type: messageType
      }
    });
  }

  /**
   * تعيين خصائص المستخدم
   */
  public setUserProperties(properties: Partial<UserProperties>): void {
    if (!this.isProduction) {
      console.log('User properties:', properties);
      return;
    }

    // Google Analytics
    if (this.gaTrackingId && (window as any).gtag) {
      (window as any).gtag('config', this.gaTrackingId, {
        custom_map: properties
      });
    }
  }

  /**
   * تتبع أداء التطبيق
   */
  public trackPerformance(metricName: string, value: number, unit: string = 'ms'): void {
    this.trackEvent({
      action: 'performance_metric',
      category: 'performance',
      label: metricName,
      value: Math.round(value),
      custom_parameters: {
        metric_name: metricName,
        metric_value: value,
        metric_unit: unit
      }
    });
  }

  /**
   * تتبع الأخطاء
   */
  public trackError(errorMessage: string, errorType: string, fatal: boolean = false): void {
    this.trackEvent({
      action: 'exception',
      category: 'error',
      label: errorMessage,
      custom_parameters: {
        description: errorMessage,
        error_type: errorType,
        fatal: fatal
      }
    });
  }
}

// إنشاء instance واحد للتحليلات
export const analytics = new AnalyticsManager();

// تصدير الأنواع
export type { AnalyticsEvent, UserProperties };
