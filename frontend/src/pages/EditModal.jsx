import { useState, useEffect } from 'react';

export default function EditModal({ open, onClose, onSave, initial, fields, title }) {
  const [form, setForm] = useState(initial || {});
  useEffect(()=>setForm(initial||{}),[initial]);

  const change = (k,v)=>setForm(f=>({...f,[k]:v}));
  if(!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        {fields.map(f=> (
          <input key={f.key} className="input" placeholder={f.label}
                 value={form[f.key]||''} onChange={e=>change(f.key,e.target.value)}/>
        ))}
        <div className="flex justify-end gap-2">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={()=>onSave(form)}>Save</button>
        </div>
      </div>
    </div>
  );
}