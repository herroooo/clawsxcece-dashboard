"use client";

import React, { useState } from "react";

interface Prospect {
  id: string;
  username: string;
  styleInterest: string;
  status: "New" | "Contacted" | "Booked";
  notes: string;
}

const INITIAL_PROSPECTS: Prospect[] = [
  {
    id: "1",
    username: "y2k_vibes_toronto",
    styleInterest: "Gel-X 3D Charm Set",
    status: "New",
    notes: "Interacted with recent Reel on chrome nails",
  },
  {
    id: "2",
    username: "uoft_fashion_club",
    styleInterest: "Distressed Airbrush Art",
    status: "New",
    notes: "Tagged us in story photo",
  },
  {
    id: "3",
    username: "streetwear_cat",
    styleInterest: "Plaid & French Tip Merge",
    status: "Contacted",
    notes: "Sent initial deep link DM",
  },
];

export default function Dashboard() {
  const [prospects, setProspects] = useState<Prospect[]>(INITIAL_PROSPECTS);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [draft, setDraft] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerate = async (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setLoading(true);
    setDraft("");

    try {
      const res = await fetch("/api/generate-outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: prospect.username,
          styleInterest: prospect.styleInterest,
        }),
      });

      const data = await res.json();
      setDraft(data.text);
    } catch (err) {
      console.error(err);
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
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <header className="mb-8 border-b border-slate-800 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            @clawsxcece Lead Engine
          </h1>
          <p className="text-sm text-slate-400">
            Compliant Inbound Capture & Outreach Pipeline
          </p>
        </div>
        <div className="text-xs bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 text-slate-300">
          Status: <span className="text-emerald-400 font-semibold">Active Pipeline</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pipeline Table */}
        <section className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-slate-200">Leads Queue</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800 text-slate-400 uppercase text-xs">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Style Focus</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {prospects.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/50">
                    <td className="p-3 font-medium text-white">@{item.username}</td>
                    <td className="p-3 text-slate-400">{item.styleInterest}</td>
                    <td className="p-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          item.status === "New"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : item.status === "Contacted"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleGenerate(item)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs transition"
                      >
                        Draft DM
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Action Panel */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-slate-200">Outreach Console</h2>
            {selectedProspect ? (
              <div className="space-y-4">
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-400">Target Profile</p>
                  <p className="text-base font-bold text-white">@{selectedProspect.username}</p>
                  <p className="text-xs text-indigo-400 mt-1">{selectedProspect.styleInterest}</p>
                </div>

                {loading ? (
                  <div className="p-6 text-center text-slate-400 text-sm animate-pulse">
                    Crafting personalized draft...
                  </div>
                ) : draft ? (
                  <div className="space-y-3">
                    <label className="text-xs text-slate-400">Generated Message</label>
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      rows={4}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    />

                    <div className="flex gap-2">
                      <a
                        href={`https://ig.me/m/${selectedProspect.username}?text=${encodeURIComponent(
                          draft
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => updateStatus(selectedProspect.id, "Contacted")}
                        className="flex-1 text-center py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-bold text-xs rounded-lg transition"
                      >
                        Open IG & Send DM
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-12">
                Select a lead from the queue to generate outreach.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
