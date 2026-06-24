import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function Button({
  borderRadius = "0.5rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}) {
  return (
    <Component
      className={cn(
        "bg-transparent relative text-xl p-[1px] overflow-hidden inline-flex",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <motion.div
          animate={{
            rotate: ["0deg", "360deg"],
          }}
          transition={{
            duration: duration || 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className={cn(
            "h-[200%] w-[200%] absolute -top-[50%] -left-[50%] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] opacity-80",
            borderClassName
          )}
        />
      </div>
      <div
        className={cn(
          "relative bg-slate-900/[0.8] border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm font-medium px-5 py-2.5 antialiased",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}
