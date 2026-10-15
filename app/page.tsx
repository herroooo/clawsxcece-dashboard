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
    username: "streetwear_cat",
    styleInterest: "Plaid & French Tip Merge",
    status: "Contacted",
    notes: "Sent initial personalized DM",
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
    <main className="min-h-screen bg-[#B0FEE8] text-slate-900 p-8">
      <header className="mb-8 border-b border-slate-900/10 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">@clawsxcece Lead Engine</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-white/80 backdrop-blur-sm border border-slate-900/10 rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-slate-900">
            Leads Queue
          </h2>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 text-sm">
                <th className="pb-2">User</th>
                <th className="pb-2">Style Focus</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {prospects.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 font-medium">@{item.username}</td>
                  <td className="py-3 text-slate-700">{item.styleInterest}</td>
                  <td className="py-3">
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-[#FFB5E7]/40 text-slate-900">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => handleGenerate(item)}
                      className="px-3 py-1.5 bg-[#FFB5E7] hover:bg-[#ffa2e1] text-slate-900 font-semibold text-xs rounded-lg transition-colors shadow-sm"
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
            <h2 className="text-lg font-semibold mb-4 text-slate-900">
              Outreach Console
            </h2>

            {selectedProspect ? (
              <>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-3">
                  <p className="font-bold text-slate-900">
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
                      className="block mt-3 text-center bg-[#FFB5E7] hover:bg-[#ffa2e1] text-slate-900 font-bold rounded-lg p-2.5 text-sm transition-colors shadow-sm"
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
