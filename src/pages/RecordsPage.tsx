import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export interface RecordItem {
  id: string;
  orderDate: string;
  customerName: string;
  customerTier: string;
  productName: string;
  quantity: number;
  finalPrice: number;
  paymentStatus: "Credit" | "Paid";
  createdAt: string;
}

const INITIAL_RECORDS: RecordItem[] = [
  {
    id: "REC-728194",
    orderDate: "2026-05-18",
    customerName: "Akshay",
    customerTier: "Wholesale VIP",
    productName: "Premium Ultra Whey Isolate (2kg)",
    quantity: 12,
    finalPrice: 60473.6,
    paymentStatus: "Paid",
    createdAt: "2026-05-18T10:30:00Z",
  },
  {
    id: "REC-492018",
    orderDate: "2026-05-17",
    customerName: "Pro Athlete Union",
    customerTier: "Pro Partner",
    productName: "Pre-Workout Explosive Surge (300g)",
    quantity: 25,
    finalPrice: 64987.2,
    paymentStatus: "Credit",
    createdAt: "2026-05-17T14:15:00Z",
  },
  {
    id: "REC-103948",
    orderDate: "2026-05-15",
    customerName: "Metro Pharmacy Group",
    customerTier: "Distributor",
    productName: "BCAA High-Energy Electrolytes (500g)",
    quantity: 50,
    finalPrice: 119969.6,
    paymentStatus: "Paid",
    createdAt: "2026-05-15T09:20:00Z",
  },
  {
    id: "REC-883921",
    orderDate: "2026-05-14",
    customerName: "Powerhouse Gyms",
    customerTier: "Gym Partner",
    productName: "Micronized Creatine Monohydrate (1kg)",
    quantity: 15,
    finalPrice: 44150.4,
    paymentStatus: "Paid",
    createdAt: "2026-05-14T16:45:00Z",
  },
  {
    id: "REC-339201",
    orderDate: "2026-05-12",
    customerName: "Direct Consumer VIP",
    customerTier: "Retail Club",
    productName: "Omega-3 Arctic Fish Oil (120 caps)",
    quantity: 8,
    finalPrice: 17274.4,
    paymentStatus: "Credit",
    createdAt: "2026-05-12T11:05:00Z",
  },
];

