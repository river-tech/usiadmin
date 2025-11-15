'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrencyVND } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { DepositResponse, DepositStatus } from "@/lib/types";
import { useState } from "react";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { createNotificationThunk } from "@/feature/notificationSlide";
import { useAppDispatch } from "@/store/hooks";
import { activateDepositThunk, rejectDepositThunk } from "@/feature/depositSlide";
export function DepositTable({ list, isLoading }: { list: DepositResponse[], isLoading: boolean }) {
  const dispatch = useAppDispatch();
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState<DepositResponse | null>(null);
  const [action, setAction] = useState<"activate" | "reject" | null>(null);
  const handleConfirm = async () => {
    if (action === "activate") {
      await dispatch(activateDepositThunk(selectedDeposit?.id || ""));
      await dispatch(createNotificationThunk({
        user_id: selectedDeposit?.user_id || "",
        title: "Deposit Activated",
        message: "Your deposit has been activated successfully",
        type: "SUCCESS",
      }));
    } else if (action === "reject") {
      await dispatch(rejectDepositThunk(selectedDeposit?.id || ""));
      await dispatch(createNotificationThunk({
        user_id: selectedDeposit?.user_id || "",
        title: "Deposit Rejected",
        message: "Your deposit has been rejected",
        type: "ERROR",
      }));
    }
  };
  return (
    <div className="rounded-lg border mt-4 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Email</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Bank Name</TableHead>
            <TableHead>Bank Account</TableHead>
            <TableHead>Transfer Code</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell colSpan={7}><Skeleton className="w-full h-6" /></TableCell>
              </TableRow>
            ))
          ) : list && list.length ? (
            list.map((depo, idx) => (
              <TableRow key={depo.transfer_code || idx}>
                <TableCell className="font-medium">{depo.user_email}</TableCell>
                <TableCell>{formatCurrencyVND(depo.amount)}</TableCell>
                <TableCell>
                  <span className={
                    depo.status === DepositStatus.PENDING
                      ? "text-yellow-600 font-semibold"
                      : depo.status === DepositStatus.SUCCESS
                        ? "text-green-600 font-semibold"
                        : depo.status === DepositStatus.FAILED
                          ? "text-red-600 font-semibold"
                          : "text-gray-600 font-semibold"
                  }>
                    {depo.status}
                  </span>
                </TableCell>
                <TableCell>{depo.bank_name}</TableCell>
                <TableCell className="font-mono text-xs">{depo.bank_account}</TableCell>
                <TableCell className="font-mono text-xs">{depo.transfer_code}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{new Date(depo.created_at).toLocaleString()}</TableCell>
                <TableCell>
                {depo.status === DepositStatus.PENDING ? (
                  <div className="flex gap-2">
                    <button
                      className="px-2 py-1 bg-green-100 text-green-700 rounded flex items-center gap-1 hover:bg-green-200 transition"
                      title="Kích hoạt"
                      // onClick={} // Bạn có thể bổ sung handler khi kết nối logic
                      onClick={() => {
                        setSelectedDeposit(depo);
                        setIsShowConfirmModal(true);
                        setAction("activate");
                      }}
                    >
                      <CheckCircleIcon size={18} />
                      Active
                    </button>
                    <button
                      className="px-2 py-1 bg-red-100 text-red-700 rounded flex items-center gap-1 hover:bg-red-200 transition"
                      title="Huỷ"
                      // onClick={} // Bạn có thể bổ sung handler khi kết nối logic
                      onClick={() => {
                        setSelectedDeposit(depo);
                        setIsShowConfirmModal(true);
                        setAction("reject");
                      }}
                    >
                      <XCircleIcon size={18} />
                      Unactive
                    </button>
                  </div>
                ) : null}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">No deposits found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {
        isShowConfirmModal && selectedDeposit && (
          <ConfirmDialog
            open={isShowConfirmModal}
            onOpenChange={setIsShowConfirmModal}
            variant={"destructive"}
            title={action === "activate" ? "Confirm Activate Deposit" : "Confirm Reject Deposit"}
            description={action === "activate" ? "Are you sure you want to activate this deposit?" : "Are you sure you want to reject this deposit?"}
            onConfirm={() => {
            handleConfirm();
            }}
          />
        )
      }
    </div>
  );
}
