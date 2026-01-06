import { useState, useEffect } from "react";
import axios from "axios";
import ChecklistModal from "./ChecklistModal";

export default function AdminDashboard({ user, onLogout }) {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [editingDetailsUser, setEditingDetailsUser] = useState(null);
    const [editingData, setEditingData] = useState({ name: "", email: "" });
    const [newPassword, setNewPassword] = useState("");
    const [showAddUser, setShowAddUser] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [showTemplateManager, setShowTemplateManager] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [viewingChecklistsUserId, setViewingChecklistsUserId] = useState(null);
    const [userChecklists, setUserChecklists] = useState([]);
    const [showTemplateEditor, setShowTemplateEditor] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [selectedDetailChecklist, setSelectedDetailChecklist] = useState(null);
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    });

    const API_URL = "http://localhost:5000/api/auth";

    const getAuthHeaders = () => ({
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });

    // Fetch all users
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/users`, getAuthHeaders());
            setUsers(res.data);
            setError("");
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to fetch users";
            setError(msg);
            if (err.response?.status === 401 || msg.toLowerCase().includes("token")) {
                setTimeout(() => onLogout(), 2000);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTemplates = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/templates`, getAuthHeaders());
            setTemplates(res.data);
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to fetch templates";
            console.error(msg, err);
            if (err.response?.status === 401) {
                onLogout();
            }
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchTemplates();
    }, []);

    // Update user role
    const handleUpdateRole = async (userId, newRole) => {
        try {
            await axios.put(`${API_URL}/users/${userId}/role`, { role: newRole }, getAuthHeaders());
            setSuccessMessage("Role updated successfully");
            fetchUsers();
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update role");
        }
    };

    // Update user name and email
    const handleUpdateUserDetails = async (userId) => {
        try {
            await axios.put(`${API_URL}/users/${userId}`, editingData, getAuthHeaders());
            setSuccessMessage("User details updated successfully");
            setEditingDetailsUser(null);
            fetchUsers();
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update user details");
        }
    };

    // Update user password
    const handleUpdatePassword = async (userId) => {
        if (!newPassword || newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            await axios.put(`${API_URL}/users/${userId}/password`, { password: newPassword }, getAuthHeaders());
            setSuccessMessage("Password updated successfully");
            setEditingUser(null);
            setNewPassword("");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update password");
        }
    };

    // Delete user
    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await axios.delete(`${API_URL}/users/${userId}`, getAuthHeaders());
            setSuccessMessage("User deleted successfully");
            fetchUsers();
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete user");
        }
    };

    // Add new user
    const handleAddUser = async (e) => {
        e.preventDefault();

        if (!newUser.name || !newUser.email || !newUser.password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            await axios.post(`${API_URL}/register`, newUser, getAuthHeaders());
            setSuccessMessage("User added successfully");
            setShowAddUser(false);
            setNewUser({ name: "", email: "", password: "", role: "user" });
            fetchUsers();
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add user");
        }
    };

    const handleAssignTemplate = async (userId, templateId) => {
        if (!templateId) return;
        try {
            await axios.post(`http://localhost:5000/api/templates/assign`, { userId, templateId }, getAuthHeaders());
            setSuccessMessage("Template assigned successfully");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to assign template");
        }
    };

    const fetchUserChecklists = async (userId) => {
        try {
            const res = await axios.get(`${API_URL}/users/${userId}/checklists`, getAuthHeaders());
            setUserChecklists(res.data);
            setViewingChecklistsUserId(userId);
        } catch (err) {
            setError("Failed to fetch user checklists");
        }
    };

    const handleUpdateChecklist = async (checklistId, title, items) => {
        try {
            await axios.put(`${API_URL}/checklists/${checklistId}`, { title, items }, getAuthHeaders());
            setSuccessMessage("Checklist updated successfully");
            fetchUserChecklists(viewingChecklistsUserId);
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError("Failed to update checklist");
        }
    };

    const handleCreateTemplate = async (title, items) => {
        try {
            await axios.post(`http://localhost:5000/api/templates`, { title, items }, getAuthHeaders());
            setSuccessMessage("Template created successfully");
            fetchTemplates();
            setShowTemplateEditor(false);
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError("Failed to create template");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo & Brand */}
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative w-11 h-11 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-center shadow-2xl">
                                    <span className="text-xl">📋</span>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">Checklist Pro</h1>
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">Admin Dashboard</p>
                            </div>
                        </div>

                        {/* User Actions */}
                        <div className="flex items-center gap-6">
                            {/* Profile Box */}
                            <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                                <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-500/20">
                                    {(user?.name || user?.email || "A").charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-white leading-tight">{user?.name || user?.email || "Admin"}</span>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Administrator</span>
                                </div>
                            </div>

                            {/* Sign Out */}
                            <button
                                onClick={onLogout}
                                className="group relative flex items-center gap-2 px-5 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-300 shadow-lg"
                            >
                                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Title */}
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Welcome back, {user?.name || "Admin"} 👋</h2>
                        <p className="text-slate-400 mt-1">Manage system users, templates, and assignments.</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowTemplateEditor(true)}
                            className="px-4 py-2.5 bg-slate-800 border border-slate-700/50 text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-700 transition-all flex items-center gap-2"
                        >
                            📋 Manage Templates
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-400">Total Users</p>
                                <p className="text-3xl font-bold text-white mt-1">{users.length}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-700/50">
                            <p className="text-xs text-slate-500">All registered users in the system</p>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-400">Administrators</p>
                                <p className="text-3xl font-bold text-white mt-1">{users.filter(u => u.role === "admin").length}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-700/50">
                            <p className="text-xs text-slate-500">Users with admin privileges</p>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-400">Regular Users</p>
                                <p className="text-3xl font-bold text-white mt-1">{users.filter(u => u.role === "user").length}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-700/50">
                            <p className="text-xs text-slate-500">Standard user accounts</p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm">{error}</span>
                        </div>
                        <button onClick={() => setError("")} className="text-red-400 hover:text-red-300 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {successMessage && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm">{successMessage}</span>
                        </div>
                        <button onClick={() => setSuccessMessage("")} className="text-emerald-400 hover:text-emerald-300 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Users Table */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-white">All Users</h3>
                            <p className="text-sm text-slate-400 mt-0.5">Manage user accounts and roles</p>
                        </div>
                        <button
                            onClick={() => setShowAddUser(true)}
                            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all duration-200 shadow-lg shadow-purple-500/20 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add User
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-slate-400">Loading users...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-700/30">
                                    <tr>
                                        <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">User</th>
                                        <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Email</th>
                                        <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Role</th>
                                        <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Assign Template</th>
                                        <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50">
                                    {users.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-700/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-medium text-sm ${u.role === "admin"
                                                        ? "bg-gradient-to-br from-amber-400 to-orange-500"
                                                        : "bg-gradient-to-br from-blue-400 to-blue-600"
                                                        }`}>
                                                        {u.name?.charAt(0)?.toUpperCase() || "?"}
                                                    </div>
                                                    {editingDetailsUser === u.id ? (
                                                        <input
                                                            type="text"
                                                            value={editingData.name}
                                                            onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                                                            className="px-2 py-1 bg-slate-700/50 border border-slate-600 rounded text-sm text-white outline-none focus:border-purple-500"
                                                        />
                                                    ) : (
                                                        <span className="font-medium text-white">{u.name}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-400">
                                                {editingDetailsUser === u.id ? (
                                                    <input
                                                        type="email"
                                                        value={editingData.email}
                                                        onChange={(e) => setEditingData({ ...editingData, email: e.target.value })}
                                                        className="px-2 py-1 bg-slate-700/50 border border-slate-600 rounded text-sm text-white outline-none focus:border-purple-500"
                                                    />
                                                ) : (
                                                    u.email
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${u.role === 'admin' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                                                    <select
                                                        value={u.role}
                                                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                                                        disabled={u.id === user.id}
                                                        className={`bg-slate-700/50 border border-slate-600 rounded-lg px-2 py-1 text-xs font-semibold text-white focus:outline-none focus:border-purple-500 transition-all ${u.id === user.id ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-700 cursor-pointer"}`}
                                                    >
                                                        <option value="user">USER</option>
                                                        <option value="admin">ADMIN</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    onChange={(e) => handleAssignTemplate(u.id, e.target.value)}
                                                    className="bg-slate-700/50 border border-slate-600 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500 transition-all outline-none"
                                                    value=""
                                                >
                                                    <option value="" disabled>Select Template</option>
                                                    {templates.map(t => (
                                                        <option key={t.id} value={t.id}>{t.title}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {editingUser === u.id ? (
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="password"
                                                                placeholder="New password"
                                                                value={newPassword}
                                                                onChange={(e) => setNewPassword(e.target.value)}
                                                                className="px-3 py-1.5 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500"
                                                            />
                                                            <button
                                                                onClick={() => handleUpdatePassword(u.id)}
                                                                className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-sm rounded-lg hover:bg-emerald-500/30 transition-colors"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={() => { setEditingUser(null); setNewPassword(""); }}
                                                                className="px-3 py-1.5 bg-slate-600/50 text-slate-300 text-sm rounded-lg hover:bg-slate-600 transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {editingDetailsUser === u.id ? (
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={() => handleUpdateUserDetails(u.id)}
                                                                        className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-sm rounded-lg hover:bg-emerald-500/30 transition-colors"
                                                                    >
                                                                        Save
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setEditingDetailsUser(null)}
                                                                        className="px-3 py-1.5 bg-slate-600/50 text-slate-300 text-sm rounded-lg hover:bg-slate-600 transition-colors"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingDetailsUser(u.id);
                                                                        setEditingData({ name: u.name, email: u.email });
                                                                    }}
                                                                    className="px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                                                                >
                                                                    Edit
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => setEditingUser(u.id)}
                                                                className="px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                                                            >
                                                                Password
                                                            </button>
                                                            <button
                                                                onClick={() => fetchUserChecklists(u.id)}
                                                                className="px-3 py-1.5 text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors"
                                                            >
                                                                Checklists
                                                            </button>
                                                            {u.id !== user.id && (
                                                                <button
                                                                    onClick={() => handleDeleteUser(u.id)}
                                                                    className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                                                >
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* Add User Modal */}
            {showAddUser && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/50 w-full max-w-md animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">Add New User</h3>
                            <button
                                onClick={() => setShowAddUser(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleAddUser} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                                    placeholder="Enter name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                                    placeholder="Enter email"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                                    placeholder="Enter password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none appearance-none cursor-pointer"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddUser(false)}
                                    className="flex-1 px-4 py-3 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700/50 transition-all font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all font-medium shadow-lg shadow-purple-500/20"
                                >
                                    Add User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* User Checklists Modal */}
            {viewingChecklistsUserId && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/50 w-full max-w-2xl animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">Manage User Checklists</h3>
                            <button onClick={() => setViewingChecklistsUserId(null)} className="text-slate-400 hover:text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
                            {userChecklists.length === 0 ? (
                                <p className="text-center text-slate-500 py-8">No checklists assigned to this user.</p>
                            ) : (
                                userChecklists.map(checklist => (
                                    <div
                                        key={checklist.id}
                                        className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50 hover:border-purple-500/50 cursor-pointer transition-all group"
                                        onClick={() => setSelectedDetailChecklist(checklist)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-white font-bold group-hover:text-purple-400 transition-colors">{checklist.title}</h4>
                                                <span className="text-[10px] text-slate-500 uppercase tracking-widest">{new Date(checklist.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="bg-purple-500/10 text-purple-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-purple-500/20">
                                                View Details
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Detailed Checklist View Modal */}
            {selectedDetailChecklist && (
                <ChecklistModal
                    checklist={selectedDetailChecklist}
                    onClose={() => setSelectedDetailChecklist(null)}
                />
            )}

            {/* Template Editor Modal */}
            {showTemplateEditor && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/50 w-full max-w-md animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">Create Template</h3>
                            <button onClick={() => setShowTemplateEditor(false)} className="text-slate-400 hover:text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            handleCreateTemplate(formData.get('title'), [
                                { text: formData.get('item1'), completed: false },
                                { text: formData.get('item2'), completed: false },
                                { text: formData.get('item3'), completed: false }
                            ]);
                        }} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Template Title</label>
                                <input name="title" required className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white outline-none focus:border-purple-500" placeholder="e.g. Weekly Report" />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-slate-300">Initial Items</label>
                                <input name="item1" className="w-full px-4 py-2 bg-slate-700/30 border border-slate-600 rounded-lg text-sm text-white" placeholder="Task 1" />
                                <input name="item2" className="w-full px-4 py-2 bg-slate-700/30 border border-slate-600 rounded-lg text-sm text-white" placeholder="Task 2" />
                                <input name="item3" className="w-full px-4 py-2 bg-slate-700/30 border border-slate-600 rounded-lg text-sm text-white" placeholder="Task 3" />
                            </div>
                            <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20">
                                Save Template
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
