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
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <header className="mb-8 border-b border-slate-800 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">@clawsxcece Lead Engine</h1>
          <p className="text-sm text-slate-400">
            Compliant Inbound Capture & Outreach Pipeline
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">Leads Queue</h2>

          <table className="w-full text-left">
            <thead>
              <tr>
                <th>User</th>
                <th>Style Focus</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {prospects.map((item) => (
                <tr key={item.id}>
                  <td>@{item.username}</td>
                  <td>{item.styleInterest}</td>
                  <td>{item.status}</td>
                  <td>
                    <button
                      onClick={() => handleGenerate(item)}
                      className="px-3 py-2 bg-indigo-600 rounded"
                    >
                      Draft DM
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">Outreach Console</h2>

          {selectedProspect ? (
            <>
              <p>@{selectedProspect.username}</p>
              <p>{selectedProspect.styleInterest}</p>

              {loading ? (
                <p>Crafting personalized draft...</p>
              ) : (
                <>
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={5}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 mt-4"
                  />

                  <a
                    href={`https://ig.me/m/${
                      selectedProspect.username
                    }?text=${encodeURIComponent(draft)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      updateStatus(selectedProspect.id, "Contacted")
                    }
                    className="block mt-3 text-center bg-pink-600 rounded p-2"
                  >
                    Open IG & Send DM
                  </a>
                </>
              )}
            </>
          ) : (
            <p>Select a lead to generate outreach.</p>
          )}
        </section>
      </div>
    </main>
  );
}
