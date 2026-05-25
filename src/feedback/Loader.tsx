import { motion } from "framer-motion";

const drops = [0, 1, 2, 3, 4];

interface SyringeLoaderProps {
  isOpen?: boolean;
}

const SyringeLoader: React.FC<SyringeLoaderProps> = ({ isOpen = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#050816]/95 backdrop-blur-xl transition-all duration-500">
      {/* Background Glow */}
      <div className="absolute h-[250px] w-[250px] rounded-full bg-cyan-500/10 blur-3xl animate-pulse" />

      {/* Syringe Wrapper - Rotated to -60 deg so needle points upward at a 30 degree tilt to right */}
      <motion.div
        className="relative flex items-center justify-center scale-[0.55] sm:scale-[0.7]"
        animate={{
          rotate: [-60, -58, -60],
          y: [0, -8, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Syringe Main */}
        <div className="relative flex items-center">
          {/* Plunger */}
          <motion.div
            className="relative flex items-center z-10"
            animate={{
              x: [0, 55, 0],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Handle */}
            <div className="relative h-12 w-6 rounded-xl border border-zinc-500 bg-linear-to-b from-zinc-700 to-zinc-900 shadow-[0_0_20px_rgba(255,255,255,0.08)] flex items-center justify-center">
              <div className="h-7 w-[5px] rounded-full bg-zinc-400/40" />
            </div>

            {/* Rod */}
            <div className="h-[4px] w-16 bg-linear-to-r from-zinc-500 to-zinc-300 shadow-md" />
          </motion.div>

          {/* Glass Tube */}
          <div className="relative h-14 w-[120px] overflow-hidden rounded-r-[2.5rem] rounded-l-xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(6,182,212,0.15)] flex items-center">
            {/* Inner Reflection */}
            <div className="absolute left-3 top-1.5 h-2 w-24 rounded-full bg-white/20 blur-md" />

            {/* Medicine */}
            <motion.div
              className="absolute left-0 top-0 h-full bg-linear-to-r from-cyan-500 via-cyan-400 to-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.5)]"
              animate={{
                width: ["85%", "15%", "85%"],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Liquid Shine */}
              <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.5),transparent)] animate-pulse" />
            </motion.div>

            {/* Measurement Marks */}
            <div className="absolute inset-0 flex items-center justify-evenly px-8 pointer-events-none">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-[2px] ${
                    i % 2 === 0 ? "h-8 bg-white/60" : "h-4 bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Needle - Perfectly centered on the right of the glass tube */}
        <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 flex items-center">
          <div className="h-[4px] w-[40px] bg-linear-to-r from-zinc-300 via-zinc-100 to-zinc-400 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />

          {/* Needle Tip */}
          <div className="h-3 w-3 rotate-45 border-r-[3px] border-t-[3px] border-zinc-100 -ml-1 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        </div>

        {/* Liquid Spill Droplets */}
        <div className="absolute right-[-95px] top-1/2 -translate-y-1/2">
          {drops.map((drop, i) => (
            <motion.div
              key={drop}
              className="absolute h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,1)]"
              initial={{
                opacity: 0,
                x: 0,
                y: 0,
                scale: 0.5,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: [0, 30 + i * 5, 50 + i * 10],
                y: [0, 10 + i * 12, 40 + i * 20],
                scale: [0.5, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        {/* Glow under syringe */}
        <motion.div
          className="absolute h-16 w-[200px] rounded-full bg-cyan-400/20 blur-3xl -z-10"
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
};

export default SyringeLoader;
