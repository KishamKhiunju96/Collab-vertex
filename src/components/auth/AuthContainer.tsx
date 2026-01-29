"use client";

import { slideVariants } from "@/animations/authAnimations";
import { motion } from "framer-motion";


export default function AuthContainer({
        children,
}: {
        children: React.ReactNode;
}) {
        return (
                <div>
                        <motion.div
                                variants={slideVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className=""
                        >
                                {children}
                        </motion.div>
                </div>
        );
}