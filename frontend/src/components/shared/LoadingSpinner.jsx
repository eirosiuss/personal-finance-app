import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div
    className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      <motion.div
        className="w-16 h-16 border-4 border-t-4 border-t-gray-900 border-gray-400 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      ></motion.div>
    </div>
  );
};

export default LoadingSpinner;
