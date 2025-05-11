import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function EditModal({ open, setOpen, initData, type, onSave }) {
  const [form, setForm] = useState(initData || {});
  useEffect(() => setForm(initData || {}), [initData]);

  const set = (k, v) => setForm({ ...form, [k]: v });

  const blogFields = (
    <>
      <input className="input" placeholder="Title" value={form.title || ''} onChange={e => set('title', e.target.value)} />
      <input className="input" placeholder="Slug" value={form.slug || ''} onChange={e => set('slug', e.target.value)} />
      <ReactQuill value={form.content || ''} onChange={v => set('content', v)} className="bg-white" />
      <input className="input" placeholder="Tags (comma)" value={form.tags || ''} onChange={e => set('tags', e.target.value)} />
    </>
  );

  const projectFields = (
    <>
      <input className="input" placeholder="Name" value={form.name || ''} onChange={e => set('name', e.target.value)} />
      <input className="input" placeholder="Tagline" value={form.tagline || ''} onChange={e => set('tagline', e.target.value)} />
      <textarea className="input" rows={4} placeholder="Description" value={form.description || ''} onChange={e => set('description', e.target.value)} />
      <input className="input" placeholder="Link" value={form.link || ''} onChange={e => set('link', e.target.value)} />
      <input className="input" placeholder="Image URL" value={form.image || ''} onChange={e => set('image', e.target.value)} />
    </>
  );

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-20 overflow-y-auto" onClose={() => setOpen(false)}>
        <div className="flex min-h-screen items-center justify-center p-4 bg-black/20">
          <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-90" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-90">
            <Dialog.Panel className="w-full max-w-2xl space-y-4 rounded-2xl bg-white p-6">
              <Dialog.Title className="text-lg font-semibold mb-2">{initData ? 'Edit' : 'New'} {type === 'blog' ? 'Post' : 'Project'}</Dialog.Title>
              {type === 'blog' ? blogFields : projectFields}
              <div className="flex justify-end gap-2">
                <button className="btn-outline" onClick={() => setOpen(false)}>Cancel</button>
                <button className="btn-primary" onClick={() => onSave(form)}>Save</button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
