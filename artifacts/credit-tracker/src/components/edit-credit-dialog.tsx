import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDownRight, ArrowUpRight, Loader2 } from "lucide-react";
import { AddCreditRequestType, CreditEntry } from "@workspace/api-client-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreditMutations } from "@/hooks/use-credit-mutations";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  reason: z.string().min(1, "Reason is required"),
  type: z.enum([AddCreditRequestType.earned, AddCreditRequestType.used]),
});

type FormValues = z.infer<typeof formSchema>;

interface EditCreditDialogProps {
  entry: CreditEntry;
  personId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCreditDialog({ entry, personId, open, onOpenChange }: EditCreditDialogProps) {
  const { updateCredit, isUpdating } = useCreditMutations(personId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: entry.amount,
      reason: entry.reason,
      type: entry.type as "earned" | "used",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        amount: entry.amount,
        reason: entry.reason,
        type: entry.type as "earned" | "used",
      });
    }
  }, [open, entry]);

  const onSubmit = (data: FormValues) => {
    updateCredit(
      { creditId: entry.id, data },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const selectedType = form.watch("type");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl p-0 overflow-hidden border-border/50 shadow-2xl">
        <div className="px-6 pt-6 pb-4 bg-secondary/30">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Edit Credit Entry</DialogTitle>
            <DialogDescription className="text-base mt-1">
              Update the details of this credit entry.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => form.setValue("type", AddCreditRequestType.earned)}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200",
                selectedType === "earned"
                  ? "border-success bg-success/5 text-success shadow-sm"
                  : "border-transparent bg-secondary text-muted-foreground hover:bg-secondary/80"
              )}
            >
              <div className={cn("p-2 rounded-full mb-2", selectedType === "earned" ? "bg-success/20" : "bg-background")}>
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <span className="font-semibold">Earned</span>
            </button>
            <button
              type="button"
              onClick={() => form.setValue("type", AddCreditRequestType.used)}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200",
                selectedType === "used"
                  ? "border-rose-500 bg-rose-500/5 text-rose-600 shadow-sm"
                  : "border-transparent bg-secondary text-muted-foreground hover:bg-secondary/80"
              )}
            >
              <div className={cn("p-2 rounded-full mb-2", selectedType === "used" ? "bg-rose-500/20" : "bg-background")}>
                <ArrowDownRight className="w-5 h-5" />
              </div>
              <span className="font-semibold">Used</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-amount" className="text-foreground/80 font-medium">Amount</Label>
              <Input
                id="edit-amount"
                type="number"
                placeholder="0"
                className="text-lg py-6 rounded-xl border-border/80 focus-visible:ring-primary/20"
                {...form.register("amount")}
              />
              {form.formState.errors.amount && (
                <p className="text-sm text-destructive font-medium">{form.formState.errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-reason" className="text-foreground/80 font-medium">Reason</Label>
              <Input
                id="edit-reason"
                placeholder="e.g. Paid for dinner"
                className="py-6 rounded-xl border-border/80 focus-visible:ring-primary/20"
                {...form.register("reason")}
              />
              {form.formState.errors.reason && (
                <p className="text-sm text-destructive font-medium">{form.formState.errors.reason.message}</p>
              )}
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 py-6 rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={cn(
                "flex-1 py-6 text-lg font-semibold rounded-xl transition-all duration-300",
                selectedType === "earned"
                  ? "bg-success hover:bg-success/90 shadow-lg shadow-success/20"
                  : "bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/20"
              )}
              disabled={isUpdating}
            >
              {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
