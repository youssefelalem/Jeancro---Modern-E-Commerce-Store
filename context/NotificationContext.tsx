/**
 * نظام الإشعارات المتقدم
 * يدعم أنواع مختلفة من الإشعارات مع تأثيرات بصرية جميلة
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';

// أنواع الإشعارات
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

// أنواع المواضع
export type NotificationPosition = 
  | 'top-right' 
  | 'top-left' 
  | 'bottom-right' 
  | 'bottom-left' 
  | 'top-center' 
  | 'bottom-center';

// واجهة الإشعار
export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number; // بالميلي ثانية، null = يبقى للأبد
  position?: NotificationPosition;
  actions?: NotificationAction[];
  icon?: React.ReactNode;
  dismissible?: boolean;
  progress?: boolean; // إظهار شريط التقدم
  persistent?: boolean; // لا يختفي تلقائياً
  createdAt: number;
}

// أحداث الإشعار
export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

// حالة الإشعارات
interface NotificationState {
  notifications: Notification[];
  defaultPosition: NotificationPosition;
  defaultDuration: number;
  maxNotifications: number;
}

// أحداث الإشعارات
type NotificationAction_Type =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL' }
  | { type: 'CLEAR_BY_TYPE'; payload: NotificationType }
  | { type: 'UPDATE_NOTIFICATION'; payload: { id: string; updates: Partial<Notification> } };

// الحالة الأولية
const initialState: NotificationState = {
  notifications: [],
  defaultPosition: 'top-right',
  defaultDuration: 5000, // 5 ثواني
  maxNotifications: 5
};

// Reducer
const notificationReducer = (
  state: NotificationState, 
  action: NotificationAction_Type
): NotificationState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      const newNotifications = [action.payload, ...state.notifications];
      // الحد من عدد الإشعارات
      if (newNotifications.length > state.maxNotifications) {
        newNotifications.splice(state.maxNotifications);
      }
      return {
        ...state,
        notifications: newNotifications
      };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };

    case 'CLEAR_ALL':
      return {
        ...state,
        notifications: []
      };

    case 'CLEAR_BY_TYPE':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.type !== action.payload)
      };

    case 'UPDATE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload.id
            ? { ...n, ...action.payload.updates }
            : n
        )
      };

    default:
      return state;
  }
};

// Context
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  clearByType: (type: NotificationType) => void;
  // وظائف سريعة
  success: (message: string, options?: Partial<Notification>) => string;
  error: (message: string, options?: Partial<Notification>) => string;
  warning: (message: string, options?: Partial<Notification>) => string;
  info: (message: string, options?: Partial<Notification>) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// مولد ID عشوائي
const generateId = () => Math.random().toString(36).substr(2, 9);

// مزود الإشعارات
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // إضافة إشعار
  const addNotification = useCallback((
    notification: Omit<Notification, 'id' | 'createdAt'>
  ): string => {
    const id = generateId();
    const newNotification: Notification = {
      id,
      createdAt: Date.now(),
      position: state.defaultPosition,
      duration: state.defaultDuration,
      dismissible: true,
      progress: true,
      ...notification
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });

    // إزالة تلقائية بعد المدة المحددة
    if (newNotification.duration && !newNotification.persistent) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
      }, newNotification.duration);
    }

    return id;
  }, [state.defaultPosition, state.defaultDuration]);

  // إزالة إشعار
  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  // مسح جميع الإشعارات
  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  // مسح الإشعارات حسب النوع
  const clearByType = useCallback((type: NotificationType) => {
    dispatch({ type: 'CLEAR_BY_TYPE', payload: type });
  }, []);

  // وظائف سريعة
  const success = useCallback((message: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'success',
      message,
      icon: '✅',
      ...options
    });
  }, [addNotification]);

  const error = useCallback((message: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'error',
      message,
      icon: '❌',
      duration: 8000, // أطول للأخطاء
      ...options
    });
  }, [addNotification]);

  const warning = useCallback((message: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'warning',
      message,
      icon: '⚠️',
      ...options
    });
  }, [addNotification]);

  const info = useCallback((message: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'info',
      message,
      icon: 'ℹ️',
      ...options
    });
  }, [addNotification]);

  const value: NotificationContextType = {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    clearAll,
    clearByType,
    success,
    error,
    warning,
    info
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook للوصول للإشعارات
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// مكون عرض الإشعارات
export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  // تجميع الإشعارات حسب الموضع
  const notificationsByPosition = notifications.reduce((acc, notification) => {
    const position = notification.position || 'top-right';
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(notification);
    return acc;
  }, {} as Record<NotificationPosition, Notification[]>);

  // أنماط CSS للمواضع المختلفة
  const getPositionClasses = (position: NotificationPosition): string => {
    const baseClasses = 'fixed z-50 flex flex-col gap-2 pointer-events-none';
    
    switch (position) {
      case 'top-right':
        return `${baseClasses} top-4 right-4`;
      case 'top-left':
        return `${baseClasses} top-4 left-4`;
      case 'bottom-right':
        return `${baseClasses} bottom-4 right-4`;
      case 'bottom-left':
        return `${baseClasses} bottom-4 left-4`;
      case 'top-center':
        return `${baseClasses} top-4 left-1/2 transform -translate-x-1/2`;
      case 'bottom-center':
        return `${baseClasses} bottom-4 left-1/2 transform -translate-x-1/2`;
      default:
        return `${baseClasses} top-4 right-4`;
    }
  };

  // أنماط CSS للأنواع المختلفة
  const getTypeClasses = (type: NotificationType): string => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-600 text-white';
      case 'error':
        return 'bg-red-500 border-red-600 text-white';
      case 'warning':
        return 'bg-yellow-500 border-yellow-600 text-white';
      case 'info':
        return 'bg-blue-500 border-blue-600 text-white';
      default:
        return 'bg-gray-500 border-gray-600 text-white';
    }
  };

  return (
    <>
      {Object.entries(notificationsByPosition).map(([position, positionNotifications]) => (
        <div
          key={position}
          className={getPositionClasses(position as NotificationPosition)}
        >
          {positionNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRemove={() => removeNotification(notification.id)}
              typeClasses={getTypeClasses(notification.type)}
            />
          ))}
        </div>
      ))}
    </>
  );
};

// مكون الإشعار الفردي
interface NotificationItemProps {
  notification: Notification;
  onRemove: () => void;
  typeClasses: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRemove,
  typeClasses
}) => {
  const [progress, setProgress] = React.useState(100);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // تأثير الظهور
    const showTimer = setTimeout(() => setIsVisible(true), 10);

    // شريط التقدم
    if (notification.progress && notification.duration && !notification.persistent) {      const interval = setInterval(() => {
        setProgress(() => {
          const elapsed = Date.now() - notification.createdAt;
          const remaining = Math.max(0, 100 - (elapsed / notification.duration!) * 100);
          return remaining;
        });
      }, 50);

      return () => {
        clearTimeout(showTimer);
        clearInterval(interval);
      };
    }

    return () => clearTimeout(showTimer);
  }, [notification]);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(onRemove, 300); // انتظار انتهاء الأنيميشن
  };

  return (
    <div
      className={`
        pointer-events-auto max-w-sm w-full shadow-lg rounded-lg border-l-4 overflow-hidden
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${typeClasses}
      `}
    >
      {/* شريط التقدم */}
      {notification.progress && notification.duration && !notification.persistent && (
        <div className="absolute top-0 left-0 h-1 bg-white bg-opacity-30 transition-all duration-50 ease-linear"
             style={{ width: `${progress}%` }} />
      )}

      {/* محتوى الإشعار */}
      <div className="p-4">
        <div className="flex items-start">
          {/* الأيقونة */}
          {notification.icon && (
            <div className="flex-shrink-0 ml-3">
              {typeof notification.icon === 'string' ? (
                <span className="text-lg">{notification.icon}</span>
              ) : (
                notification.icon
              )}
            </div>
          )}

          {/* النص */}
          <div className="flex-1">
            {notification.title && (
              <h4 className="text-sm font-medium mb-1">
                {notification.title}
              </h4>
            )}
            <p className="text-sm opacity-90">
              {notification.message}
            </p>

            {/* الأزرار */}
            {notification.actions && notification.actions.length > 0 && (
              <div className="mt-3 flex gap-2">
                {notification.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`
                      px-3 py-1 text-xs rounded font-medium
                      ${action.variant === 'danger' 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : action.variant === 'secondary'
                        ? 'bg-gray-600 hover:bg-gray-700'
                        : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                      }
                      transition-colors duration-200
                    `}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* زر الإغلاق */}
          {notification.dismissible && (
            <button
              onClick={handleRemove}
              className="flex-shrink-0 mr-2 text-white hover:text-gray-200 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// أمثلة على الاستخدام
export const notificationExamples = {
  // إشعار نجاح بسيط
  basicSuccess: (notify: NotificationContextType) => {
    notify.success('تم حفظ البيانات بنجاح!');
  },

  // إشعار خطأ مع أحداث
  errorWithActions: (notify: NotificationContextType) => {
    notify.error('فشل في حفظ البيانات', {
      title: 'خطأ في الخادم',
      persistent: true,
      actions: [
        { 
          label: 'إعادة المحاولة', 
          onClick: () => console.log('إعادة المحاولة'),
          variant: 'primary'
        },
        { 
          label: 'إلغاء', 
          onClick: () => console.log('إلغاء'),
          variant: 'secondary'
        }
      ]
    });
  },

  // إشعار معلومات مخصص
  customInfo: (notify: NotificationContextType) => {
    notify.addNotification({
      type: 'info',
      title: 'تحديث متوفر',
      message: 'يتوفر إصدار جديد من التطبيق',
      position: 'bottom-center',
      duration: 10000,
      icon: '🔄',
      actions: [
        { label: 'تحديث الآن', onClick: () => console.log('تحديث') },
        { label: 'لاحقاً', onClick: () => console.log('لاحقاً') }
      ]
    });
  }
};
