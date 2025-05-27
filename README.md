# Jeancro - Modern E-Commerce Store

متجر إلكتروني حديث مبني بـ React وTypeScript مع دعم الذكاء الاصطناعي.

## ✨ المميزات

- 🛍️ متجر إلكتروني كامل للملابس
- 🤖 روبوت محادثة ذكي مدعوم بـ Google Gemini AI
- 🌍 دعم متعدد اللغات (العربية والإنجليزية)
- 📱 تصميم متجاوب لجميع الأجهزة
- 🎨 واجهة مستخدم حديثة مع Tailwind CSS
- 🛒 نظام سلة تسوق متقدم
- 👨‍💼 لوحة تحكم إدارية
- ⚡ أداء عالي مع Vite

## 🚀 التقنيات المستخدمة

- **Frontend**: React 18.3.1, TypeScript 5.7.2
- **Build Tool**: Vite 6.0.1
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM 6.28.0
- **AI**: Google Generative AI
- **Code Quality**: ESLint 9.15.0, Prettier 3.3.3

## 📋 المتطلبات

- Node.js (الإصدار 18 أو أحدث)
- npm أو yarn
- مفتاح Google Gemini API

## 🛠️ التثبيت والتشغيل

1. **استنساخ المشروع:**

   ```bash
   git clone <repository-url>
   cd jeancro---modern-e-commerce-store
   ```

2. **تثبيت التبعيات:**

   ```bash
   npm install
   ```

3. **إعداد متغيرات البيئة:**
   إنشاء ملف `.env.local` وإضافة مفتاح Gemini API:

   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **تشغيل المشروع في وضع التطوير:**

   ```bash
   npm run dev
   ```

5. **فتح المتصفح:**
   الانتقال إلى `http://localhost:3000`

## 🏗️ البناء للإنتاج

```bash
npm run build
```

## 🧹 فحص جودة الكود

```bash
# فحص ESLint
npm run lint

# إصلاح مشاكل ESLint تلقائياً
npm run lint:fix

# فحص أنواع TypeScript
npm run type-check
```

## 📁 هيكل المشروع

```
├── src/
│   ├── components.tsx     # مكونات واجهة المستخدم
│   ├── types.ts          # تعريفات الأنواع
│   ├── constants.ts      # الثوابت والبيانات
│   ├── geminiService.ts  # خدمة الذكاء الاصطناعي
│   └── App.tsx          # المكون الرئيسي
├── .vscode/             # إعدادات VS Code
├── public/              # الملفات العامة
└── dist/               # ملفات البناء
```

## 🔧 إعدادات التطوير

المشروع يتضمن إعدادات محسّنة لـ:

- ESLint للتحقق من جودة الكود
- Prettier لتنسيق الكود
- TypeScript للتحقق من الأنواع
- VS Code للتطوير المحسّن

## 🤝 المساهمة

نرحب بالمساهمات! يرجى اتباع الخطوات التالية:

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📝 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 الدعم

للدعم والمساعدة، يرجى فتح issue في GitHub أو التواصل عبر [الواتساب](https://wa.me/+1234567890).

---

تم تطوير هذا المشروع بـ ❤️ للمجتمع العربي
