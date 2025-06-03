/**
 * نظام مراقبة الأداء للتطبيق
 * يتتبع أوقات التحميل والأخطاء
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url?: string;
}

interface ErrorLog {
  message: string;
  stack?: string;
  timestamp: number;
  url: string;
  userAgent: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private errors: ErrorLog[] = [];
  private isProduction: boolean;

  constructor() {
    this.isProduction = import.meta.env.PROD;
    this.initializeMonitoring();
  }

  /**
   * تهيئة مراقبة الأداء
   */
  private initializeMonitoring(): void {
    if (!this.isProduction) return;

    // مراقبة الأخطاء
    window.addEventListener('error', this.handleError.bind(this));
    window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));

    // مراقبة أداء التحميل
    window.addEventListener('load', this.measurePageLoad.bind(this));
  }

  /**
   * تسجيل خطأ JavaScript
   */
  private handleError(event: ErrorEvent): void {
    const errorLog: ErrorLog = {
      message: event.message,
      stack: event.error?.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.errors.push(errorLog);
    this.sendErrorToAnalytics(errorLog);
  }

  /**
   * تسجيل Promise rejection
   */
  private handlePromiseRejection(event: PromiseRejectionEvent): void {
    const errorLog: ErrorLog = {
      message: `Unhandled Promise Rejection: ${event.reason}`,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.errors.push(errorLog);
    this.sendErrorToAnalytics(errorLog);
  }

  /**
   * قياس أداء تحميل الصفحة
   */
  private measurePageLoad(): void {
    if (!window.performance) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    const metrics = [
      {
        name: 'page_load_time',
        value: navigation.loadEventEnd - navigation.fetchStart,
        timestamp: Date.now()
      },
      {
        name: 'dom_content_loaded',
        value: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        timestamp: Date.now()
      },
      {
        name: 'first_contentful_paint',
        value: this.getFirstContentfulPaint(),
        timestamp: Date.now()
      }
    ];

    metrics.forEach(metric => {
      this.metrics.push(metric);
      this.sendMetricToAnalytics(metric);
    });
  }

  /**
   * الحصول على وقت First Contentful Paint
   */
  private getFirstContentfulPaint(): number {
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
    return fcpEntry ? fcpEntry.startTime : 0;
  }

  /**
   * إرسال المقاييس للتحليل (يمكن ربطها بـ Google Analytics أو خدمة أخرى)
   */
  private sendMetricToAnalytics(metric: PerformanceMetric): void {
    // في الوقت الحالي، نحفظ في console للتطوير
    if (!this.isProduction) {
      console.log('Performance Metric:', metric);
    }

    // يمكن إضافة إرسال لخدمة تحليل هنا
    // مثل Google Analytics أو Vercel Analytics
  }

  /**
   * إرسال الأخطاء للتحليل
   */
  private sendErrorToAnalytics(error: ErrorLog): void {
    if (!this.isProduction) {
      console.error('Error logged:', error);
    }

    // يمكن إضافة إرسال لخدمة مراقبة الأخطاء هنا
    // مثل Sentry أو LogRocket
  }

  /**
   * تسجيل مقياس مخصص
   */
  public trackCustomMetric(name: string, value: number): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href
    };

    this.metrics.push(metric);
    this.sendMetricToAnalytics(metric);
  }

  /**
   * تتبع وقت تنفيذ دالة
   */
  public measureFunction<T>(name: string, fn: () => T): T {
    const startTime = performance.now();
    const result = fn();
    const endTime = performance.now();
    
    this.trackCustomMetric(`function_${name}`, endTime - startTime);
    
    return result;
  }

  /**
   * تتبع وقت تنفيذ دالة async
   */
  public async measureAsyncFunction<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    const result = await fn();
    const endTime = performance.now();
    
    this.trackCustomMetric(`async_function_${name}`, endTime - startTime);
    
    return result;
  }

  /**
   * الحصول على جميع المقاييس
   */
  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * الحصول على جميع الأخطاء
   */
  public getErrors(): ErrorLog[] {
    return [...this.errors];
  }

  /**
   * مسح البيانات المحفوظة
   */
  public clearData(): void {
    this.metrics = [];
    this.errors = [];
  }
}

// إنشاء instance واحد للمراقبة
export const performanceMonitor = new PerformanceMonitor();

// تصدير النوع للاستخدام في أماكن أخرى
export type { PerformanceMetric, ErrorLog };
