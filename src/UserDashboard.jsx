import { useState, useEffect } from "react";
import api from "./api";
import AssignedChecklists from "./AssignedChecklists";
import ChecklistModal from "./ChecklistModal";
import CreateChecklistModal from "./CreateChecklistModal";

export default function UserDashboard({ user, onLogout }) {
    const [realChecklists, setRealChecklists] = useState([]);
    const [selectedChecklist, setSelectedChecklist] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchChecklists = async () => {
        setIsLoading(true);
        try {
            const res = await api.get("/api/checklists");
            setRealChecklists(res.data);
        } catch (err) {
            console.error("Failed to fetch checklists", err);
            // If unauthorized, logout the user
            if (err.response?.status === 401) {
                onLogout();
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchChecklists();
    }, []);

    const handleViewChecklist = (checklist) => {
        setSelectedChecklist(checklist);
    };

    const handleCloseModal = () => {
        setSelectedChecklist(null);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 overflow-x-hidden relative">
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
            </div>

            {/* Premium Navbar */}
            <nav className="relative z-40 px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-900/50 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-purple-500/20">
                        📋
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="text-white font-bold text-lg tracking-wide">Checklist Pro</h1>
                        <p className="text-slate-400 text-xs">Task Management</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Search Bar */}
                    <div className="hidden md:flex items-center gap-3 bg-slate-800/50 rounded-xl px-4 py-2.5 border border-white/5 focus-within:border-purple-500/50 focus-within:bg-slate-800 transition-all">
                        <span className="text-slate-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 text-sm w-48"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all relative">
                            <span className="text-xl">🔔</span>
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-purple-500 rounded-full border-2 border-slate-900"></span>
                        </button>

                        {/* User Profile */}
                        <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                            <div className="text-right hidden sm:block">
                                <p className="text-white text-sm font-medium">{user?.name || user?.email || "User"}</p>
                                <p className="text-slate-400 text-xs capitalize">{user?.role || "User"}</p>
                            </div>
                            <button
                                onClick={onLogout}
                                className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center text-white font-bold border border-white/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                                title="Logout"
                            >
                                {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex relative z-10">
                {/* Premium Sidebar */}
                <aside className="sticky top-[80px] h-[calc(100vh-80px)] w-20 flex flex-col items-center py-8 gap-4 border-r border-white/5 hidden md:flex">
                    <button className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-gradient-to-br hover:from-purple-600 hover:to-blue-600 transition-all group relative">
                        <span className="text-xl">🏠</span>
                        <div className="absolute left-16 bg-slate-800 border border-white/10 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 pointer-events-none whitespace-nowrap shadow-xl">
                            Dashboard
                        </div>
                    </button>
                    <button className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25">
                        <span className="text-xl">📋</span>
                    </button>
                    <button className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-gradient-to-br hover:from-purple-600 hover:to-blue-600 transition-all group relative">
                        <span className="text-xl">📊</span>
                        <div className="absolute left-16 bg-slate-800 border border-white/10 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 pointer-events-none whitespace-nowrap shadow-xl">
                            Analytics
                        </div>
                    </button>
                    <button className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-gradient-to-br hover:from-purple-600 hover:to-blue-600 transition-all group relative">
                        <span className="text-xl">⚙️</span>
                        <div className="absolute left-16 bg-slate-800 border border-white/10 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 pointer-events-none whitespace-nowrap shadow-xl">
                            Settings
                        </div>
                    </button>

                    <div className="flex-1"></div>

                    <button
                        onClick={onLogout}
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group relative border border-transparent hover:border-red-500/20"
                    >
                        <span className="text-xl">🚪</span>
                        <div className="absolute left-16 bg-slate-800 border border-white/10 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 pointer-events-none whitespace-nowrap shadow-xl">
                            Logout
                        </div>
                    </button>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 max-w-[1600px] mx-auto">
                    {/* Welcome Banner */}
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name || "User"} 👋</h2>
                        <p className="text-slate-400">Here's an overview of your active checklists and daily goals.</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
                            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center text-2xl border border-white/5">
                                        📋
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm font-medium mb-1">Total Checklists</p>
                                        <p className="text-3xl font-bold text-white tracking-tight">{realChecklists.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
                            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center text-2xl border border-white/5">
                                        ✅
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm font-medium mb-1">Completed</p>
                                        <p className="text-3xl font-bold text-white tracking-tight">1</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
                            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center text-2xl border border-white/5">
                                        ⏳
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm font-medium mb-1">Pending</p>
                                        <p className="text-3xl font-bold text-white tracking-tight">1</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full mb-4"></div>
                            <p className="text-slate-400">Loading your checklists...</p>
                        </div>
                    ) : (
                        <AssignedChecklists
                            checklists={realChecklists}
                            onViewChecklist={handleViewChecklist}
                            onNewChecklist={user.role === "admin" ? () => setShowCreateModal(true) : null}
                        />
                    )}
                </main>
            </div>

            {/* Checklist Modal */}
            {selectedChecklist && (
                <ChecklistModal
                    checklist={selectedChecklist}
                    onClose={handleCloseModal}
                    onSubmitSuccess={fetchChecklists}
                />
            )}

            {/* Create Checklist Modal */}
            {showCreateModal && (
                <CreateChecklistModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={fetchChecklists}
                />
            )}
        </div>
    );
}
