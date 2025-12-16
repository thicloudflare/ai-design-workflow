"use client";

import { useState, useEffect } from "react";
import { Check, X, ExternalLink, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";

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

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadSubmissions();
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
        loadStats();
      } else {
        alert(`Failed to approve: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to approve submission");
    }
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

        <div className="max-w-6xl mx-auto w-full space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">Tool Submissions</h1>
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

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-4">
              {stats.byStatus?.map((stat: any) => (
                <div
                  key={stat.status}
                  className="bg-navy-800 border border-white/20 rounded p-4"
                >
                  <div className="text-2xl font-bold">{stat.count}</div>
                  <div className="text-white/60 capitalize">{stat.status}</div>
                </div>
              ))}
            </div>
          )}

          {/* Submissions List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              No pending submissions
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="bg-navy-800 border border-white/20 rounded-lg p-6 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {submission.icon === "gemini" ? (
                          <Sparkles className="w-5 h-5 text-purple-400" />
                        ) : (
                          <ExternalLink className="w-5 h-5 text-blue-400" />
                        )}
                        <h3 className="text-xl font-bold">{submission.name}</h3>
                      </div>

                      <a
                        href={submission.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:text-orange-400 text-sm flex items-center gap-1 mb-3"
                      >
                        {submission.url}
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      {submission.description && (
                        <p className="text-white/80 mb-3">{submission.description}</p>
                      )}

                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded">
                          Phase {submission.phase_number}: {submission.phase_title}
                        </span>
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded">
                          {submission.section_title}
                        </span>
                      </div>

                      {submission.use_case && (
                        <div className="mt-3 text-sm text-white/60">
                          <strong>Use case:</strong> {submission.use_case}
                        </div>
                      )}

                      <div className="mt-3 text-xs text-white/40">
                        Submitted by {submission.submitted_by_name || submission.submitted_by_email} on{" "}
                        {new Date(submission.submitted_at).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleApprove(submission.id)}
                        className="bg-green-600 hover:bg-green-700 text-white p-3 rounded transition-colors"
                        title="Approve"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleReject(submission.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-3 rounded transition-colors"
                        title="Reject"
                      >
                        <X className="w-5 h-5" />
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
