"use client";

import React, { useState, useEffect, useCallback } from "react";

interface Prospect {
  id: string;
  username: string;
  styleInterest: string;
  status: "New" | "Contacted" | "Booked";
  notes: string;
}

interface CalendlyBooking {
  id: string;
  clientName: string;
  instagramHandle: string;
  servicePreference: string;
  appointmentTime: string;
  price: string;
  inspoPhotoUrl: string;
}

const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vR6vmPLxraM66uC_0Fv1mruHiCQ2j8Vq0YlTAviS--6L_fLjuCRpq--XZYxNppQpxta1qI_0RJ1A8TA/pub?output=csv";

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

// Parses CSV text safely even when cells contain newlines or commas inside quotes
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentVal = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      currentRow.push(currentVal.trim());
      currentVal = "";
    } else if ((char === "\r" || char === "\n") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") i++;
      currentRow.push(currentVal.trim());
      if (currentRow.some((cell) => cell !== "")) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentVal = "";
    } else {
      currentVal += char;
    }
  }

  if (currentVal !== "" || currentRow.length > 0) {
    currentRow.push(currentVal.trim());
    if (currentRow.some((cell) => cell !== "")) {
      rows.push(currentRow);
    }
  }

  return rows;
}

export default function Dashboard() {
  const [prospects, setProspects] = useState<Prospect[]>(INITIAL_PROSPECTS);
  const [bookings, setBookings] = useState<CalendlyBooking[]>([]);
  const [syncingBookings, setSyncingBookings] = useState(true);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(
    null
  );
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBookings = useCallback(async () => {
    setSyncingBookings(true);
    try {
      const response = await fetch(`${GOOGLE_SHEET_CSV_URL}&t=${Date.now()}`, {
        cache: "no-store",
      });
      const csvText = await response.text();
      const rows = parseCSV(csvText);

      // Load saved local prices so manual price edits persist on refresh
      let savedPrices: Record<string, string> = {};
      try {
        const stored = localStorage.getItem("clawsxcece_prices");
        if (stored) savedPrices = JSON.parse(stored);
      } catch {
        // Ignore storage errors
      }

      // Skip header row (index 0) and map columns A-G
      const parsedBookings: CalendlyBooking[] = rows
        .slice(1)
        .filter((row) => row[1] || row[2]) // Ensure clientName or instagramHandle exists
        .map((row, idx) => {
          const bookingId = row[0] || `row-${idx}`;
          const sheetPrice = row[5] || "";
          return {
            id: bookingId,
            clientName: row[1] || "Client",
            instagramHandle: row[2] || "",
            servicePreference: (row[3] || "Nail Appointment").replace(
              /\n+/g,
              " • "
            ),
            appointmentTime: row[4] || "TBD",
            price: savedPrices[bookingId] ?? sheetPrice,
            inspoPhotoUrl: row[6] || "",
          };
        });

      setBookings(parsedBookings);
    } catch (error) {
      console.error("Failed to fetch Google Sheet bookings:", error);
    } finally {
      setSyncingBookings(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

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

  // Update price for a specific booking and save locally
  const handlePriceChange = (id: string, newPrice: string) => {
    setBookings((prev) => {
      const updated = prev.map((b) =>
        b.id === id ? { ...b, price: newPrice } : b
      );
      try {
        const priceMap: Record<string, string> = {};
        updated.forEach((b) => {
          if (b.price !== "") priceMap[b.id] = b.price;
        });
        localStorage.setItem("clawsxcece_prices", JSON.stringify(priceMap));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  };

  // Handle attaching an inspiration photo from device
  const handlePhotoUpload = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, inspoPhotoUrl: imageUrl } : b))
      );
    }
  };

  // Summed total of profits from all booking price boxes
  const totalProfits = bookings.reduce((sum, booking) => {
    const num = parseFloat(booking.price);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

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

      {/* --- LEADS QUEUE & OUTREACH CONSOLE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
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

      {/* --- CALENDLY APPOINTMENTS TIMELINE & PROFIT TRACKER --- */}
      <section className="bg-white/80 backdrop-blur-sm border border-slate-900/10 rounded-xl p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Calendly Appointments Timeline
            </h2>
            <p className="text-xs text-slate-600">
              Synced schedule with client IG usernames, service preferences, inspo photos, & pricing
            </p>
          </div>

          <button
            onClick={fetchBookings}
            disabled={syncingBookings}
            className="px-3 py-1.5 bg-[#FFB5E7] hover:bg-[#ffa2e1] disabled:opacity-50 text-slate-900 font-semibold text-xs rounded-lg transition-colors shadow-sm"
          >
            {syncingBookings ? "Syncing..." : "↻ Refresh Sheet"}
          </button>
        </div>

        {/* Timeline Boxes */}
        {syncingBookings && bookings.length === 0 ? (
          <p className="text-sm text-slate-600 py-6 text-center animate-pulse">
            Loading synced Calendly bookings...
          </p>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">
            No bookings synced yet. New Calendly appointments will appear here automatically.
          </p>
        ) : (
          <div className="relative border-l-2 border-[#FFB5E7] ml-3 space-y-6 pb-2">
            {bookings.map((booking) => (
              <div key={booking.id} className="relative pl-6">
                {/* Timeline Dot */}
                <span className="absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-[#FFB5E7] border-2 border-white shadow-sm" />

                <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Time, Client & Preference */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFB5E7]/40 text-slate-900">
                        {booking.appointmentTime}
                      </span>
                      <span className="font-bold text-slate-900">
                        {booking.clientName}
                      </span>
                      {booking.instagramHandle && (
                        <span className="text-xs font-medium text-slate-500">
                          ({booking.instagramHandle})
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 pt-1">
                      <span className="font-semibold text-slate-900">
                        Service Preference:{" "}
                      </span>
                      {booking.servicePreference}
                    </p>
                  </div>

                  {/* Right: Inspo Photo Dropdown & Price Box */}
                  <div className="flex flex-wrap items-center gap-4 shrink-0">
                    {/* Dropdown for Attaching/Viewing Inspo Photo */}
                    <details className="relative">
                      <summary className="cursor-pointer list-none px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5">
                        <span>
                          {booking.inspoPhotoUrl
                            ? "🖼️ Inspo Attached ▾"
                            : "📎 Attach Inspo ▾"}
                        </span>
                      </summary>

                      <div className="absolute right-0 mt-2 w-60 p-3 bg-white border border-slate-200 rounded-xl shadow-lg z-10 space-y-2">
                        <label className="block text-xs font-semibold text-slate-700">
                          Upload Client Inspo Photo:
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(booking.id, e)}
                          className="block w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#FFB5E7] file:text-slate-900 hover:file:bg-[#ffa2e1] cursor-pointer"
                        />
                        {booking.inspoPhotoUrl && (
                          <img
                            src={booking.inspoPhotoUrl}
                            alt="Client nail inspiration"
                            className="w-full h-36 object-cover rounded-lg border border-slate-200 mt-2"
                          />
                        )}
                      </div>
                    </details>

                    {/* Price Input Box */}
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Price ($):
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={booking.price}
                        onChange={(e) =>
                          handlePriceChange(booking.id, e.target.value)
                        }
                        className="w-24 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FFB5E7]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Summed Total of Profits */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
          <span className="text-sm font-semibold text-slate-700">
            Total Estimated Profits ({bookings.length} Appointments)
          </span>
          <div className="px-4 py-2 bg-[#FFB5E7] rounded-xl shadow-sm">
            <span className="text-lg font-extrabold text-slate-900">
              ${totalProfits.toFixed(2)}
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
