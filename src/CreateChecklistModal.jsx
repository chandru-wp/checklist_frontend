import { useState } from "react";
import axios from "axios";

export default function CreateChecklistModal({ onClose, onSuccess }) {
    const [title, setTitle] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:5000/api/checklists",
                {
                    title: title,
                    items: [
                        { text: "Complete daily tasks", completed: false },
                        { text: "Clock in", completed: false },
                        { text: "Clock out", completed: false }
                    ]
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onSuccess();
            onClose();
        } catch (err) {
            alert("Failed to create checklist");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-slate-800 rounded-2xl border border-white/10 p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">New Checklist</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Checklist Title</label>
                        <input
                            required
                            autoFocus
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-purple-500 outline-none transition-all"
                            placeholder="e.g. Daily Standup Report"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-white/10 rounded-xl text-slate-300 font-medium hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold shadow-lg shadow-purple-500/20 hover:opacity-90 disabled:opacity-50 transition-all"
                        >
                            {isSubmitting ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
