/**
 * صفحة إدارة Chatbot المحسنة
 * تسمح بتكوين ردود Chatbot والأسئلة الشائعة ومراقبة الأداء
 */

import React, { useState, useEffect } from 'react';
import { useAppContext, useChatbot } from '../../hooks';
import { AdminPageTitle, Button, Card } from '../../components';

export const AdminChatbotPage: React.FC = () => {  const { 
    showToast, 
    products, 
    categories, 
    storeSettings,
    faqs 
  } = useAppContext();
  
  const { 
    isChatbotOpen,
    toggleChatbot,
    chatMessages
  } = useChatbot();

  // إحصائيات الشات بوت
  const [chatStats, setChatStats] = useState({
    totalMessages: 0,
    userMessages: 0,
    botMessages: 0,
    averageResponseTime: 0,
    topQuestions: [] as string[]
  });

  useEffect(() => {
    // حساب الإحصائيات
    const userMsgs = chatMessages.filter(msg => msg.sender === 'user');
    const botMsgs = chatMessages.filter(msg => msg.sender === 'bot');
    
    setChatStats({
      totalMessages: chatMessages.length,
      userMessages: userMsgs.length,
      botMessages: botMsgs.length,
      averageResponseTime: 1.2, // متوسط وهمي
      topQuestions: userMsgs.slice(-5).map(msg => msg.text)
    });
  }, [chatMessages]);

  // تبديل حالة Chatbot
  const handleToggleChatbot = () => {
    toggleChatbot();
    showToast(
      isChatbotOpen ? 'تم إيقاف Chatbot' : 'تم تشغيل Chatbot', 
      'success'
    );
  };

  // اختبار الشات بوت
  const handleTestChatbot = () => {
    if (!isChatbotOpen) {
      toggleChatbot();
    }
    showToast('تم فتح الشات بوت للاختبار', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <AdminPageTitle title="إدارة الشات بوت المحسن" />
        <div className="flex gap-2">
          <Button 
            onClick={handleToggleChatbot}
            variant={isChatbotOpen ? 'danger' : 'primary'}
            size="md"
          >
            {isChatbotOpen ? '🔴 إيقاف الشات بوت' : '🟢 تشغيل الشات بوت'}
          </Button>
          <Button 
            onClick={handleTestChatbot}
            variant="secondary" 
            size="md"
          >
            🧪 اختبار الشات بوت
          </Button>
        </div>
      </div>

      {/* إحصائيات الشات بوت */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{chatStats.totalMessages}</div>
            <div className="text-sm text-gray-600">إجمالي الرسائل</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{chatStats.userMessages}</div>
            <div className="text-sm text-gray-600">رسائل المستخدمين</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{chatStats.botMessages}</div>
            <div className="text-sm text-gray-600">ردود الشات بوت</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{chatStats.averageResponseTime}s</div>
            <div className="text-sm text-gray-600">متوسط وقت الرد</div>
          </div>
        </Card>
      </div>

      {/* حالة الشات بوت والمعلومات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              🤖 حالة الشات بوت
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>الحالة الحالية:</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  isChatbotOpen 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isChatbotOpen ? '🟢 نشط' : '🔴 متوقف'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>عدد المنتجات المتاحة:</span>
                <span className="font-semibold">{products.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>عدد الفئات:</span>
                <span className="font-semibold">{categories.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>الأسئلة الشائعة:</span>
                <span className="font-semibold">{faqs.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>رقم الواتساب:</span>
                <span className="font-semibold text-green-600">
                  {storeSettings.whatsappNumber || 'غير محدد'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              🧠 ذكاء الشات بوت
            </h3>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-blue-800">الميزات المتاحة:</h4>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• عرض المنتجات والتفاصيل</li>
                  <li>• معلومات الطلب والشحن</li>
                  <li>• إحصائيات المتجر المحدثة</li>
                  <li>• معلومات التواصل</li>
                  <li>• المنتجات الجديدة</li>
                  <li>• البحث في الفئات</li>
                </ul>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-medium text-green-800">المعلومات الحية:</h4>
                <ul className="text-sm text-green-700 mt-2 space-y-1">
                  <li>• يتفاعل مع تغييرات المنتجات فوراً</li>
                  <li>• يعرض الأسعار والتوفر الحالي</li>
                  <li>• معلومات التواصل المحدثة</li>
                  <li>• إحصائيات المتجر الفعلية</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* آخر الأسئلة */}
      {chatStats.topQuestions.length > 0 && (
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              💬 آخر الأسئلة
            </h3>
            <div className="space-y-2">
              {chatStats.topQuestions.map((question, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-700">{question}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* إعدادات متقدمة */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            ⚙️ الإعدادات المتقدمة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                رسالة الترحيب
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                value={storeSettings.chatbot?.welcomeMessage?.AR || 'مرحباً بك في جينكرو!'}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                العرض التلقائي
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={storeSettings.chatbot?.autoShowOnPage || false}
                  readOnly
                  className="rounded"
                />
                <span className="text-sm text-gray-600">
                  عرض الشات بوت تلقائياً عند دخول الموقع
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* نصائح للتحسين */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            💡 نصائح لتحسين الأداء
          </h3>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <ul className="text-sm text-yellow-800 space-y-2">
              <li>• تأكد من تحديث معلومات المنتجات باستمرار</li>
              <li>• أضف المزيد من الأسئلة الشائعة لتحسين الردود</li>
              <li>• راقب الأسئلة المتكررة وأضفها للإعدادات</li>
              <li>• حدث رقم الواتساب ومعلومات التواصل</li>
              <li>• اختبر الشات بوت بانتظام للتأكد من عمله</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
