"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Trash2, ExternalLink, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";

interface ApprovedTool {
  id: number;
  name: string;
  url: string;
  description: string;
  icon: "gemini" | "miro";
  phase_number: number;
  phase_title: string;
  section_title: string;
  visible: number;
  approved_at: string;
}

export default function AdminTools() {
  const [tools, setTools] = useState<ApprovedTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadTools();
    }
  }, [isAuthenticated]);

  const loadTools = async () => {
    try {
      const response = await fetch("/api/admin/tools");
      const data = await response.json();
      if (data.success) {
        setTools(data.data);
      }
    } catch (error) {
      console.error("Failed to load tools:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleHide = async (toolId: number) => {
    try {
      const response = await fetch("/api/admin/tools/hide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId, adminPassword: password }),
      });

      const data = await response.json();
      if (data.success) {
        loadTools();
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to hide tool");
    }
  };

  const handleShow = async (toolId: number) => {
    try {
      const response = await fetch("/api/admin/tools/show", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId, adminPassword: password }),
      });

      const data = await response.json();
      if (data.success) {
        loadTools();
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to show tool");
    }
  };

  const handleDelete = async (toolId: number, toolName: string) => {
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
        loadTools();
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to delete tool");
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
      <div className="min-h-screen bg-navy-900 text-white flex items-center justify-center p-8">
        <div className="bg-navy-800 border border-orange-500/30 rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-navy-700 border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-orange-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded font-medium"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900 text-white">
      <main className="flex flex-col gap-8 p-8">
        <Navigation />

        <div className="max-w-7xl mx-auto w-full space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">Manage Tools</h1>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setPassword("");
              }}
              className="text-white/60 hover:text-white text-sm"
            >
              Logout
            </button>
          </div>

          <div className="bg-navy-800 border border-white/20 rounded p-4 flex gap-4 text-sm">
            <div>
              <span className="text-white/60">Total: </span>
              <span className="font-bold">{tools.length}</span>
            </div>
            <div>
              <span className="text-white/60">Visible: </span>
              <span className="font-bold text-green-400">
                {tools.filter((t) => t.visible === 1).length}
              </span>
            </div>
            <div>
              <span className="text-white/60">Hidden: </span>
              <span className="font-bold text-orange-400">
                {tools.filter((t) => t.visible === 0).length}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            </div>
          ) : tools.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              No approved tools yet
            </div>
          ) : (
            <div className="space-y-4">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  className={`bg-navy-800 border rounded-lg p-6 transition-all ${
                    tool.visible === 1
                      ? "border-white/20"
                      : "border-orange-500/30 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {tool.icon === "gemini" ? (
                          <Sparkles className="w-5 h-5 text-purple-400" />
                        ) : (
                          <ExternalLink className="w-5 h-5 text-blue-400" />
                        )}
                        <h3 className="text-xl font-bold">{tool.name}</h3>
                        {tool.visible === 0 && (
                          <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
                            Hidden
                          </span>
                        )}
                      </div>

                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:text-orange-400 text-sm flex items-center gap-1 mb-3"
                      >
                        {tool.url}
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      {tool.description && (
                        <p className="text-white/80 mb-3">{tool.description}</p>
                      )}

                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded">
                          Phase {tool.phase_number}: {tool.phase_title}
                        </span>
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded">
                          {tool.section_title}
                        </span>
                      </div>

                      <div className="mt-3 text-xs text-white/40">
                        Approved: {new Date(tool.approved_at).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {tool.visible === 1 ? (
                        <button
                          onClick={() => handleHide(tool.id)}
                          className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded transition-colors"
                          title="Hide from public"
                        >
                          <EyeOff className="w-5 h-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleShow(tool.id)}
                          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded transition-colors"
                          title="Show to public"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(tool.id, tool.name)}
                        className="bg-red-600 hover:bg-red-700 text-white p-3 rounded transition-colors"
                        title="Delete permanently"
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
