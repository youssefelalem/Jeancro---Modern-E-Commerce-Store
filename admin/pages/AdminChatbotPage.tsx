/**
 * صفحة إدارة Chatbot
 * تسمح بتكوين ردود Chatbot والأسئلة الشائعة
 */

import React from 'react';
import { useAppContext, useChatbot } from '../../hooks';
import { AdminPageTitle, Button, Card } from '../../components';

export const AdminChatbotPage: React.FC = () => {
  const { t, showToast } = useAppContext();
  const { 
    isChatbotOpen,
    toggleChatbot
  } = useChatbot();

  // تبديل حالة Chatbot
  const handleToggleChatbot = () => {
    toggleChatbot();
    showToast(
      isChatbotOpen ? 'تم إيقاف Chatbot' : 'تم تشغيل Chatbot', 
      'success'
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <AdminPageTitle title="إدارة Chatbot" />
        <div className="flex gap-2">
          <Button 
            onClick={handleToggleChatbot}
            variant={isChatbotOpen ? 'danger' : 'primary'}
            size="md"
          >
            {isChatbotOpen ? 'إيقاف Chatbot' : 'تشغيل Chatbot'}
          </Button>
          <Button variant="primary" size="md">
            {t('add') || 'إضافة رد جديد'}
          </Button>
        </div>
      </div>

      {/* حالة Chatbot */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">حالة Chatbot</h3>
            <p className="text-gray-600">يمكنك تشغيل أو إيقاف Chatbot من هنا</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            isChatbotOpen 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {isChatbotOpen ? 'مفعل' : 'معطل'}
          </span>
        </div>
      </Card>

      <Card>
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">صفحة إدارة Chatbot</h3>
          <p className="text-gray-500">
            هذه الصفحة ستحتوي على وظائف إدارة ردود Chatbot والأسئلة الشائعة
          </p>
          <p className="text-sm text-gray-400 mt-2">
            سيتم إضافة المزيد من الوظائف قريباً
          </p>
        </div>
      </Card>
    </div>
  );
};
