# دليل إعداد متغيرات البيئة

=====================================

## نظرة عامة

هذا الدليل يوضح كيفية إعداد متغيرات البيئة المطلوبة لتشغيل المشروع بنجاح.

## الملفات المهمة

### `.env.local`

ملف متغيرات البيئة المحلية الذي يحتوي على الإعدادات الحقيقية للمشروع.

### `.env.example`

ملف مثال يوضح جميع المتغيرات المطلوبة والاختيارية.

## متغيرات البيئة المطلوبة

### 🔑 متغيرات API الأساسية

```bash
# مطلوب للذكاء الاصطناعي
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# عناوين API
VITE_API_URL=http://localhost:5173/api
VITE_BASE_URL=http://localhost:3000
```

### 🏪 إعدادات المتجر

```bash
VITE_STORE_NAME="Jeancro"
VITE_DEFAULT_LANGUAGE=AR
VITE_STORE_CURRENCY=MAD
VITE_STORE_CURRENCY_SYMBOL=د.م
```

### 🔧 إعدادات التطوير

```bash
VITE_DEBUG=true
VITE_ENVIRONMENT=development
NODE_ENV=development
```

## إعداد سريع

### 1. نسخ ملف المثال

```bash
copy .env.example .env.local
```

### 2. تحديث المفاتيح المطلوبة

افتح ملف `.env.local` وأضف:

- مفتاح Gemini API الخاص بك
- أي إعدادات أخرى حسب الحاجة

### 3. الحصول على مفتاح Gemini API

1. اذهب إلى [Google AI Studio](https://makersuite.google.com/app/apikey)
2. سجل الدخول بحساب Google
3. أنشئ مفتاح API جديد
4. انسخ المفتاح إلى `VITE_GEMINI_API_KEY`

## متغيرات اختيارية

### 📊 التحليلات

```bash
VITE_GA_TRACKING_ID=your_google_analytics_id
VITE_FACEBOOK_PIXEL_ID=your_facebook_pixel_id
```

### 💳 الدفع

```bash
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### 📧 البريد الإلكتروني

```bash
VITE_EMAIL_SERVICE_URL=your_email_service_url
VITE_CONTACT_EMAIL=support@jeancro.com
```

### ⚡ الأداء

```bash
VITE_STORAGE_TYPE=localStorage
VITE_CACHE_ENABLED=true
VITE_IMAGE_OPTIMIZATION=true
```

## النشر على Vercel

### إضافة متغيرات البيئة في Vercel:

1. **اذهب لـ Vercel Dashboard**
2. **اختر مشروعك**
3. **اذهب لـ Settings > Environment Variables**
4. **أضف كل متغير بشكل منفصل:**

```
Name: VITE_GEMINI_API_KEY
Value: [مفتاح API الخاص بك]
Environment: Production, Preview, Development
```

5. **كرر العملية للمتغيرات الأخرى حسب الحاجة**
6. **أعد النشر (Redeploy) لتفعيل التغييرات**

## نصائح أمنية ⚠️

### ✅ افعل

- استخدم `.env.local` للتطوير المحلي
- أضف متغيرات البيئة من لوحة تحكم Vercel للإنتاج
- احتفظ بمفاتيح API في مكان آمن
- راجع بانتظام من له حق الوصول للمفاتيح

### ❌ لا تفعل

- لا تدفع ملف `.env.local` إلى Git
- لا تشارك مفاتيح API في الرسائل أو البريد الإلكتروني
- لا تضع مفاتيح الإنتاج في بيئة التطوير
- لا تترك مفاتيح API الافتراضية في الإنتاج

## استكشاف الأخطاء

### خطأ: مفتاح API غير موجود

```bash
# تحقق من وجود الملف
ls -la .env.local

# تحقق من محتوى الملف
cat .env.local
```

### خطأ: المتغيرات غير محملة

1. تأكد من أن اسم الملف `.env.local` صحيح
2. تأكد من أن المتغيرات تبدأ بـ `VITE_`
3. أعد تشغيل خادم التطوير

### خطأ: API لا يعمل

1. تحقق من صحة مفتاح API
2. تحقق من حالة خدمة Gemini
3. راجع وحدة التحكم للأخطاء

## الدعم

إذا واجهت أي مشاكل، يرجى:

1. مراجعة هذا الدليل أولاً
2. التحقق من ملف README الرئيسي
3. التواصل مع فريق التطوير
