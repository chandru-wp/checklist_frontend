import { useState } from "react";

export default function AssignedChecklists({ checklists, onViewChecklist, onNewChecklist }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("Assigned");

    // Filter checklists based on search
    const filteredChecklists = checklists.filter(checklist =>
        checklist.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort checklists
    const sortedChecklists = [...filteredChecklists].sort((a, b) => {
        if (sortBy === "Assigned") {
            return new Date(b.assignedDate) - new Date(a.assignedDate);
        } else if (sortBy === "Due Date") {
            return new Date(a.dueDate) - new Date(b.dueDate);
        }
        return 0;
    });

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm shadow-lg shadow-purple-500/20">📋</span>
                        Assigned Checklists
                    </h2>
                    <p className="text-slate-400 mt-1 text-sm ml-11">Manage and complete your daily assigned tasks</p>
                </div>
                {onNewChecklist && (
                    <button
                        onClick={onNewChecklist}
                        className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-500/25 border border-white/10 transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                        + New Checklist
                    </button>
                )}
            </div>

            {/* Search and Sort Bar */}
            <div className="bg-slate-800/50 backdrop-blur-md border border-white/5 rounded-2xl p-4 mb-8">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="flex-1 relative w-full group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors">🔍</span>
                        <input
                            type="text"
                            className="w-full bg-slate-900/50 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                            placeholder="Search checklists..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <span className="text-slate-500 text-sm font-medium whitespace-nowrap pl-2">Sort by:</span>
                        <select
                            className="bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-purple-500/50 cursor-pointer min-w-[140px] appearance-none"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option>Assigned</option>
                            <option>Due Date</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Checklist Cards */}
            <div className="grid grid-cols-1 gap-4">
                {sortedChecklists.length === 0 ? (
                    <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-16 text-center border-dashed">
                        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                            <span className="text-4xl opacity-50">📋</span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-300 mb-2">No checklists found</h3>
                        <p className="text-slate-500 text-sm">Try adjusting your search criteria</p>
                    </div>
                ) : (
                    sortedChecklists.map((checklist) => (
                        <div
                            key={checklist.id}
                            className="group bg-slate-800/40 hover:bg-slate-800/60 border border-white/5 hover:border-purple-500/30 rounded-2xl p-5 transition-all duration-300"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center text-2xl border border-white/5 group-hover:from-purple-500/20 group-hover:to-blue-500/20 group-hover:border-purple-500/20 transition-all">
                                        📝
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                                            {checklist.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="px-2 py-0.5 rounded bg-slate-700/50 text-slate-400 border border-white/5">Assigned</span>
                                                <span className="text-slate-300">{checklist.assignedDate || "N/A"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="px-2 py-0.5 rounded bg-slate-700/50 text-slate-400 border border-white/5">Due Date</span>
                                                <span className="text-slate-300">{checklist.dueDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-5 pl-16 md:pl-0 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Status</span>
                                        {checklist.lastSubmitted ? (
                                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 flex items-center gap-1">
                                                <span>✓</span> Completed
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20 flex items-center gap-1">
                                                <span>⏳</span> Pending
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        className="h-10 px-6 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-xl border border-white/10 hover:border-white/20 transition-all active:scale-95 ml-2"
                                        onClick={() => onViewChecklist(checklist)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