const SVG_ICONS = {
  search: (
    <svg
      className="w-5 h-5 text-zinc-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
  filter: (
    <svg
      className="w-5 h-5 text-zinc-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
      />
    </svg>
  ),
  calendar: (
    <svg
      className="w-4 h-4 text-cyan-400 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  user: (
    <svg
      className="w-4 h-4 text-purple-400 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  package: (
    <svg
      className="w-4 h-4 text-emerald-400 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  ),
  trending: (
    <svg
      className="w-5 h-5 text-cyan-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  ),
  tag: (
    <svg
      className="w-4 h-4 text-cyan-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
      />
    </svg>
  ),
  plus: (
    <svg
      className="w-4 h-4 text-zinc-950 font-bold"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  ),
  refresh: (
    <svg
      className="w-3.5 h-3.5 text-zinc-400 group-hover:text-cyan-400 transition-colors"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  ),
};

const RecordsPage: React.FC = () => {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Paid" | "Credit">(
    "All",
  );
  const [sortBy, setSortBy] = useState<"date" | "price" | "quantity">("date");

  useEffect(() => {
    const stored = localStorage.getItem("B2B_SUPPLEMENT_RECORDS");
    if (stored) {
      try {
        setRecords(JSON.parse(stored));
      } catch (e) {
        setRecords(INITIAL_RECORDS);
      }
    } else {
      setRecords(INITIAL_RECORDS);
      localStorage.setItem(
        "B2B_SUPPLEMENT_RECORDS",
        JSON.stringify(INITIAL_RECORDS),
      );
    }
  }, []);

  const handleStatusUpdate = (id: string, newStatus: "Paid" | "Credit") => {
    const updated = records.map((record) =>
      record.id === id ? { ...record, paymentStatus: newStatus } : record,
    );
    setRecords(updated);
    localStorage.setItem("B2B_SUPPLEMENT_RECORDS", JSON.stringify(updated));
  };

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const filteredRecords = useMemo(() => {
    let result = records.filter((item) => {
      const matchSearch =
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        filterStatus === "All" || item.paymentStatus === filterStatus;

      return matchSearch && matchStatus;
    });

    result.sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );
      }
      if (sortBy === "price") {
        return b.finalPrice - a.finalPrice;
      }
      if (sortBy === "quantity") {
        return b.quantity - a.quantity;
      }
      return 0;
    });

    return result;
  }, [records, searchQuery, filterStatus, sortBy]);

  // Statistics calculations
  const stats = useMemo(() => {
    const totalVolume = records.reduce((acc, curr) => acc + curr.finalPrice, 0);
    const totalUnits = records.reduce((acc, curr) => acc + curr.quantity, 0);
    const paidVolume = records
      .filter((r) => r.paymentStatus === "Paid")
      .reduce((acc, curr) => acc + curr.finalPrice, 0);
    const creditVolume = records
      .filter((r) => r.paymentStatus === "Credit")
      .reduce((acc, curr) => acc + curr.finalPrice, 0);

    return {
      totalVolume: formatINR(totalVolume),
      totalUnits,
      paidVolume: formatINR(paidVolume),
      creditVolume: formatINR(creditVolume),
    };
  }, [records]);

  const formatDate = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      return new Date(dateStr).toLocaleDateString("en-IN", options);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-zinc-100 p-4 sm:p-6 lg:p-10 font-sans relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient Radial Linear Gradients */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8 sm:space-y-10">
        {/* Navigation Header */}
        <header className="flex justify-center items-center bg-white/5 backdrop-blur-2xl border border-white/10 px-6 py-4 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <Link
            to="/"
            className="px-5 py-2.5 bg-linear-to-r from-cyan-400 to-teal-400 text-zinc-950 rounded-2xl font-black text-sm uppercase tracking-wider hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all flex items-center gap-2 shadow-lg cursor-pointer"
          >
            {SVG_ICONS.plus} New Dispatch
          </Link>
        </header>

        {/* Hero Section */}

        {/* Key Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-xl group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-400 rounded-l-3xl" />
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              {SVG_ICONS.trending} Total Revenue Billed
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {stats.totalVolume}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-xl group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-400 rounded-l-3xl" />
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              {SVG_ICONS.package} Supplement Units
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {stats.totalUnits}{" "}
              <span className="text-base text-zinc-500 font-medium">SKUs</span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-xl group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-400 rounded-l-3xl" />
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              {SVG_ICONS.tag} Settlement Distribution
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-baseline gap-2 sm:gap-3 mt-1 font-mono">
              <span className="text-emerald-400 font-extrabold text-base sm:text-lg">
                {stats.paidVolume}{" "}
                <span className="text-[10px] font-sans font-bold uppercase text-zinc-500 tracking-wider">
                  Paid
                </span>
              </span>
              <span className="hidden sm:inline text-zinc-600">/</span>
              <span className="text-purple-400 font-extrabold text-base sm:text-lg">
                {stats.creditVolume}{" "}
                <span className="text-[10px] font-sans font-bold uppercase text-zinc-500 tracking-wider">
                  Credit
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-zinc-900/60 backdrop-blur-2xl border border-white/10 p-4 rounded-3xl shadow-lg">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              {SVG_ICONS.search}
            </div>
            <input
              type="text"
              placeholder="Search by client, product name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950/80 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-zinc-100 text-sm font-medium focus:outline-none focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder:text-zinc-500"
            />
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Pills */}
            <div className="flex bg-zinc-950/80 p-1.5 rounded-2xl border border-white/10">
              {(["All", "Paid", "Credit"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    filterStatus === status
                      ? "bg-white/10 text-cyan-400 shadow-md"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "date" | "price" | "quantity")
                }
                className="bg-zinc-950/80 border border-white/10 rounded-2xl px-4 py-3 text-zinc-200 text-xs font-bold uppercase tracking-wider appearance-none pr-9 focus:outline-none focus:border-cyan-400/80 cursor-pointer"
              >
                <option value="date">Sort: Date</option>
                <option value="price">Sort: Price</option>
                <option value="quantity">Sort: Quantity</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-xs font-bold">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Records Table / Cards */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-zinc-950/40 text-xs font-extrabold uppercase tracking-widest text-zinc-400">
                  <th className="py-5 px-6">Dispatch ID & Date</th>
                  <th className="py-5 px-6">Client Partner</th>
                  <th className="py-5 px-6">Product SKU</th>
                  <th className="py-5 px-6 text-center">Quantity</th>
                  <th className="py-5 px-6">Status</th>
                  <th className="py-5 px-6 text-right">Total Price</th>
                  <th className="py-5 px-6 text-center">
                    Action / Update Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                      <motion.tr
                        key={record.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="border-b border-white/5 hover:bg-white/[0.04] transition-colors group"
                      >
                        {/* ID and Date */}
                        <td className="py-5 px-6 font-mono">
                          <div className="text-zinc-200 font-bold text-sm flex items-center gap-2">
                            {SVG_ICONS.calendar} {formatDate(record.orderDate)}
                          </div>
                          <div className="text-xs text-zinc-500 tracking-wider mt-0.5">
                            {record.id}
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="py-5 px-6">
                          <div className="text-zinc-100 font-bold text-sm flex items-center gap-2">
                            {SVG_ICONS.user} {record.customerName}
                          </div>
                          <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-white/5 text-zinc-400 text-xs font-semibold border border-white/10 tracking-wide">
                            {record.customerTier}
                          </div>
                        </td>

                        {/* Product */}
                        <td className="py-5 px-6 max-w-xs">
                          <div className="text-zinc-100 font-semibold text-sm flex items-center gap-2 truncate">
                            {SVG_ICONS.package}{" "}
                            <span className="truncate">
                              {record.productName}
                            </span>
                          </div>
                        </td>

                        {/* Quantity */}
                        <td className="py-5 px-6 text-center font-mono font-bold text-sm text-cyan-400">
                          {record.quantity}
                          <span className="text-xs text-zinc-500 ml-1 font-sans font-normal">
                            units
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-5 px-6">
                          {record.paymentStatus === "Paid" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-extrabold uppercase tracking-wider border border-cyan-400/30 shadow-inner">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />{" "}
                              Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-extrabold uppercase tracking-wider border border-purple-400/30 shadow-inner">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />{" "}
                              Credit
                            </span>
                          )}
                        </td>

                        {/* Price */}
                        <td className="py-5 px-6 text-right font-mono font-extrabold text-base text-white">
                          {formatINR(record.finalPrice)}
                        </td>

                        {/* Action / Select Status Dropdown */}
                        <td className="py-5 px-6 text-center">
                          <div className="inline-block relative group/select">
                            <select
                              value={record.paymentStatus}
                              onChange={(e) =>
                                handleStatusUpdate(
                                  record.id,
                                  e.target.value as "Paid" | "Credit",
                                )
                              }
                              className="bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs font-extrabold uppercase tracking-wider text-zinc-200 focus:outline-none focus:border-cyan-400/80 transition-all cursor-pointer appearance-none pr-8 shadow-md"
                              title="Update Status"
                            >
                              <option
                                value="Paid"
                                className="bg-zinc-950 text-cyan-400 font-bold"
                              >
                                ● Status: Paid
                              </option>
                              <option
                                value="Credit"
                                className="bg-zinc-950 text-purple-400 font-bold"
                              >
                                ● Status: Credit
                              </option>
                            </select>
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 group-hover/select:text-cyan-400 transition-colors text-xs">
                              {SVG_ICONS.refresh}
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-16 text-zinc-500 text-sm font-medium"
                      >
                        No records match the current filter criteria.
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Cards View */}
          <div className="block lg:hidden divide-y divide-white/10">
            <AnimatePresence>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <motion.div
                    key={record.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs text-zinc-500 font-mono tracking-wider">
                          {record.id}
                        </span>
                        <div className="text-zinc-200 font-bold text-sm flex items-center gap-1.5 mt-0.5">
                          {SVG_ICONS.calendar} {formatDate(record.orderDate)}
                        </div>
                      </div>
                      <div>
                        {record.paymentStatus === "Paid" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-extrabold uppercase tracking-wider border border-cyan-400/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />{" "}
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-extrabold uppercase tracking-wider border border-purple-400/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />{" "}
                            Credit
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                      <div className="text-zinc-100 font-bold text-base flex items-center gap-2">
                        {SVG_ICONS.user} {record.customerName}
                      </div>
                      <div className="text-zinc-400 text-xs font-semibold pl-6">
                        {record.customerTier}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-200 text-sm font-medium">
                      {SVG_ICONS.package}{" "}
                      <span className="truncate">{record.productName}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="text-sm">
                        <span className="text-zinc-500 mr-2">Qty:</span>
                        <span className="font-mono font-bold text-cyan-400 text-base">
                          {record.quantity}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-zinc-500 text-xs block">
                          Total Price
                        </span>
                        <span className="font-mono font-extrabold text-xl text-white">
                          {formatINR(record.finalPrice)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        Update Status:
                      </span>
                      <div className="relative inline-block">
                        <select
                          value={record.paymentStatus}
                          onChange={(e) =>
                            handleStatusUpdate(
                              record.id,
                              e.target.value as "Paid" | "Credit",
                            )
                          }
                          className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-zinc-200 focus:outline-none focus:border-cyan-400/80 appearance-none pr-8"
                        >
                          <option
                            value="Paid"
                            className="bg-zinc-950 text-cyan-400"
                          >
                            ● Status: Paid
                          </option>
                          <option
                            value="Credit"
                            className="bg-zinc-950 text-purple-400"
                          >
                            ● Status: Credit
                          </option>
                        </select>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-xs">
                          {SVG_ICONS.refresh}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-16 text-zinc-500 text-sm font-medium">
                  No records match the current filter criteria.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordsPage;
