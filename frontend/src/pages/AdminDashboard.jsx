import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const FIELD_MAP = {
  blog: [
    ['title', '标题'],
    ['slug', 'Slug'],
    ['content', '内容', 'rich'],
    ['tags', '标签（逗号分隔）']
  ],
  project: [
    ['name', '名称'],
    ['tagline', '简介'],
    ['description', '描述', 'rich'],
    ['link', '链接'],
    ['image', '图片 URL']
  ]
};

export default function EditModal({ open, setOpen, initData, type, onSave }) {
  const [form, setForm] = useState(initData || {});
  useEffect(() => setForm(initData || {}), [initData]);

  const change = k => v =>
    setForm(prev => ({ ...prev, [k]: typeof v === 'string' ? v : v.target.value }));

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={() => setOpen(false)}>
        {/* 背景遮罩 */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            {/* 弹窗面板 */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl space-y-6">
                <Dialog.Title className="text-xl font-semibold">
                  {initData ? '编辑' : '新建'} {type === 'blog' ? '文章' : '项目'}
                </Dialog.Title>

                {/* 动态生成字段 */}
                {FIELD_MAP[type].map(([key, label, mode]) =>
                  mode === 'rich' ? (
                    <ReactQuill
                      key={key}
                      theme="snow"
                      value={form[key] || ''}
                      onChange={change(key)}
                      className="h-40"
                    />
                  ) : (
                    <input
                      key={key}
                      className="input"
                      placeholder={label}
                      value={form[key] || ''}
                      onChange={change(key)}
                    />
                  )
                )}

                <div className="flex justify-end gap-3 pt-3">
                  <button className="btn-outline" onClick={() => setOpen(false)}>
                    取消
                  </button>
                  <button className="btn-primary" onClick={() => onSave(form)}>
                    保存
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
