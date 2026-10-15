"use client";

import React, { useState } from "react";

interface Prospect {
  id: string;
  username: string;
  styleInterest: string;
  status: "New" | "Contacted" | "Booked";
  notes: string;
}

interface PostMetric {
  id: string;
  title: string;
  type: "Reel" | "Post" | "Story";
  views: string;
  likes: number;
  comments: number;
  leadsGenerated: number;
  engagementPercent: number;
}

const INITIAL_PROSPECTS: Prospect[] = [
  {
    id: "1",
    username: "cecesbraindump",
    styleInterest: "Gel-X Chrome Set",
    status: "New",
    notes: "Interacted with recent Reel on chrome nails",
  },
  {
    id: "2",
    username: "_cecilia.chen_",
    styleInterest: "Concert-Themed Nails",
    status: "New",
    notes: "Liked a post about BTS concert nails",
  },
  {
    id: "3",
    username: "kevinlaceste_",
    styleInterest: "Halloween-Inspired Set",
    status: "Contacted",
    notes: "Sent initial personalized DM",
  },
];

const MOCK_POST_METRICS: PostMetric[] = [
  {
    id: "p1",
    title: "Chrome Gel-X Application Tutorial 💅✨",
    type: "Reel",
    views: "14.2K",
    likes: 1240,
    comments: 88,
    leadsGenerated: 12,
    engagementPercent: 88,
  },
  {
    id: "p2",
    title: "BTS Concert Set Breakdown & Details",
    type: "Post",
    views: "8.5K",
    likes: 910,
    comments: 42,
    leadsGenerated: 7,
    engagementPercent: 65,
  },
  {
    id: "p3",
    title: "3D Airbrush & Charm Flash Sets",
    type: "Story",
    views: "3.1K",
    likes: 380,
    comments: 19,
    leadsGenerated: 4,
    engagementPercent: 45,
  },
];

export default function Dashboard() {
  const [prospects, setProspects] = useState<Prospect[]>(INITIAL_PROSPECTS);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(
    null
  );
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setLoading(true);
    setDraft("");

    try {
      const res = await fetch("/api/generate-outreach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: prospect.username,
          styleInterest: prospect.styleInterest,
        }),
      });

      const data = await res.json();
      setDraft(data.text || "");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (id: string, newStatus: Prospect["status"]) => {
    setProspects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  return (
    <main className="min-h-screen bg-[#B0FEE8] text-slate-900 p-8 font-sans antialiased">
      <header className="mb-8 border-b border-slate-900/10 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            @clawsxcece Lead Engine
          </h1>
          <p className="text-sm text-slate-700">
            Compliant Inbound Capture & Outreach Pipeline
          </p>
        </div>

        {/* Top Right Logo Container */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="ClawsxCece Logo"
            className="w-14 h-14 object-contain rounded-full shadow-sm"
          />
        </div>
      </header>

      {/* --- MOCK ANALYTICS SECTION --- */}
      <section className="mb-8 bg-white/80 backdrop-blur-sm border border-slate-900/10 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              Content Performance & Engagement (Simulated)
            </h2>
            <p className="text-xs text-slate-600">
              Correlating post engagement to inbound DM lead conversion
            </p>
          </div>
          <span className="text-xs px-3 py-1 bg-[#FFB5E7]/50 rounded-full font-medium text-slate-800">
            Last 30 Days
          </span>
        </div>

        {/* Top Level Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-lg">
            <p className="text-xs font-medium text-slate-500">Total Reach</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">25.8K</p>
            <p className="text-xs text-emerald-600 mt-1">↑ 14% vs last week</p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-lg">
            <p className="text-xs font-medium text-slate-500">
              Avg. Engagement Rate
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">8.4%</p>
            <p className="text-xs text-emerald-600 mt-1">↑ 2.1% benchmark</p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-lg">
            <p className="text-xs font-medium text-slate-500">
              Captured Inbound Leads
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">23 Leads</p>
            <p className="text-xs text-slate-600 mt-1">Via Reel/Post comments</p>
          </div>
        </div>

        {/* Individual Post Engagement Breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-800">
            Top Performing Content
          </h3>
          {MOCK_POST_METRICS.map((post) => (
            <div
              key={post.id}
              className="p-3 bg-white border border-slate-100 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                    {post.type}
                  </span>
                  <p className="text-sm font-semibold text-slate-900">
                    {post.title}
                  </p>
                </div>
                {/* Visual Progress/Engagement Bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-[#FFB5E7] h-full rounded-full"
                    style={{ width: `${post.engagementPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-600 shrink-0">
                <div>
                  <span className="block font-bold text-slate-900">
                    {post.views}
                  </span>
                  Views
                </div>
                <div>
                  <span className="block font-bold text-slate-900">
                    {post.likes}
                  </span>
                  Likes
                </div>
                <div>
                  <span className="block font-bold text-slate-900">
                    {post.leadsGenerated}
                  </span>
                  Leads Tagged
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- LEADS QUEUE & OUTREACH CONSOLE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-white/80 backdrop-blur-sm border border-slate-900/10 rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-slate-900 tracking-tight">
            Leads Queue
          </h2>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 text-sm">
                <th className="pb-2 font-medium">User</th>
                <th className="pb-2 font-medium">Style Focus</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {prospects.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 font-medium">@{item.username}</td>
                  <td className="py-3 text-slate-700">{item.styleInterest}</td>
                  <td className="py-3">
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-[#FFB5E7]/40 text-slate-900">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => handleGenerate(item)}
                      className="px-3 py-1.5 bg-[#FFB5E7] hover:bg-[#ffa2e1] text-slate-900 font-medium text-xs rounded-lg transition-colors shadow-sm"
                    >
                      Draft DM
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="bg-white/80 backdrop-blur-sm border border-slate-900/10 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-slate-900 tracking-tight">
              Outreach Console
            </h2>

            {selectedProspect ? (
              <>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-3">
                  <p className="font-semibold text-slate-900">
                    @{selectedProspect.username}
                  </p>
                  <p className="text-xs text-slate-600">
                    {selectedProspect.styleInterest}
                  </p>
                </div>

                {loading ? (
                  <p className="text-sm text-slate-600 animate-pulse">
                    Crafting personalized draft...
                  </p>
                ) : (
                  <>
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      rows={5}
                      className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FFB5E7]"
                    />

                    <a
                      href={`https://www.instagram.com/${
                        selectedProspect.username
                      }?text=${encodeURIComponent(draft)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        updateStatus(selectedProspect.id, "Contacted")
                      }
                      className="block mt-3 text-center bg-[#FFB5E7] hover:bg-[#ffa2e1] text-slate-900 font-medium rounded-lg p-2.5 text-sm transition-colors shadow-sm"
                    >
                      Open IG & Send DM
                    </a>
                  </>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-500 py-8 text-center">
                Select a lead to generate outreach.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
}
