/**
 * صفحة إدارة الفئات
 * تستخدم نظام CRUD لإدارة فئات المنتجات
 */

import React from 'react';
import { useAppContext } from '../../hooks';
import { Category, LanguageCode } from '../../types';
import { InputField, AdminPageTitle, Button, Table, Modal, PlusIcon } from '../../components';

export const AdminCategoriesPage: React.FC = () => {
  const {
    categories,
    setCategories,
    t,
    translations,
    currentLanguage,
    showToast,
  } = useAppContext();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [formData, setFormData] = React.useState<Partial<Category>>({
    name: { EN: '', AR: '' }
  });

  // فتح وإغلاق المودال
  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData(category);
    } else {
      setEditingCategory(null);
      setFormData({
        name: { EN: '', AR: '' }
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  // معالجة تغيير الحقول متعددة اللغات
  const handleLocalizedChange = (lang: LanguageCode, value: string, field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field as keyof typeof prev] as any,
        [lang]: value
      }
    }));
  };

  // حفظ الفئة
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name?.EN || !formData.name?.AR) {
      showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }

    const newCategory: Category = {
      id: editingCategory?.id || `cat_${Date.now()}`,
      name: formData.name!
    };

    if (editingCategory) {
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? newCategory : c));
      showToast(t('saveChanges'), 'success');
    } else {
      setCategories(prev => [...prev, newCategory]);
      showToast('تم إضافة الفئة بنجاح', 'success');
    }

    closeModal();
  };

  // حذف الفئة
  const handleDelete = (category: Category) => {
    if (window.confirm(t('areYouSureDelete'))) {
      setCategories(prev => prev.filter(c => c.id !== category.id));
      showToast('تم حذف الفئة', 'info');
    }
  };

  // تحديد أعمدة الجدول
  const columns = [
    { 
      key: 'name' as keyof Category, 
      header: t('categoryName'),
      render: (category: Category) => category.name[currentLanguage] 
    },
    { key: 'actions' as keyof Category, header: t('actions') },
  ];

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <AdminPageTitle title={t('manageCategories')} />
        <Button onClick={() => openModal()} variant='primary' size='md'>
          <PlusIcon className='h-5 w-5 mr-2' />
          {t('add')} {t('category')}
        </Button>
      </div>

      <Table<Category>
        columns={columns}
        data={categories}
        onEdit={openModal}
        onDelete={handleDelete}
        translations={translations}
        currentLanguage={currentLanguage}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCategory ? `${t('edit')} ${t('category')}` : `${t('add')} ${t('category')}`}
        size='md'
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
          <InputField
            label={t('categoryName')}
            id='name'
            name='name'
            localizedValue={formData.name || { EN: '', AR: '' }}
            onLocalizedChange={(lang, value) => handleLocalizedChange(lang, value, 'name')}
            lang={currentLanguage}
            required
          />

          <div className='flex justify-end space-x-3 pt-4'>
            <Button type='button' onClick={closeModal} variant='outline'>
              {t('cancel')}
            </Button>
            <Button type='submit' variant='primary'>
              {t('saveChanges')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
