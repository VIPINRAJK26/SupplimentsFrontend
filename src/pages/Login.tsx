import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLogin } from "../features/auth/hooks/useLogin";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { mutateAsync, isPending } = useLogin();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    try {
      await mutateAsync({
        username: form.username,
        password: form.password,
      });

      navigate("/")
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[120px] top-[-120px] left-[-120px]" />
      <div className="absolute w-[450px] h-[450px] rounded-full bg-purple-500/10 blur-[120px] bottom-[-120px] right-[-120px]" />

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
        }}
        className="
        relative
        w-full
        max-w-md
        p-8
        rounded-[2rem]
        bg-white/[0.03]
        border
        border-white/10
        backdrop-blur-xl
        shadow-[0_10px_40px_rgba(0,0,0,0.25)]
        "
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-white tracking-tight">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-zinc-500">Login to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold text-zinc-500">
              Username
            </label>

            <input
              type="text"
              value={form.username}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              placeholder="Enter username"
              className="
              w-full
              rounded-2xl
              bg-zinc-950/80
              border
              border-white/10
              px-4
              py-3.5
              text-zinc-100
              placeholder:text-zinc-600
              focus:outline-none
              focus:border-cyan-400/70
              transition-all
              "
              required
            />
          </div>

          {/* Password */}

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold text-zinc-500">
              Password
            </label>

            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              placeholder="Enter password"
              className="
              w-full
              rounded-2xl
              bg-zinc-950/80
              border
              border-white/10
              px-4
              py-3.5
              text-zinc-100
              placeholder:text-zinc-600
              focus:outline-none
              focus:border-cyan-400/70
              transition-all
              "
              required
            />
          </div>

          {/* Error */}

          {error && (
            <div
              className="
            rounded-2xl
            border
            border-red-500/20
            bg-red-500/10
            px-4
            py-3
            text-sm
            text-red-400
            "
            >
              {error}
            </div>
          )}

          {/* Button */}

          <button
            type="submit"
            disabled={isPending}
            className="
            w-full
            rounded-2xl
            py-3.5
            font-bold
            text-zinc-950
            bg-linear-to-r
            from-cyan-400
            to-teal-400
            hover:shadow-[0_0_30px_rgba(34,211,238,0.35)]
            transition-all
            disabled:opacity-50
            disabled:cursor-not-allowed
            cursor-pointer
            "
          >
            {isPending ? "Signing In..." : "Login"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
