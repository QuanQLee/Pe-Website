import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import clsx from "clsx";

export default function EditModal({ open, setOpen, initData, type, onSave }) {
  const [form, setForm] = useState(initData || {});
  const [file, setFile] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    setForm(initData || {});
    setFile(null);
  }, [initData]);

  const handle = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const commonFields = [
    ["title", "标题"],
    ["slug", "Slug"],
    ["content", "内容", true],
  ];
  const projectFields = [
    ["name", "名称"],
    ["tagline", "Tagline"],
    ["description", "描述", true],
    ["link", "链接"],
  ];

  const fields = type === "blog" ? commonFields : projectFields;

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={() => setOpen(false)}>
        <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-3xl transform rounded-2xl bg-white p-6 space-y-4 shadow-xl">
                <Dialog.Title className="text-lg font-semibold mb-2">{initData ? "编辑" : "新建"} {type === "blog" ? "文章" : "项目"}</Dialog.Title>

                {fields.map(([key, label, rich]) => rich ? (
                  <div key={key} className="space-y-1">
                    <label className="font-medium text-sm text-gray-700">{label}</label>
                    <ReactQuill theme="snow" value={form[key] || ""} onChange={v => handle(key, v)} />
                  </div>
                ) : (
                  <input key={key} className="input" placeholder={label} value={form[key] || ""} onChange={e => handle(key, e.target.value)} />
                ))}

                {/* 上传图片 (仅项目) */}
                {type === "project" && (
                  <div className="space-y-1">
                    <label className="font-medium text-sm text-gray-700">项目封面</label>
                    <input ref={fileRef} type="file" accept="image/*" className="block" onChange={e => setFile(e.target.files[0])} />
                    {(file || form.image) && (
                      <img src={file ? URL.createObjectURL(file) : form.image} alt="preview" className="h-32 object-cover rounded" />
                    )}
                  </div>
                )}

                {/* 保存 / 取消 */}
                <div className="flex justify-end gap-3 pt-3">
                  <button className="btn-outline" onClick={() => setOpen(false)}>取消</button>
                  <button className={clsx("btn-primary", !form.title && !form.name && "opacity-40 pointer-events-none")}
                    onClick={() => onSave(form, file)}>保存</button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}