"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";
import { fetchPurchaseDetail } from "@/feature/purchaseSlide";

const statusColorMap: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Success: "bg-green-100 text-green-800 border-green-300",
  Failed: "bg-red-100 text-red-800 border-red-300",
  // Có thể thêm tuỳ trạng thái mới
};

function formatStatus(status: string) {
  let text = status;
  if (status.toLowerCase() === "pending") text = "Pending";
  else if (status.toLowerCase() === "success") text = "Success";
  else if (status.toLowerCase() === "failed") text = "Failed";
  else text = status;
  return text;
}

function formatVnd(amount: number | undefined) {
  if (typeof amount !== "number") return "";
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function DetailRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className={`flex justify-between items-center px-4 py-3 rounded ${highlight ? "bg-gray-50" : ""}`}>
      <span className="text-gray-600 font-medium">{label}</span>
      <span className={`text-right ${highlight ? "font-bold text-blue-800" : "text-gray-900"}`}>{value}</span>
    </div>
  );
}

export default function PurchaseDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const dispatch = useAppDispatch();
  const { detail, isLoading } = useAppSelector((state: RootState) => state.purchases);
  useEffect(() => {
    const fetchDetail = async () => {
      await dispatch(fetchPurchaseDetail(id as string));
    };
    fetchDetail();
  }, [dispatch, id]);
  useEffect(() => {
    console.log(detail);
  }, [detail]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center h-64 justify-center">
        <span className="animate-spin rounded-full border-b-2 border-blue-400 h-8 w-8 mb-3"></span>
        <span className="text-lg font-medium text-gray-700">Loading data...</span>
      </div>
    );
  }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <span className="text-lg text-red-600 font-semibold">{error}</span>
//       </div>
//     );
//   }

  if (!detail) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-lg text-gray-600">No transaction information found.</span>
      </div>
    );
  }

  const statusClass =
    statusColorMap[detail?.status ?? ""] ??
    "bg-green-100 text-green-700 border-green-300";

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white shadow-lg rounded-xl md:p-10 p-6 border border-gray-100 transition-all">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <rect x="3" y="7" width="18" height="13" rx="2" fill="#fff" />
            <path
              stroke="currentColor"
              strokeWidth="1.7"
              d="M3 7a2 2 0 012-2h14a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2zm0 0h18"
            />
            <path
              stroke="currentColor"
              strokeWidth="1.7"
              d="M9 12h6"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold mb-1 text-gray-900 text-center">
          Transaction details
        </h1>
        <p className="text-sm text-gray-500 text-center">
          Transaction ID: <span className="font-semibold text-blue-600">{id}</span>
        </p>
      </div>
      <div className="divide-y divide-gray-100 mb-4 bg-gray-50/60 rounded-lg overflow-hidden">
        <DetailRow label="Customer name" value={detail?.user?.name} highlight />
        <DetailRow label="Email" value={detail?.user?.email} />
        <DetailRow label="Service package" value={detail?.workflow?.title} highlight />
        <DetailRow
          label="Package price"
          value={
            <>
              {formatVnd(detail?.workflow?.price)}
            </>
          }
        />
        <DetailRow label="Method" value={"Wallet"} highlight />
        
        <DetailRow
          label="Status"
          value={
            <span
              className={`px-3 py-1 border rounded-full text-xs uppercase font-semibold tracking-wide ${statusClass}`}
            >
              {formatStatus(detail?.status ?? "")}
            </span>
          }
          highlight
        />
        <DetailRow
          label="Paid amount"
          value={
            <span className="font-semibold text-green-700">
              {formatVnd(detail?.amount)}
            </span>
          }
        />
        <DetailRow
          label="Payment date"
          value={
            detail?.paid_at ? (
              <span className="text-blue-700 font-medium">
                {new Date(detail.paid_at).toLocaleString("vi-VN", {
                  hour12: false,
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            ) : (
              "—"
            )
          }
          highlight
        />
      </div>
      <div className="mt-8 flex items-center justify-center">
        <button
          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow transition"
          onClick={() => window.history.back()}
        >
          Back
        </button>
      </div>
    </div>
  );
}
