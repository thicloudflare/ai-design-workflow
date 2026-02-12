"use client";

import { useState, useEffect } from "react";
import { Check, X, ExternalLink, Sparkles, Eye, EyeOff, Trash2, Plus, Edit, Save } from "lucide-react";
import Navigation from "@/components/Navigation";
import { phases as staticPhases } from "@/data/phases";

interface Submission {
  id: number;
  name: string;
  url: string;
  description: string;
  icon: "gemini" | "miro";
  phase_number: number;
  phase_title: string;
  section_title: string;
  use_case: string;
  submitted_by_name: string;
  submitted_by_email: string;
  submitted_at: string;
  status: string;
}

interface ApprovedTool {
  id: number | string;
  name: string;
  url: string;
  description: string;
  icon: "gemini" | "miro";
  phase_number: number;
  phase_title: string;
  section_title: string;
  visible: number;
  approved_at: string | null;
  source?: "static" | "submitted";
}

const ICON_OPTIONS = ["gemini", "miro"] as const;

export default function AdminSubmissions() {
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [allTools, setAllTools] = useState<ApprovedTool[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingToolId, setEditingToolId] = useState<number | string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    description: "",
    icon: "gemini" as "gemini" | "miro",
    phase_number: 1,
    phase_title: "",
    section_title: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadSubmissions();
      loadAllTools();
      loadStats();
    }
  }, [isAuthenticated]);

  const loadSubmissions = async () => {
    try {
      const response = await fetch("/api/admin/submissions");
      const data = await response.json();
      console.log("Submissions response:", data);
      if (data.success) {
        setSubmissions(data.data);
      } else {
        console.error("Failed to load submissions:", data);
        alert(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Failed to load submissions:", error);
      alert(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadAllTools = async () => {
    try {
      const response = await fetch("/api/admin/tools");
      const data = await response.json();
      if (data.success) {
        setAllTools(data.data);
      }
    } catch (error) {
      console.error("Failed to load tools:", error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handleApprove = async (submissionId: number) => {
    if (!password) {
      alert("Please enter admin password");
      return;
    }

    try {
      const response = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, adminPassword: password }),
      });

      const data = await response.json();

      if (data.success) {
        alert(
          data.prUrl
            ? `Approved! PR created: ${data.prUrl}`
            : "Approved! (No GitHub PR created - configure GITHUB_TOKEN)"
        );
        loadSubmissions();
        loadAllTools();
        loadStats();
      } else {
        alert(`Failed to approve: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to approve submission");
    }
  };

  const handleHide = async (toolId: number | string) => {
    if (typeof toolId === 'string') {
      alert("Cannot hide static tools from homepage");
      return;
    }

    try {
      const response = await fetch("/api/admin/tools/hide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId, adminPassword: password }),
      });

      const data = await response.json();
      if (data.success) {
        loadAllTools();
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to hide tool");
    }
  };

  const handleShow = async (toolId: number | string) => {
    if (typeof toolId === 'string') {
      alert("Static homepage tools are always visible");
      return;
    }

    try {
      const response = await fetch("/api/admin/tools/show", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId, adminPassword: password }),
      });

      const data = await response.json();
      if (data.success) {
        loadAllTools();
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to show tool");
    }
  };

  const handleDelete = async (toolId: number | string, toolName: string) => {
    if (typeof toolId === 'string') {
      alert("Cannot delete static tools from homepage");
      return;
    }

    if (!confirm(`Are you sure you want to permanently delete "${toolName}"?`)) {
      return;
    }

    try {
      const response = await fetch("/api/admin/tools/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId, adminPassword: password }),
      });

      const data = await response.json();
      if (data.success) {
        loadAllTools();
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to delete tool");
    }
  };

  const handleAddTool = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/admin/tools/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolData: formData, adminPassword: password }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Tool added successfully!");
        setShowAddForm(false);
        setFormData({
          name: "",
          url: "",
          description: "",
          icon: "gemini",
          phase_number: 1,
          phase_title: "",
          section_title: "",
        });
        loadAllTools();
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to add tool");
    }
  };

  const handleEditTool = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingToolId || typeof editingToolId === 'string') return;

    try {
      const response = await fetch("/api/admin/tools/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          toolId: editingToolId, 
          toolData: formData, 
          adminPassword: password 
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Tool updated successfully!");
        setEditingToolId(null);
        setFormData({
          name: "",
          url: "",
          description: "",
          icon: "gemini",
          phase_number: 1,
          phase_title: "",
          section_title: "",
        });
        loadAllTools();
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to update tool");
    }
  };

  const startEditTool = (tool: ApprovedTool) => {
    if (typeof tool.id === 'string') {
      alert("Static homepage tools cannot be edited here. Edit them in the codebase (data/phases.ts)");
      return;
    }

    setEditingToolId(tool.id);
    setFormData({
      name: tool.name,
      url: tool.url,
      description: tool.description || "",
      icon: tool.icon,
      phase_number: tool.phase_number,
      phase_title: tool.phase_title,
      section_title: tool.section_title,
    });
    setShowAddForm(true);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingToolId(null);
    setFormData({
      name: "",
      url: "",
      description: "",
      icon: "gemini",
      phase_number: 1,
      phase_title: "",
      section_title: "",
    });
  };

  const handleReject = async (submissionId: number) => {
    if (!password) {
      alert("Please enter admin password");
      return;
    }

    const reason = prompt("Reason for rejection (optional):");

    try {
      const response = await fetch("/api/admin/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, reason, adminPassword: password }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Submission rejected");
        loadSubmissions();
        loadStats();
      } else {
        alert(`Failed to reject: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to reject submission");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      setIsAuthenticated(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-kumo-base text-text-default flex items-center justify-center p-8">
        <div className="bg-kumo-elevated border border-kumo-brand/30 rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-semibold mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-kumo-recessed border border-kumo-line rounded-lg px-4 py-3 text-text-default focus:outline-none focus:border-kumo-brand focus:ring-1 focus:ring-kumo-brand"
              required
            />
            <button
              type="submit"
              className="w-full bg-kumo-brand hover:bg-kumo-brand-hover text-white py-3 rounded-lg font-medium"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kumo-base text-text-default">
      <main className="flex flex-col gap-8 p-8">
        <Navigation />

        <div className="max-w-6xl mx-auto w-full space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-semibold">Tool Management</h1>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setPassword("");
              }}
              className="text-text-subtle hover:text-text-default text-sm"
            >
              Logout
            </button>
          </div>

          {/* Tabs */}
          <div className="flex justify-between items-center border-b border-kumo-line">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("pending")}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === "pending"
                    ? "border-b-2 border-kumo-brand text-kumo-brand-text"
                    : "text-text-subtle hover:text-text-default"
                }`}
              >
                Pending Approval ({submissions.length})
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === "all"
                    ? "border-b-2 border-kumo-brand text-kumo-brand-text"
                    : "text-text-subtle hover:text-text-default"
                }`}
              >
                All Tools ({allTools.length})
              </button>
            </div>
            {activeTab === "all" && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 bg-kumo-brand hover:bg-kumo-brand-hover text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Tool
              </button>
            )}
          </div>

          {/* Stats */}
          {stats && activeTab === "pending" && (
            <div className="grid grid-cols-3 gap-4">
              {stats.byStatus?.map((stat: any) => (
                <div
                  key={stat.status}
                  className="bg-kumo-elevated border border-kumo-line rounded-lg p-4"
                >
                  <div className="text-2xl font-semibold">{stat.count}</div>
                  <div className="text-text-subtle capitalize">{stat.status}</div>
                </div>
              ))}
            </div>
          )}

          {/* Add/Edit Tool Form */}
          {showAddForm && (
            <div className="bg-kumo-elevated border border-kumo-brand/30 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {editingToolId ? "Edit Tool" : "Add New Tool"}
              </h2>
              <form onSubmit={editingToolId ? handleEditTool : handleAddTool} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tool Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-kumo-recessed border border-kumo-line rounded-lg px-4 py-2 text-text-default placeholder-text-inactive focus:outline-none focus:border-kumo-brand"
                      required
                      placeholder="Enter tool name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tool URL *</label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="w-full bg-kumo-recessed border border-kumo-line rounded-lg px-4 py-2 text-text-default placeholder-text-inactive focus:outline-none focus:border-kumo-brand"
                      required
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-kumo-recessed border border-kumo-line rounded-lg px-4 py-2 text-text-default placeholder-text-inactive focus:outline-none focus:border-kumo-brand h-24"
                    placeholder="Enter tool description"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Icon *</label>
                    <select
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value as "gemini" | "miro" })}
                      className="w-full bg-kumo-recessed border border-kumo-line rounded-lg px-4 py-2 text-text-default focus:outline-none focus:border-kumo-brand"
                      required
                    >
                      {ICON_OPTIONS.map((icon) => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phase *</label>
                    <select
                      value={formData.phase_number}
                      onChange={(e) => {
                        const phaseNum = parseInt(e.target.value);
                        const phase = staticPhases.find(p => p.number === phaseNum);
                        setFormData({ 
                          ...formData, 
                          phase_number: phaseNum,
                          phase_title: phase?.title || "",
                          section_title: ""
                        });
                      }}
                      className="w-full bg-kumo-recessed border border-kumo-line rounded-lg px-4 py-2 text-text-default focus:outline-none focus:border-kumo-brand"
                      required
                    >
                      {staticPhases.map((phase) => (
                        <option key={phase.number} value={phase.number}>
                          {phase.number}. {phase.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Section *</label>
                    <select
                      value={formData.section_title}
                      onChange={(e) => setFormData({ ...formData, section_title: e.target.value })}
                      className="w-full bg-kumo-recessed border border-kumo-line rounded-lg px-4 py-2 text-text-default focus:outline-none focus:border-kumo-brand"
                      required
                    >
                      <option value="">Select section</option>
                      {staticPhases
                        .find(p => p.number === formData.phase_number)
                        ?.sections.map((section) => (
                          <option key={section.title} value={section.title}>
                            {section.title}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-kumo-brand hover:bg-kumo-brand-hover text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    {editingToolId ? "Update Tool" : "Add Tool"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="flex-1 bg-kumo-tint hover:bg-kumo-interact text-text-default py-3 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab Content */}
          {activeTab === "pending" ? (
            loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kumo-brand mx-auto"></div>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-12 text-text-subtle">
              No pending submissions
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="bg-kumo-elevated border border-kumo-line rounded-lg p-6 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {submission.icon === "gemini" ? (
                          <Sparkles className="w-5 h-5 text-purple-400" />
                        ) : (
                          <ExternalLink className="w-5 h-5 text-kumo-info" />
                        )}
                        <h3 className="text-xl font-semibold">{submission.name}</h3>
                      </div>

                      <a
                        href={submission.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-kumo-brand-text hover:text-kumo-brand text-sm flex items-center gap-1 mb-3"
                      >
                        {submission.url}
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      {submission.description && (
                        <p className="text-text-subtle mb-3">{submission.description}</p>
                      )}

                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="bg-kumo-brand/20 text-kumo-brand-text px-3 py-1 rounded-lg">
                          Phase {submission.phase_number}: {submission.phase_title}
                        </span>
                        <span className="bg-kumo-info/20 text-kumo-info px-3 py-1 rounded-lg">
                          {submission.section_title}
                        </span>
                      </div>

                      {submission.use_case && (
                        <div className="mt-3 text-sm text-text-subtle">
                          <strong>Use case:</strong> {submission.use_case}
                        </div>
                      )}

                      <div className="mt-3 text-xs text-text-inactive">
                        Submitted by {submission.submitted_by_name || submission.submitted_by_email} on{" "}
                        {new Date(submission.submitted_at).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleApprove(submission.id)}
                        className="bg-kumo-success hover:opacity-90 text-white p-3 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleReject(submission.id)}
                        className="bg-kumo-danger hover:opacity-90 text-white p-3 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
          ) : (
            <div className="space-y-4">
              {allTools.map((tool) => (
                <div
                  key={tool.id}
                  className={`bg-kumo-elevated border rounded-lg p-6 transition-all ${
                    tool.visible === 1
                      ? "border-kumo-line"
                      : "border-kumo-warning/30 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {tool.icon === "gemini" ? (
                          <Sparkles className="w-5 h-5 text-purple-400" />
                        ) : (
                          <ExternalLink className="w-5 h-5 text-kumo-info" />
                        )}
                        <h3 className="text-xl font-semibold">{tool.name}</h3>
                        {tool.source === 'static' && (
                          <span className="text-xs bg-kumo-info/20 text-kumo-info px-2 py-1 rounded-lg">
                            Homepage
                          </span>
                        )}
                        {tool.visible === 0 && (
                          <span className="text-xs bg-kumo-warning/20 text-kumo-warning px-2 py-1 rounded-lg">
                            Hidden
                          </span>
                        )}
                      </div>

                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-kumo-brand-text hover:text-kumo-brand text-sm flex items-center gap-1 mb-3"
                      >
                        {tool.url}
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      {tool.description && (
                        <p className="text-text-subtle mb-3">{tool.description}</p>
                      )}

                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="bg-kumo-brand/20 text-kumo-brand-text px-3 py-1 rounded-lg">
                          Phase {tool.phase_number}: {tool.phase_title}
                        </span>
                        <span className="bg-kumo-info/20 text-kumo-info px-3 py-1 rounded-lg">
                          {tool.section_title}
                        </span>
                      </div>

                      <div className="mt-3 text-xs text-text-inactive">
                        {tool.approved_at ? (
                          <>Approved: {new Date(tool.approved_at).toLocaleString()}</>
                        ) : (
                          <>Static homepage tool</>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditTool(tool)}
                        className={`p-3 rounded-lg transition-colors ${
                          tool.source === 'static' 
                            ? 'bg-kumo-tint text-text-inactive cursor-not-allowed' 
                            : 'bg-kumo-info hover:opacity-90 text-white'
                        }`}
                        title={tool.source === 'static' ? 'Cannot edit static tools' : 'Edit tool'}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      {tool.visible === 1 ? (
                        <button
                          onClick={() => handleHide(tool.id)}
                          className={`p-3 rounded-lg transition-colors ${
                            tool.source === 'static'
                              ? 'bg-kumo-tint text-text-inactive cursor-not-allowed'
                              : 'bg-kumo-warning hover:opacity-90 text-white'
                          }`}
                          title={tool.source === 'static' ? 'Static tools always visible' : 'Hide from public'}
                        >
                          <EyeOff className="w-5 h-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleShow(tool.id)}
                          className="bg-kumo-success hover:opacity-90 text-white p-3 rounded-lg transition-colors"
                          title="Show to public"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(tool.id, tool.name)}
                        className={`p-3 rounded-lg transition-colors ${
                          tool.source === 'static'
                            ? 'bg-kumo-tint text-text-inactive cursor-not-allowed'
                            : 'bg-kumo-danger hover:opacity-90 text-white'
                        }`}
                        title={tool.source === 'static' ? 'Cannot delete static tools' : 'Delete permanently'}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
