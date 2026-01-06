import { useState } from "react";
import api from "./api";

export default function ChecklistModal({ checklist, onClose, onSubmitSuccess }) {
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [responses, setResponses] = useState({
        tasksWorked: "",
        tasksCompleted: "",
        technicalInterviews: "",
        clockIn: "Yes",
        clockOut: "Yes",
        codeReviews: "",
        remainingTasks: "",
        tasksInQueue: "",
        bugsFixes: "",
        comments: {}
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(false);

    useEffect(() => {
        if (checklist.items && Array.isArray(checklist.items) && checklist.items.length > 0) {
            // Check if items have actual responses (not just a template)
            const hasResponses = checklist.items.some(item => item.response !== undefined && item.response !== "");

            if (hasResponses) {
                setIsReadOnly(true);
                const newResponses = { ...responses, comments: {} };

                checklist.items.forEach(data => {
                    const itemConfig = items.find(i => i.label === data.title);
                    if (itemConfig) {
                        newResponses[itemConfig.field] = data.response;
                        newResponses.comments[itemConfig.field] = data.comment;
                    }
                });
                setResponses(newResponses);
                if (checklist.date) {
                    setDate(checklist.date);
                }
            }
        }
    }, [checklist]);

    const token = localStorage.getItem("token");

    const handleChange = (field, value) => {
        setResponses(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await api.post(
                "/api/checklists",
                {
                    checklistId: checklist.id,
                    title: checklist.title,
                    date,
                    items: items.map(item => ({
                        title: item.label,
                        response: responses[item.field],
                        comment: responses.comments[item.field] || ""
                    }))
                }
            );
            alert("Checklist submitted successfully!");
            onSubmitSuccess?.();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to submit checklist");
        } finally {
            setIsSubmitting(false);
        }
    };

    const items = [
        { sno: 1, label: "No of Tasks Worked", field: "tasksWorked", type: "number", icon: "📝" },
        { sno: 2, label: "No of Tasks Completed", field: "tasksCompleted", type: "number", icon: "✅" },
        { sno: 3, label: "No of technical Interview conducted", field: "technicalInterviews", type: "number", icon: "🎤" },
        { sno: 4, label: "Daily Clock In", field: "clockIn", type: "radio", icon: "⏰" },
        { sno: 5, label: "Daily Clock Out", field: "clockOut", type: "radio", icon: "🕐" },
        { sno: 6, label: "Code Reviews Done", field: "codeReviews", type: "number", icon: "👀" },
        { sno: 7, label: "No of Remaining tasks", field: "remainingTasks", type: "number", icon: "📋" },
        { sno: 8, label: "No of tasks in queue (Not yet started)", field: "tasksInQueue", type: "number", icon: "🔄" },
        { sno: 9, label: "No of Bugs fixed", field: "bugsFixes", type: "number", icon: "🐛" },
    ];

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-slate-900/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-purple-900/20 border border-white/10 animate-[zoomIn_0.2s_ease-out]"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: 'zoomIn 0.2s ease-out' }}
            >
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xl shadow-lg shadow-purple-500/20">
                            📝
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-wide">{checklist.title}</h2>
                            <p className="text-slate-400 text-sm">{isReadOnly ? "Viewing submitted details" : "Fill in the details below"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end mr-4">
                            <span className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Date</span>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    disabled={isReadOnly}
                                    className={`bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-slate-300 outline-none focus:border-purple-500/50 ${isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
                                />
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.sno}
                                className="group bg-slate-900/40 p-5 rounded-xl border border-white/5 hover:border-purple-500/30 transition-all"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 border border-white/5 group-hover:text-purple-400 transition-colors">
                                            {item.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-slate-200 font-medium group-hover:text-white">{item.label}</p>
                                        </div>
                                    </div>

                                    <div className="w-full sm:w-48 pl-[56px] sm:pl-0">
                                        {item.type === "radio" ? (
                                            <div className={`flex bg-slate-900 rounded-lg p-1 border border-white/5 ${isReadOnly ? 'pointer-events-none opacity-80' : ''}`}>
                                                <label className={`flex-1 text-center py-2 text-sm rounded-md cursor-pointer transition-all ${responses[item.field] === "Yes" ? 'bg-emerald-500/20 text-emerald-400 font-medium' : 'text-slate-500 hover:text-slate-300'}`}>
                                                    <input
                                                        type="radio"
                                                        name={item.field}
                                                        value="Yes"
                                                        checked={responses[item.field] === "Yes"}
                                                        onChange={(e) => handleChange(item.field, e.target.value)}
                                                        disabled={isReadOnly}
                                                        className="hidden"
                                                    />
                                                    Yes
                                                </label>
                                                <label className={`flex-1 text-center py-2 text-sm rounded-md cursor-pointer transition-all ${responses[item.field] === "No" ? 'bg-red-500/20 text-red-400 font-medium' : 'text-slate-500 hover:text-slate-300'}`}>
                                                    <input
                                                        type="radio"
                                                        name={item.field}
                                                        value="No"
                                                        checked={responses[item.field] === "No"}
                                                        onChange={(e) => handleChange(item.field, e.target.value)}
                                                        disabled={isReadOnly}
                                                        className="hidden"
                                                    />
                                                    No
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <input
                                                    type={item.type}
                                                    value={responses[item.field]}
                                                    onChange={(e) => handleChange(item.field, e.target.value)}
                                                    disabled={isReadOnly}
                                                    placeholder="Enter value..."
                                                    className={`w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-600 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all font-medium text-center ${isReadOnly ? 'bg-slate-800/50 cursor-not-allowed' : ''}`}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="w-full sm:flex-1 pl-[56px] sm:pl-0">
                                        <input
                                            type="text"
                                            value={responses.comments[item.field] || ""}
                                            onChange={(e) => setResponses(prev => ({
                                                ...prev,
                                                comments: { ...prev.comments, [item.field]: e.target.value }
                                            }))}
                                            disabled={isReadOnly}
                                            placeholder={isReadOnly ? "No remark added" : "Add a remark or comment..."}
                                            className={`w-full bg-slate-900/50 border border-white/5 rounded-lg px-4 py-2 text-sm text-slate-400 placeholder-slate-600 outline-none focus:border-purple-500/30 transition-all font-normal ${isReadOnly ? 'cursor-not-allowed italic' : ''}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-slate-900/50 backdrop-blur flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 transition-all"
                    >
                        {isReadOnly ? "Close" : "Cancel"}
                    </button>
                    {!isReadOnly && (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <span>🚀</span> Submit Checklist
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes zoomIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
