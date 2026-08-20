'use client';
import { motion } from 'framer-motion';

const TOOLS = [
  { name: 'Base44', angle: 0, image: '/icons/membership/Base44.svg' },
  { name: 'Bolt', angle: 72, image: '/icons/membership/bolt-new.svg' },
  { name: 'Lovable', angle: 144, image: '/icons/membership/lovable.svg' },
  { name: 'Replit', angle: 216, image: '/icons/membership/replit.svg' },
  { name: 'v0', angle: 288, image: '/icons/membership/v0.svg' },
];

const PROCESS_STEPS = [
  'Idea',
  'Research',
  'Validate',
  'MVP',
  'Build',
  'Launch'
];

export default function BuilderJourneySection() {
  return (
    <section className="relative w-full bg-black py-24 flex flex-col items-center justify-center overflow-hidden border-t border-white/5 z-10">

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-20">
        <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, #FF5800 0%, transparent 60%)', filter: 'blur(100px)' }} />
      </div>

      <div className="relative z-10 max-w-6xl w-full px-6 flex flex-col items-center">

        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-16 mb-24">
          {/* Header Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 text-center lg:text-left"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-white mb-6 tracking-tight">
              Great builders start with the build.
            </h2>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-lg mx-auto lg:mx-0">
              They're great at turning prompts into products but building is only one part of the journey.
            </p>
          </motion.div>

          {/* Circular Design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center shrink-0"
          >
            <div className="absolute inset-4 rounded-full border border-white/5 border-dashed" />

            {/* Center 'Build' Circle */}
            <div className="relative z-20 w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br to-[#ff8c42] flex items-center justify-center shadow-[0_0_40px_rgba(255,88,0,0.4)]">
              <span className="text-xl md:text-2xl font-bold text-white tracking-wide">Build</span>
            </div>

            {/* Orbiting Tools */}
            {TOOLS.map((tool, i) => {
              const radius = 140; // Desktop radius
              // We use standard trigonometry to place items on a circle
              const radian = (tool.angle - 90) * (Math.PI / 180);
              const x = Math.cos(radian) * radius;
              const y = Math.sin(radian) * radius;

              return (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="absolute z-10 flex items-center justify-center"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  <div className="flex items-center justify-center p-2.5 hover:scale-110 transition-transform">
                    <img
                      src={tool.image}
                      alt={tool.name}
                      className={`${tool.name === 'Base44' ? 'h-6 md:h-8' : 'h-8 md:h-15'} w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Process Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full relative"
        >
          <div className="relative flex flex-col md:flex-row items-center justify-between w-full max-w-4xl mx-auto gap-4 md:gap-0">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-[5%] right-[5%] h-[2px] bg-white/10 -translate-y-1/2 z-0" />

            {PROCESS_STEPS.map((step, index) => (
              <div key={step} className="relative z-10 flex flex-row md:flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm transition-colors duration-300
                  ${step === 'Build'
                    ? 'border bg-[#FF5800]/20 text-[#FF5800] shadow-[0_0_20px_rgba(255,88,0,0.2)]'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="font-semibold text-sm">{index + 1}</span>
                </div>
                <span className={`text-sm font-medium ${step === 'Build' ? 'text-[#FF5800]' : 'text-white/80'}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
