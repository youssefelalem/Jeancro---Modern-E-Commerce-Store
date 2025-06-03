/**
 * مكتبة التحقق من صحة البيانات
 * تحتوي على وظائف التحقق من البيانات المختلفة
 */

// أنواع القواعد للتحقق
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: string) => boolean;
  errorMessage?: string;
}

// نتيجة التحقق
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * التحقق من البريد الإلكتروني
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    errors.push('البريد الإلكتروني مطلوب');
  } else if (!emailPattern.test(email)) {
    errors.push('صيغة البريد الإلكتروني غير صحيحة');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * التحقق من كلمة المرور
 */
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];

  if (!password) {
    errors.push('كلمة المرور مطلوبة');
  } else {
    if (password.length < 8) {
      errors.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * التحقق من اسم المنتج
 */
export const validateProductName = (name: string): ValidationResult => {
  const errors: string[] = [];

  if (!name || name.trim() === '') {
    errors.push('اسم المنتج مطلوب');
  } else {
    if (name.length < 2) {
      errors.push('اسم المنتج يجب أن يكون حرفين على الأقل');
    }
    if (name.length > 100) {
      errors.push('اسم المنتج يجب أن يكون أقل من 100 حرف');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * التحقق من سعر المنتج
 */
export const validateProductPrice = (price: string): ValidationResult => {
  const errors: string[] = [];
  const priceNumber = parseFloat(price);

  if (!price) {
    errors.push('سعر المنتج مطلوب');
  } else if (isNaN(priceNumber)) {
    errors.push('سعر المنتج يجب أن يكون رقماً صحيحاً');
  } else if (priceNumber <= 0) {
    errors.push('سعر المنتج يجب أن يكون أكبر من الصفر');
  } else if (priceNumber > 1000000) {
    errors.push('سعر المنتج مرتفع جداً');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * التحقق من رابط الصورة
 */
export const validateImageURL = (url: string): ValidationResult => {
  const errors: string[] = [];
  const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  const imagePattern = /\.(jpg|jpeg|png|gif|webp|svg)$/i;

  if (!url) {
    errors.push('رابط الصورة مطلوب');
  } else {
    if (!urlPattern.test(url)) {
      errors.push('صيغة الرابط غير صحيحة');
    } else if (!imagePattern.test(url)) {
      errors.push('الرابط يجب أن يؤدي إلى صورة (jpg, png, gif, webp, svg)');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * التحقق من النص العام
 */
export const validateText = (
  text: string, 
  rules: ValidationRule
): ValidationResult => {
  const errors: string[] = [];

  // التحقق من الحقل المطلوب
  if (rules.required && (!text || text.trim() === '')) {
    errors.push(rules.errorMessage || 'هذا الحقل مطلوب');
    return { isValid: false, errors };
  }

  // إذا كان النص فارغاً وغير مطلوب، فهو صحيح
  if (!text && !rules.required) {
    return { isValid: true, errors: [] };
  }

  // التحقق من الحد الأدنى للطول
  if (rules.minLength && text.length < rules.minLength) {
    errors.push(`يجب أن يكون النص ${rules.minLength} أحرف على الأقل`);
  }

  // التحقق من الحد الأقصى للطول
  if (rules.maxLength && text.length > rules.maxLength) {
    errors.push(`يجب أن يكون النص أقل من ${rules.maxLength} حرف`);
  }

  // التحقق من النمط (Pattern)
  if (rules.pattern && !rules.pattern.test(text)) {
    errors.push(rules.errorMessage || 'صيغة النص غير صحيحة');
  }

  // التحقق المخصص
  if (rules.customValidator && !rules.customValidator(text)) {
    errors.push(rules.errorMessage || 'قيمة غير صحيحة');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * تنظيف النص من الأحرف الضارة
 */
export const sanitizeText = (text: string): string => {
  if (!text) return '';
  
  return text
    .trim()
    .replace(/[<>]/g, '') // إزالة أقواس HTML
    .replace(/javascript:/gi, '') // إزالة javascript:
    .replace(/on\w+=/gi, '') // إزالة event handlers
    .replace(/script/gi, ''); // إزالة كلمة script
};

/**
 * التحقق من مجموعة حقول النموذج
 */
export const validateForm = (
  formData: Record<string, string>,
  validationRules: Record<string, ValidationRule>
): { isValid: boolean; errors: Record<string, string[]> } => {
  const errors: Record<string, string[]> = {};
  let isFormValid = true;

  for (const [fieldName, rules] of Object.entries(validationRules)) {
    const fieldValue = formData[fieldName] || '';
    const validationResult = validateText(fieldValue, rules);
    
    if (!validationResult.isValid) {
      errors[fieldName] = validationResult.errors;
      isFormValid = false;
    }
  }

  return {
    isValid: isFormValid,
    errors
  };
};

/**
 * قائمة بالكلمات المحظورة (يمكن توسيعها)
 */
const FORBIDDEN_WORDS = [
  'spam', 'scam', 'hack', 'virus', 'malware'
];

/**
 * التحقق من وجود كلمات محظورة
 */
export const containsForbiddenWords = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return FORBIDDEN_WORDS.some(word => lowerText.includes(word));
};

/**
 * مثال على استخدام التحقق المتقدم
 */
export const validateProductForm = (productData: {
  name: string;
  description: string;
  price: string;
  imageURL: string;
  category: string;
}) => {
  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
      customValidator: (value: string) => !containsForbiddenWords(value),
      errorMessage: 'اسم المنتج يحتوي على كلمات غير مسموحة'
    },
    description: {
      required: true,
      minLength: 10,
      maxLength: 500,
      customValidator: (value: string) => !containsForbiddenWords(value),
      errorMessage: 'الوصف يحتوي على كلمات غير مسموحة'
    },
    category: {
      required: true,
      minLength: 1,
      errorMessage: 'يجب اختيار فئة للمنتج'
    }
  };

  // التحقق من النموذج العام
  const formValidation = validateForm(productData, validationRules);
  
  // التحقق المخصص للسعر
  const priceValidation = validateProductPrice(productData.price);
  
  // التحقق المخصص لرابط الصورة
  const imageValidation = validateImageURL(productData.imageURL);

  // دمج النتائج
  const errors = { ...formValidation.errors };
  
  if (!priceValidation.isValid) {
    errors.price = priceValidation.errors;
  }
  
  if (!imageValidation.isValid) {
    errors.imageURL = imageValidation.errors;
  }

  return {
    isValid: formValidation.isValid && priceValidation.isValid && imageValidation.isValid,
    errors
  };
};
