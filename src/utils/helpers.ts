import type { Node } from "../stores/dyanmicTree";
import { useI18n } from "vue-i18n";
import API_ENDPOINTS from "./endpoints";

/**
 * Filters by the exact parent ID to get the correct children
 * @param data
 * @param parentId
 * @returns the filtered children that match the parentID
 */
export const filterByExactParentID = (
  data: Node[],
  parentId: string | null
) => {
  return data.filter((item: any) => item.parentId === parentId);
};

/**
 * Gets the current application language
 * @returns The current language code from localStorage or i18n locale
 */
export const getCurrentLanguage = () => {
  if (localStorage.getItem("language")) {
    return localStorage.getItem("language");
  }
  const { locale } = useI18n();
  return locale;
};

/**
 * Exports data to a CSV file and triggers download
 * Generates a CSV file from provided data and automatically downloads it
 *
 * @param {Array<any>} sortedAndFilteredRows - The data rows to export
 * @param {string} title - Base name for the exported file (spaces will be replaced with underscores)
 * @param {Array<any>} headers - Column headers for the CSV
 *
 * @returns {void} Triggers file download but returns nothing
 */
export const exportToCSV = (
  sortedAndFilteredRows: Array<any>,
  title: String,
  headers: Array<any>
) => {
  // Prepare headers
  const csvHeaders = headers
    .map((header) => `"${header.replace(/"/g, '""')}"`)
    .join(",");

  // Prepare rows
  const csvRows = sortedAndFilteredRows
    .map((row) =>
      row
        .map((cell: any) => {
          // Handle null/undefined
          if (cell == null) return '""';
          // Escape quotes and wrap in quotes
          return `"${String(cell).replace(/"/g, '""')}"`;
        })
        .join(",")
    )
    .join("\n");

  // Combine headers and rows
  const csvContent = `${csvHeaders}\n${csvRows}`;

  // Create download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${title.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Creates a debounced function that delays execution
 * @param func - The function to debounce
 * @param wait - Number of milliseconds to delay
 * @returns A debounced version of the passed function
 */
export const debounce = (func: Function, wait: number) => {
  let timeout: number;

  return function (this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

/**
 *
 * @returns Random data point for line chart
 */
export const generateRandomY = () => {
  const base = 500; // Center point
  const fluctuation =
    Math.random() > 0.5
      ? Math.floor(Math.random() * 1500) // Big positive spike (50% chance)
      : -Math.floor(Math.random() * 700); // Negative dip (50% chance)
  return Math.max(300, Math.min(2000, base + fluctuation)); // Keep within bounds
};

/**
 * Get the API endpoint for root nodes based on the current page number.
 * This function uses round-robin selection to alternate between available endpoints.
 *
 * @param {number} page - The page number used for round-robin selection.
 * @returns {string} - The selected API endpoint or undefined if none available.
 */
export const getEndpointForRootNodes = (page: number) => {
  const endpoints = [API_ENDPOINTS.DEPARTMENTS2, API_ENDPOINTS.DEPARTMENTS3];

  // Round-robin selection
  return endpoints[(page - 1) % endpoints.length];
};
