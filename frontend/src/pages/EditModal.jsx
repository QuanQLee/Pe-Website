import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';

export default function EditModal({ open, setOpen, initData, type, onSave }) {
  const [form, setForm] = useState(initData || {});

  useEffect(() => setForm(initData || {}), [initData]);

  const update = k => v => setForm({ ...form, [k]: v });

  const fields = type === 'blog'
    ? [['title', '标题'], ['slug', 'Slug'], ['content', '内容', true], ['tags', 'Tags']]
    : [['name', '名称'], ['tagline', 'Tagline'], ['description', '描述', true], ['link', '链接'], ['image', '图片URL']];

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={() => setOpen(false)}>
        <Transition.Child as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment}
              enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-2xl transform rounded-2xl bg-white p-6 space-y-4 shadow-xl">
                <Dialog.Title className="text-lg font-semibold">
                  {initData ? '编辑' : '新建'} {type === 'blog' ? '文章' : '项目'}
                </Dialog.Title>

                {fields.map(([k, label, rich]) =>
                  rich ? (
                    <ReactQuill key={k} theme="snow" value={form[k] || ''} onChange={update(k)} />
                  ) : (
                    <input key={k} className="input"
                      placeholder={label} value={form[k] || ''}
                      onChange={e => update(k)(e.target.value)} />
                  )
                )}

                <div className="flex justify-end gap-2 pt-2">
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
