/**
 * صفحة إدارة المنتجات
 * تستخدم CrudPageFactory لإدارة المنتجات
 */

import React from 'react';
import { useAppContext } from '../../hooks';
import { Product, LanguageCode } from '../../types';
import { InputField, AdminPageTitle, Button, Table, Modal, PlusIcon } from '../../components';

export const AdminProductsPage: React.FC = () => {
  const {
    products,
    setProducts,
    categories,
    t,
    translations,
    currentLanguage,
    showToast,
  } = useAppContext();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [formData, setFormData] = React.useState<Partial<Product>>({
    name: { EN: '', AR: '' },
    description: { EN: '', AR: '' },
    price: 0,
    imageUrl: '',
    categoryId: '',
    images: [''],
    details: {
      EN: { features: [''], specifications: {} },
      AR: { features: [''], specifications: {} }
    }
  });

  // فتح وإغلاق المودال
  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: { EN: '', AR: '' },
        description: { EN: '', AR: '' },
        price: 0,
        imageUrl: '',
        categoryId: '',
        images: [''],
        details: {
          EN: { features: [''], specifications: {} },
          AR: { features: [''], specifications: {} }
        }
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // معالجة تغيير الحقول
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
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

  // حفظ المنتج
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name?.EN || !formData.name?.AR || !formData.description?.EN || !formData.description?.AR) {
      showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }    const newProduct: Product = {
      id: editingProduct?.id || `prod_${Date.now()}`,
      name: formData.name!,
      description: formData.description!,
      price: formData.price || 0,
      imageUrl: formData.imageUrl || '',
      categoryId: formData.categoryId || '',
      inStock: true, // المنتجات الجديدة متوفرة افتراضياً
      images: formData.images || [''],
      details: formData.details || {
        EN: { features: [], specifications: {} },
        AR: { features: [], specifications: {} }
      }
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? newProduct : p));
      showToast(t('saveChanges'), 'success');
    } else {
      setProducts(prev => [...prev, newProduct]);
      showToast('تم إضافة المنتج بنجاح', 'success');
    }

    closeModal();
  };

  // حذف المنتج
  const handleDelete = (product: Product) => {
    if (window.confirm(t('areYouSureDelete'))) {
      setProducts(prev => prev.filter(p => p.id !== product.id));
      showToast('تم حذف المنتج', 'info');
    }
  };

  // تحديد أعمدة الجدول
  const columns = [
    { 
      key: 'name' as keyof Product, 
      header: t('productName'),
      render: (product: Product) => product.name[currentLanguage] 
    },
    { 
      key: 'price' as keyof Product, 
      header: t('productPrice'),
      render: (product: Product) => `${product.price}` 
    },
    { 
      key: 'categoryId' as keyof Product, 
      header: t('productCategory'),
      render: (product: Product) => {
        const category = categories.find(c => c.id === product.categoryId);
        return category ? category.name[currentLanguage] : '-';
      }
    },
    { key: 'actions' as keyof Product, header: t('actions') },
  ];

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <AdminPageTitle title={t('manageProducts')} />
        <Button onClick={() => openModal()} variant='primary' size='md'>
          <PlusIcon className='h-5 w-5 mr-2' />
          {t('add')} {t('products')}
        </Button>
      </div>

      <Table<Product>
        columns={columns}
        data={products}
        onEdit={openModal}
        onDelete={handleDelete}
        translations={translations}
        currentLanguage={currentLanguage}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProduct ? `${t('edit')} ${t('products')}` : `${t('add')} ${t('products')}`}
        size='lg'
      >
        <form onSubmit={handleSubmit} className='space-y-4'>          <InputField
            label={t('productName')}
            id='name'
            name='name'
            localizedValue={formData.name || { EN: '', AR: '' }}
            onLocalizedChange={(lang, value) => handleLocalizedChange(lang, value, 'name')}
            lang={currentLanguage}
            required
          />
          
          <InputField
            label={t('productDescription')}
            id='description'
            name='description'
            localizedValue={formData.description || { EN: '', AR: '' }}
            onLocalizedChange={(lang, value) => handleLocalizedChange(lang, value, 'description')}
            lang={currentLanguage}
            isTextArea
            required
          />
            <InputField
            label={t('productPrice')}
            id='price'
            name='price'
            type='number'
            value={formData.price || 0}
            onChange={handleChange}
            required
          />
          
          <InputField
            label={t('productImageURL')}
            id='imageUrl'
            name='imageUrl'
            value={formData.imageUrl || ''}
            onChange={handleChange}
            required
          />
          
          <InputField
            label={t('productCategory')}
            id='categoryId'
            name='categoryId'
            value={formData.categoryId || ''}
            onChange={handleChange}
            options={categories.map(cat => ({
              value: cat.id,
              label: cat.name[currentLanguage]
            }))}
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
