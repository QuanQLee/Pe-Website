await api.post('/blogs', …) // 或 put
onSaved();          // ⚠️ 只通知，无参数
onClose();
