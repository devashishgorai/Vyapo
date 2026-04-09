"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Phone, RefreshCw, ShieldCheck } from "lucide-react";
import { buildApiUrl, getApiBaseUrl } from "@/lib/api";

const ADMIN_KEY_STORAGE = "vyapo-admin-key";

type ContactRequest = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  location?: string;
  message: string;
  createdAt: string;
};

type RequestResponse = {
  count: number;
  requests: ContactRequest[];
};

function formatRequestDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const latestRequest = useMemo(() => requests[0], [requests]);

  const fetchRequests = useCallback(async (key: string) => {
    setStatus("loading");
    setError("");

    const apiBaseUrl = getApiBaseUrl();

    if (!apiBaseUrl && process.env.NODE_ENV === "production") {
      setStatus("error");
      setError("Configure NEXT_PUBLIC_API_URL in Vercel so the admin panel can reach your backend.");
      return;
    }

    try {
      const headers: HeadersInit = {};

      if (key.trim()) {
        headers["x-admin-key"] = key.trim();
      }

      const response = await fetch(buildApiUrl("/api/requests"), {
        headers,
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(response.status === 401 ? "Invalid admin key." : "Unable to load customer requests.");
      }

      const data = (await response.json()) as RequestResponse;
      setRequests(data.requests);
      setStatus("success");
    } catch (requestError) {
      setStatus("error");
      setError(requestError instanceof Error ? requestError.message : "Unable to load customer requests.");
    }
  }, []);

  useEffect(() => {
    const savedKey = window.localStorage.getItem(ADMIN_KEY_STORAGE) || "";
    setAdminKey(savedKey);
    void fetchRequests(savedKey);
  }, [fetchRequests]);

  function handleKeySave() {
    window.localStorage.setItem(ADMIN_KEY_STORAGE, adminKey.trim());
    void fetchRequests(adminKey);
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-[8px] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white">
              <ArrowLeft size={16} />
              Back to website
            </Link>
            <p className="mt-5 text-sm uppercase tracking-[0.28em] text-[#F97316]">Admin Panel</p>
            <h1 className="mt-3 text-3xl font-black md:text-5xl">Customer requests</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              New contact form submissions from the VYAPO website appear here.
            </p>
          </div>
          <div className="grid gap-3 rounded-[8px] border border-white/10 bg-[#0b1f3a] p-4 md:w-[360px]">
            <label className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400" htmlFor="admin-key">
              Admin key
            </label>
            <input
              id="admin-key"
              type="password"
              value={adminKey}
              onChange={(event) => setAdminKey(event.target.value)}
              placeholder="Only needed if backend ADMIN_API_KEY is set"
              className="w-full rounded-[8px] border border-white/10 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-[#F97316] focus:ring-2 focus:ring-orange-500/30"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleKeySave}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-[8px] bg-[#F97316] px-4 py-3 text-sm font-black text-black transition hover:bg-orange-400"
              >
                <ShieldCheck size={16} />
                Save & load
              </button>
              <button
                type="button"
                onClick={() => fetchRequests(adminKey)}
                disabled={status === "loading"}
                className="inline-flex items-center justify-center rounded-[8px] border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Refresh requests"
              >
                <RefreshCw size={16} className={status === "loading" ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </div>

        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[8px] border border-white/10 bg-white/[0.06] p-5">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Total Requests</p>
            <p className="mt-3 text-4xl font-black">{requests.length}</p>
          </div>
          <div className="rounded-[8px] border border-white/10 bg-white/[0.06] p-5 md:col-span-2">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Latest Request</p>
            <p className="mt-3 text-xl font-black">{latestRequest ? latestRequest.name : "No requests yet"}</p>
            <p className="mt-1 text-sm text-slate-300">
              {latestRequest ? formatRequestDate(latestRequest.createdAt) : "Customer messages will appear after form submissions."}
            </p>
          </div>
        </section>

        {status === "error" && (
          <div className="mb-6 rounded-[8px] border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-200">
            {error}
          </div>
        )}

        <section className="grid gap-4">
          {status === "loading" && requests.length === 0 && (
            <div className="rounded-[8px] border border-white/10 bg-white/[0.06] p-8 text-center text-slate-300">
              Loading customer requests...
            </div>
          )}

          {status !== "loading" && requests.length === 0 && (
            <div className="rounded-[8px] border border-white/10 bg-white/[0.06] p-8 text-center text-slate-300">
              No customer requests found yet.
            </div>
          )}

          {requests.map((request) => (
            <article key={request._id} className="rounded-[8px] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/20">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-black">{request.name}</h2>
                  <p className="mt-2 text-sm text-slate-400">{formatRequestDate(request.createdAt)}</p>
                </div>
                <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-200">
                  New lead
                </div>
              </div>

              <div className="mt-5 grid gap-3 text-sm text-slate-200 md:grid-cols-3">
                <a href={`tel:${request.phone}`} className="inline-flex items-center gap-2 rounded-[8px] bg-white/[0.06] px-4 py-3 transition hover:bg-white/[0.1]">
                  <Phone size={16} />
                  {request.phone}
                </a>
                <a href={`mailto:${request.email}`} className="inline-flex items-center gap-2 rounded-[8px] bg-white/[0.06] px-4 py-3 transition hover:bg-white/[0.1]">
                  <Image src="/gmail-icon.png" alt="" width={16} height={16} className="h-4 w-4 shrink-0" />
                  <span className="break-all">{request.email}</span>
                </a>
                <div className="inline-flex items-center gap-2 rounded-[8px] bg-white/[0.06] px-4 py-3">
                  <Image src="/location-icon.png" alt="" width={16} height={16} className="h-4 w-4 shrink-0" />
                  {request.location || "Location not shared"}
                </div>
              </div>

              <p className="mt-5 whitespace-pre-wrap rounded-[8px] border border-white/10 bg-[#06101d] p-4 leading-7 text-slate-100">
                {request.message}
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
