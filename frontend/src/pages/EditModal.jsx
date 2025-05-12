import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';

export default function EditModal({ open, setOpen, initData, type, onSave }) {
  const [form, setForm] = useState(initData || {});

  useEffect(() => setForm(initData || {}), [initData]);

  const update = k => v =>
    setForm(prev => ({ ...prev, [k]: typeof v === 'string' ? v : v.target.value }));

  /* 字段配置 */
  const fields =
    type === 'blog'
      ? [
          ['title', '标题'],
          ['slug', 'Slug（可选）'],
          ['content', '正文', true],
          ['tags', 'Tags（逗号分隔）'],
        ]
      : [
          ['name', '名称'],
          ['tagline', '简短介绍'],
          ['description', '详细描述', true],
          ['link', '项目链接'],
          ['image', '封面图 URL'],
        ];

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={() => setOpen(false)}>
        {/* 背景遮罩 */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        {/* 弹窗主体 */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-6 pt-14">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform rounded-2xl bg-white shadow-xl p-8 space-y-6">
                <Dialog.Title className="text-xl font-semibold">
                  {initData ? '编辑' : '新建'} {type === 'blog' ? '文章' : '项目'}
                </Dialog.Title>

                {fields.map(([k, label, rich]) =>
                  rich ? (
                    <div key={k} className="h-56">
                      <ReactQuill
                        theme="snow"
                        value={form[k] || ''}
                        onChange={update(k)}
                        className="h-full"
                      />
                    </div>
                  ) : (
                    <input
                      key={k}
                      className="input"
                      placeholder={label}
                      value={form[k] || ''}
                      onChange={update(k)}
                    />
                  )
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setOpen(false)} className="btn-outline">取消</button>
                  <button onClick={() => onSave(form)} className="btn-primary">保存</button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
