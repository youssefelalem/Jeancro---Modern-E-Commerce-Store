# 🔑 إعداد متغيرات البيئة في Vercel

## 🚨 **مهم: إضافة مفتاح Gemini API**

بعد رفع المشروع إلى Vercel، يجب إضافة متغيرات البيئة يدوياً من لوحة التحكم.

---

## 📋 **الخطوات المطلوبة:**

### **1. الانتقال لإعدادات المشروع**

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروعك `jeancro-ecommerce`
3. انقر على **Settings**
4. اختر **Environment Variables** من القائمة الجانبية

### **2. إضافة المتغيرات**

أضف المتغيرات التالية واحداً تلو الآخر:

#### **متغير Gemini API (مطلوب)**

```
Name: VITE_GEMINI_API_KEY
Value: [ضع مفتاح Gemini API الخاص بك هنا]
Environment: Production, Preview, Development
```

#### **متغيرات اختيارية إضافية**

```
Name: VITE_STORE_NAME
Value: جين كرو
Environment: Production, Preview, Development

Name: VITE_DEFAULT_LANGUAGE
Value: AR
Environment: Production, Preview, Development

Name: VITE_GA_TRACKING_ID
Value: [Google Analytics ID إذا كان متوفراً]
Environment: Production, Preview, Development
```

---

## 🔗 **الحصول على مفتاح Gemini API:**

1. **اذهب إلى:** [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **أنشئ مفتاح API جديد**
3. **انسخ المفتاح** وضعه في Vercel

---

## ✅ **التحقق من النجاح:**

بعد إضافة المتغيرات:

1. **أعد النشر** (Redeploy) من Vercel Dashboard
2. **اختبر الدردشة الذكية** في الموقع
3. **تأكد من عدم ظهور أخطاء** في Console

---

## 🚨 **ملاحظات مهمة:**

- ⚠️ **لا تشارك مفتاح API** مع أحد
- 🔄 **أعد النشر** بعد إضافة المتغيرات
- 🧪 **اختبر في Preview** قبل Production
- 📱 **اختبر على أجهزة مختلفة**

---

## 📞 **في حالة المشاكل:**

### **الدردشة لا تعمل:**

- تأكد من صحة مفتاح Gemini API
- تحقق من Console للأخطاء
- أعد النشر مرة أخرى

### **الموقع لا يعمل:**

- تأكد من Environment Variables
- تحقق من Build Logs في Vercel
- راجع إعدادات vercel.json

---

✨ **بعد اتباع هذه الخطوات، سيعمل موقعك بشكل مثالي!**
