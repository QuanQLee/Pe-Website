import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function EditModal({ open, setOpen, type, initData, onSave }) {
  const [form, setForm] = useState(initData || {});

  useEffect(() => setForm(initData || {}), [initData]);

  const handle = k => e =>
    setForm({ ...form, [k]: e.target ? e.target.value : e });

  const F = type === 'blog'
    ? [
        ['title', 'Title'],
        ['slug', 'Slug'],
        ['tags', 'Tags (comma)'],
      ]
    : [
        ['name', 'Name'],
        ['tagline', 'Tagline'],
        ['link', 'Link'],
        ['image', 'Image URL'],
      ];

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={() => setOpen(false)}>
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
              <Dialog.Panel className="w-full max-w-2xl rounded-2xl bg-white p-6 space-y-4 shadow-xl">
                <Dialog.Title className="text-lg font-semibold">
                  {initData ? 'Edit' : 'New'} {type === 'blog' ? 'Post' : 'Project'}
                </Dialog.Title>

                {/* 普通字段 */}
                {F.map(([k, label]) => (
                  <input key={k}
                    placeholder={label}
                    value={form[k] || ''}
                    onChange={handle(k)}
                    className="input" />
                ))}

                {/* 富文本 (仅 blog) */}
                {type === 'blog' && (
                  <ReactQuill theme="snow"
                    value={form.content || ''}
                    onChange={handle('content')}
                    className="h-60" />
                )}

                {/* description textarea (project) */}
                {type === 'project' && (
                  <textarea rows={6}
                    placeholder="Description"
                    value={form.description || ''}
                    onChange={handle('description')}
                    className="input" />
                )}

                {/* footer */}
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setOpen(false)} className="btn-outline">Cancel</button>
                  <button onClick={() => onSave(form)} className="btn-primary">Save</button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
