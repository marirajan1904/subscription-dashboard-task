import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";

type ToastProps = {
  type: "success" | "error";
  message: string;
  onClose: () => void;
};

export default function Toast({ type, message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Auto-hide after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-100" : "bg-red-100";
  const borderColor = type === "success" ? "border-green-400" : "border-red-400";
  const textColor = type === "success" ? "text-green-700" : "text-red-700";
  const Icon = type === "success" ? CheckCircleIcon : ExclamationCircleIcon;

  return (
    <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 flex items-center ${bgColor} border ${borderColor} ${textColor} px-6 py-3 rounded-lg shadow-lg animate-slideIn`}>
      <Icon className="h-6 w-6 mr-2" />
      <span className="font-medium">{message}</span>
    </div>
  );
}
