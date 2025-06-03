
import React from 'react';
import ReactDOM from 'react-dom/client';
import TestApp from './TestApp';
// Tailwind styles are loaded via CDN in index.html

// تم تحديث index.tsx لتشغيل البنية الجديدة
// يمكن استبدال TestApp بـ App للعودة للنسخة الأصلية

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>
);