import { motion } from "motion/react";
import { btn } from "../lib/button";

type Props = {
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function RemoveInvitedModal({ onCancel, onConfirm, name }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="bg-white rounded-xl border border-gray-200 p-6 max-w-sm w-full mx-4 flex flex-col gap-4"
      >
        <p className="text-sm text-gray-700 leading-relaxed">
          Remove invited user <strong>{name}</strong>? They will lose access to this budget book.
        </p>
        <div className="flex gap-2 justify-between">
          <button onClick={onCancel} className={btn.secondary}>Cancel</button>
          <button onClick={onConfirm} className={btn.danger}>Yes, remove</button>
        </div>
      </motion.div>
    </motion.div>
  );
}