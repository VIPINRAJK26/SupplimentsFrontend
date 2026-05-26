import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SyringeLoader from "../feedback/Loader";
import { useCustomers } from "../features/customers/hooks/useCustomers";
import { useProducts } from "../features/products/hooks/useProducts";
import { useOrders, useCreateOrder } from "../features/orders/hooks/useOrders";
import type { CreateOrderPayload } from "../features/orders/api/getOrders";

const SVG_ICONS = {
  calendar: (
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
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  user: (
    <svg
      className="w-5 h-5 text-purple-400"
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
      className="w-5 h-5 text-cyan-400"
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
  tag: (
    <svg
      className="w-5 h-5 text-emerald-400"
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
  check: (
    <svg
      className="w-6 h-6 text-emerald-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
};

const formatINR = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};

const IndexPage: React.FC = () => {
  const [orderDate, setOrderDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantityType, setQuantityType] = useState<"bottle" | "loose">(
    "bottle",
  );

  const [quantity, setQuantity] = useState<number>(1);

  const [looseQuantity, setLooseQuantity] = useState<string>("");
  const [paymentType, setPaymentType] = useState<"Credit" | "Paid">("Paid");
  const [creditAmount, setCreditAmount] = useState<string>("");
  const { data: customers } = useCustomers();
  const { data: products } = useProducts();
  const { data: orders } = useOrders();
  const createOrderMutation = useCreateOrder();

  console.log(products, "products");

  console.log(customers, "customers");

  console.log(orders, "orders");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const selectedCustomer = useMemo(() => {
    if (!Array.isArray(customers)) return null;

    return customers.find((c) => String(c.user_id) === selectedCustomerId);
  }, [customers, selectedCustomerId]);

  const selectedProduct = useMemo(() => {
    if (!Array.isArray(products)) return null;

    return products.find((p) => String(p.product_id) === selectedProductId);
  }, [products, selectedProductId]);

  const pricing = useMemo(() => {
    if (
      !Array.isArray(customers) ||
      !selectedCustomerId ||
      !selectedProductId
    ) {
      return null;
    }

    const customerProductRecord = customers.find(
      (c) =>
        String(c.user_id) === selectedCustomerId &&
        String(c.product) === selectedProductId,
    );

    if (!customerProductRecord) return null;

    const unitPrice = Number(customerProductRecord.price);

    let finalPrice = 0;

    if (quantityType === "bottle") {
      finalPrice = unitPrice * quantity;
    } else {
      const enteredMl = Number(looseQuantity || 0);

      finalPrice = (enteredMl / 20) * unitPrice;
    }

    return {
      unitPrice,
      finalPriceNum: finalPrice,
      finalPriceFormatted: formatINR(finalPrice),
    };
  }, [
    customers,
    selectedCustomerId,
    selectedProductId,
    quantity,
    quantityType,
    looseQuantity,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCustomerId || !selectedProductId || !pricing) return;

    if (paymentType === "Credit" && !creditAmount) {
      alert("Enter credit amount");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload: CreateOrderPayload = {
        user: Number(selectedCustomerId),
        product: Number(selectedProductId),
        quantity:
          quantityType === "bottle"
            ? quantity
            : Number(looseQuantity),

        quantity_status: quantityType,

        bottle_quantity:
          quantityType === "bottle"
            ? quantity
            : null,

        loose_quantity:
          quantityType === "loose"
            ? Number(looseQuantity)
            : null,

        status: paymentType === "Credit" ? "credit" : "paid",

        price: pricing.finalPriceNum,

        credit_price: paymentType === "Credit" ? Number(creditAmount) : null,
      };

      await createOrderMutation.mutateAsync(payload);
      setCreditAmount("");

      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
      alert("Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedCustomerId("");
    setSelectedProductId("");
    setQuantity(1);
    setPaymentType("Paid");
    setShowSuccessModal(false);
  };

  return (
    <div className="h-screen bg-[#050816] text-zinc-100 flex flex-col items-center justify-center relative overflow-x-hidden p-4 sm:p-6 lg:p-8 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Syringe Loading Modal overlay */}
      <SyringeLoader isOpen={isSubmitting} />

      {/* Decorative Radial linear Background Blurs */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      {/* Top Navigation */}
      <div className="w-full  max-w-2xl mx-auto mb-6 flex justify-center items-center z-20 bg-white/5 backdrop-blur-2xl border border-white/10 px-6 py-4 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <Link
          to="/records"
          className="px-5 py-2.5 bg-linear-to-r text-center from-cyan-400 to-teal-400 text-zinc-950 rounded-2xl font-black text-sm uppercase tracking-wider hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
        >
          View Records
        </Link>
      </div>

      {/* Main Container */}
      <motion.div
        className="w-full max-w-2xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_0_80px_rgba(6,182,212,0.15)] p-6 sm:p-10 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* 1. Date Selection (Top) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              {SVG_ICONS.calendar} Dispatch Date
            </label>
            <div className="relative group">
              <input
                type="date"
                required
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full bg-zinc-900/80 border border-white/10 rounded-2xl px-4 py-3.5 text-zinc-100 font-medium focus:outline-none focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-400/20 transition-all shadow-inner scheme-dark cursor-pointer"
              />
              <div className="absolute inset-0 rounded-2xl bg-cyan-400/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* 2. Customer Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                {SVG_ICONS.user} Client Partner
              </label>
              <div className="relative group">
                <select
                  required
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full bg-zinc-900/80 border border-white/10 rounded-2xl px-4 py-3.5 text-zinc-100 font-medium appearance-none focus:outline-none focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-400/20 transition-all shadow-inner cursor-pointer"
                >
                  <option value="" className="text-zinc-500">
                    -- Select Client --
                  </option>
                  {Array.isArray(customers) &&
                    customers.map((c: any) => (
                      <option key={c.user_id} value={String(c.user_id)}>
                        {c.name}
                      </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 group-hover:text-cyan-400 transition-colors">
                  ▼
                </div>
              </div>
            </div>

            {/* 3. Product Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                {SVG_ICONS.package} Supplement
              </label>
              <div className="relative group">
                <select
                  required
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-zinc-900/80 border border-white/10 rounded-2xl px-4 py-3.5 text-zinc-100 font-medium appearance-none focus:outline-none focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-400/20 transition-all shadow-inner cursor-pointer"
                >
                  <option value="" className="text-zinc-500">
                    -- Select Product --
                  </option>
                  {Array.isArray(products) &&
                    products.map((p: any) => (
                      <option key={p.product_id} value={String(p.product_id)}>
                        {p.name}
                      </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 group-hover:text-cyan-400 transition-colors">
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-5">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Quantity Type
            </label>

            {/* Bottle / Loose Toggle */}

            <div className="grid grid-cols-2 gap-4 bg-zinc-900/60 p-2 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setQuantityType("bottle");
                  setLooseQuantity("");
                }}
                className={`py-3 rounded-xl font-bold transition-all cursor-pointer ${
                  quantityType === "bottle"
                    ? "bg-cyan-500 text-zinc-950"
                    : "text-zinc-400"
                }`}
              >
                Bottle
              </button>

              <button
                type="button"
                onClick={() => {
                  setQuantityType("loose");
                  setQuantity(1);
                }}
                className={`py-3 rounded-xl font-bold transition-all cursor-pointer ${
                  quantityType === "loose"
                    ? "bg-purple-500 text-white"
                    : "text-zinc-400"
                }`}
              >
                Loose
              </button>
            </div>

            {/* Bottle Quantity */}

            <AnimatePresence mode="wait">
              {quantityType === "bottle" ? (
                <motion.div
                  key="bottle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex items-center justify-between bg-zinc-900/50 border border-white/5 rounded-2xl p-4">
                    <span className="text-sm font-semibold text-zinc-300">
                      Bottle Quantity
                    </span>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-9 h-9 rounded-xl bg-white/5 border border-white/10"
                      >
                        -
                      </button>

                      <span className="w-10 text-center font-bold text-lg text-cyan-400">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-9 h-9 rounded-xl bg-white/5 border border-white/10"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="loose"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300">
                      Loose Quantity (ml)
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={looseQuantity}
                      onChange={(e) => setLooseQuantity(e.target.value)}
                      placeholder="Enter loose quantity"
                      className="w-full bg-zinc-900/80 border border-white/10 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 4. Dynamic Pricing Display (Appears when both customer and product are selected) */}
          <AnimatePresence>
            {pricing ? (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
                className="overflow-hidden"
              >
                <div className="bg-linear-to-br from-cyan-500/10 via-purple-500/10 to-transparent border border-cyan-400/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-[0_0_40px_rgba(34,211,238,0.15)] relative backdrop-blur-md">
                  {/* <div className="absolute -top-3 right-6 bg-cyan-400 text-zinc-950 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    {pricing.tier} (-{pricing.rate}%)
                  </div> */}

                  <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm tracking-wide">
                    {SVG_ICONS.tag}Pricing Summary
                  </div>

                  <div className="space-y-2 border-b border-white/10 pb-4">
                    <div className="flex justify-between text-zinc-400 text-sm">
                      <span>Unit Price</span>
                      <span className="font-mono">{pricing.finalPriceNum}</span>
                    </div>

                    <div className="flex justify-between text-zinc-400 text-sm">
                      <span>Quantity</span>
                      <span className="font-mono">
                        {quantityType === "bottle"
                          ? `${quantity} Bottle(s)`
                          : `${looseQuantity || 0} ml`}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline pt-2">
                    <span className="text-lg font-bold text-zinc-200">
                      Final Price
                    </span>
                    <span className="text-3xl sm:text-4xl font-extrabold text-cyan-400 tracking-tight font-mono drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                      {pricing.finalPriceFormatted}
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="border border-dashed border-white/10 rounded-3xl p-6 text-center text-zinc-500 text-sm font-medium bg-zinc-900/30">
                Select a Client Partner and Supplement SKU to view computed
                pricing.
              </div>
            )}
          </AnimatePresence>

          {/* 5. Two buttons on bottom: Credit / Paid */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block text-center sm:text-left">
              Payment Terms
            </label>
            <div className="grid grid-cols-2 gap-4 bg-zinc-900/60 p-2 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setPaymentType("Credit")}
                className={`py-3.5 rounded-xl font-bold text-sm transition-all duration-300 relative flex items-center justify-center gap-2 cursor-pointer ${
                  paymentType === "Credit"
                    ? "bg-linear-to-r from-purple-500 to-indigo-600 text-white shadow-[0_0_25px_rgba(168,85,247,0.5)]"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <span>Credit</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentType("Paid");
                  setCreditAmount("");
                }}
                className={`py-3.5 rounded-xl font-bold text-sm transition-all duration-300 relative flex items-center justify-center gap-2 cursor-pointer ${
                  paymentType === "Paid"
                    ? "bg-linear-to-r from-cyan-500 to-teal-500 text-zinc-950 font-extrabold shadow-[0_0_25px_rgba(6,182,212,0.5)]"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <span>Paid</span>
              </button>
            </div>

            <AnimatePresence>
              {paymentType === "Credit" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 mt-4">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                      Credit Amount
                    </label>

                    <input
                      type="number"
                      min="0"
                      max={pricing?.finalPriceNum}
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(e.target.value)}
                      placeholder="Enter remaining credit amount"
                      className="w-full bg-zinc-900/80 border border-white/10 rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 6. Finally the submit button */}
          <motion.button
            type="submit"
            disabled={!pricing}
            whileHover={pricing ? { scale: 1.02 } : {}}
            whileTap={pricing ? { scale: 0.98 } : {}}
            className={`w-full py-4.5 rounded-2xl font-extrabold text-lg tracking-wide uppercase shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 mt-4 ${
              pricing
                ? "bg-linear-to-r from-cyan-400 via-teal-400 to-emerald-400 text-zinc-950 hover:shadow-[0_0_40px_rgba(34,211,238,0.7)] cursor-pointer"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
            }`}
          >
            <span>Confirm Order</span>
            <span className="text-xl">➔</span>
          </motion.button>
        </form>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 max-w-md w-full text-center space-y-6 shadow-[0_0_80px_rgba(16,185,129,0.2)] relative overflow-hidden"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
                {SVG_ICONS.check}
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">
                  Order Successfully Dispatched!
                </h3>
                <p className="text-zinc-400 text-sm font-medium">
                  Dispatch record created for{" "}
                  <strong className="text-cyan-400">
                    {selectedCustomer?.name}
                  </strong>
                  . Invoice marked as{" "}
                  <span className="underline decoration-cyan-400 font-bold">
                    {paymentType}
                  </span>
                  .
                </p>
              </div>
              <div className="bg-zinc-950/60 p-4 rounded-2xl border border-white/5 text-left text-sm space-y-2">
                <div className="flex justify-between text-zinc-400">
                  <span>Product:</span>
                  <span className="text-zinc-200 truncate ml-2 max-w-[200px]">
                    {selectedProduct?.name}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Quantity:</span>
                  <span className="text-zinc-200 font-bold">
                    {quantityType === "bottle"
  ? `${quantity} Bottle(s)`
  : `${looseQuantity} ml`}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400 pt-1 border-t border-white/5">
                  <span>Total Billed:</span>
                  <span className="text-cyan-400 font-mono font-extrabold">
                    {pricing?.finalPriceFormatted}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-3.5 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 text-zinc-950 font-black text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all cursor-pointer"
                >
                  New Order
                </button>
                <Link
                  to="/records"
                  className="flex-1 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-zinc-100 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  View Records ➔
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IndexPage;
