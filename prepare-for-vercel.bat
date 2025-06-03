@echo off
echo 🚀 تحضير المشروع للنشر على Vercel...
echo.

echo ✅ الخطوة 1: فحص البنية...
if not exist "dist" mkdir dist
if not exist "public" mkdir public

echo ✅ الخطوة 2: تنظيف المشروع...
if exist "dist" rmdir /s /q dist
npm run clean 2>nul

echo ✅ الخطوة 3: فحص package.json...
echo   - فحص البرامج النصية...
findstr /c:"build" package.json >nul
if errorlevel 1 (
    echo   ❌ لم يتم العثور على سكريبت build
    exit /b 1
) else (
    echo   ✅ سكريبت build موجود
)

echo ✅ الخطوة 4: تثبيت التبعيات...
npm install

echo ✅ الخطوة 5: بناء المشروع...
npm run build

echo ✅ الخطوة 6: فحص النتيجة...
if exist "dist\index.html" (
    echo   ✅ تم بناء المشروع بنجاح
    echo   📁 مجلد dist جاهز للنشر
) else (
    echo   ❌ فشل في بناء المشروع
    exit /b 1
)

echo.
echo 🎉 المشروع جاهز للنشر على Vercel!
echo.
echo 📋 الخطوات التالية:
echo   1. أنشئ حساب على vercel.com
echo   2. اربط هذا المشروع مع GitHub
echo   3. انشر على Vercel
echo   4. أضف VITE_GEMINI_API_KEY في متغيرات البيئة
echo.
pause
