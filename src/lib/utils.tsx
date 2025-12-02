import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind merge support
 * Handles conditional classes and prevents Tailwind conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "USD",
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(
  date: string | Date,
  formatStr: string = "MMM d, yyyy",
): string {
  // return format(new Date(date), formatStr);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.substring(0, length)}...`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export function getStatusBadge(status: string): JSX.Element {
  const statusClasses = {
    draft: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        statusClasses[status.toLowerCase() as keyof typeof statusClasses] ||
        "bg-gray-100 text-gray-800"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  );
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");

  // Check if the phone number is valid
  const match = cleaned.match(/^(\d{1,3})(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    // Format as +X (XXX) XXX-XXXX
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
  }

  // Return original if format doesn't match
  return phoneNumber;
}

export function generateId(prefix: string = "id"): string {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function getTourStatusColor(status: string): string {
  const statusColors = {
    draft: "bg-gray-100 text-gray-800",
    published: "bg-green-100 text-green-800",
    upcoming: "bg-blue-100 text-blue-800",
    nongoing: "bg-yellow-100 text-yellow-800",
    completed: "bg-purple-100 text-purple-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    statusColors[status.toLowerCase() as keyof typeof statusColors] ||
    "bg-gray-100 text-gray-800"
  );
}
