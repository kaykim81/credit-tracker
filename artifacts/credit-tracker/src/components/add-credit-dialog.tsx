import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDownRight, ArrowUpRight, Loader2, Plus } from "lucide-react";
import { AddCreditRequestType } from "@workspace/api-client-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreditMutations } from "@/hooks/use-credit-mutations";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  reason: z.string().min(2, "Reason is required"),
  type: z.enum([AddCreditRequestType.earned, AddCreditRequestType.used]),
});

type FormValues = z.infer<typeof formSchema>;

interface AddCreditDialogProps {
  personId: number;
  personName: string;
  trigger?: React.ReactNode;
}

export function AddCreditDialog({ personId, personName, trigger }: AddCreditDialogProps) {
  const [open, setOpen] = useState(false);
  const { addCredit, isAdding } = useCreditMutations(personId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 1,
      reason: "",
      type: AddCreditRequestType.earned,
    },
  });

  const onSubmit = (data: FormValues) => {
    addCredit(
      { personId, data },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      }
    );
  };

  const selectedType = form.watch("type");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl p-0 overflow-hidden border-border/50 shadow-2xl">
        <div className="px-6 pt-6 pb-4 bg-secondary/30">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">New Credit Entry</DialogTitle>
            <DialogDescription className="text-base mt-1">
              Add or deduct credits for <span className="font-semibold text-foreground">{personName}</span>.
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

          {selectedType === "earned" && (
            <div className="space-y-2">
              <Label className="text-foreground/80 font-medium">Quick Select</Label>
              <div className="flex flex-wrap gap-2">
                {["Wake up early", "Bible", "Korean", "Khan", "Basketball", "Meal prep", "Chores", "Sleep help", "Sleep alone"].map((preset) => {
                  const isSelected = form.watch("reason") === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => form.setValue("reason", isSelected ? "" : preset, { shouldValidate: true })}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150",
                        isSelected
                          ? "bg-success text-white border-success shadow-sm"
                          : "bg-secondary text-muted-foreground border-transparent hover:border-success/40 hover:text-success hover:bg-success/5"
                      )}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedType === "used" && (
            <div className="space-y-2">
              <Label className="text-foreground/80 font-medium">Quick Select</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "30m", amount: 2 },
                  { label: "60m", amount: 4 },
                  { label: "90m", amount: 6 },
                  { label: "120m", amount: 10 },
                  { label: "25c", amount: 1 },
                  { label: "50c", amount: 2 },
                  { label: "75c", amount: 3 },
                  { label: "100c", amount: 4 },
                ].map((preset) => {
                  const isSelected = form.watch("reason") === preset.label;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          form.setValue("reason", "", { shouldValidate: true });
                          form.setValue("amount", 1, { shouldValidate: true });
                        } else {
                          form.setValue("reason", preset.label, { shouldValidate: true });
                          form.setValue("amount", preset.amount, { shouldValidate: true });
                        }
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150",
                        isSelected
                          ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                          : "bg-secondary text-muted-foreground border-transparent hover:border-rose-400/40 hover:text-rose-600 hover:bg-rose-500/5"
                      )}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-foreground/80 font-medium">Amount</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  className="text-lg py-6 rounded-xl border-border/80 focus-visible:ring-primary/20"
                  {...form.register("amount")}
                />
              </div>
              {form.formState.errors.amount && (
                <p className="text-sm text-destructive font-medium">{form.formState.errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason" className="text-foreground/80 font-medium">Reason</Label>
              <Input
                id="reason"
                placeholder="e.g. Paid for dinner"
                className="py-6 rounded-xl border-border/80 focus-visible:ring-primary/20"
                {...form.register("reason")}
              />
              {form.formState.errors.reason && (
                <p className="text-sm text-destructive font-medium">{form.formState.errors.reason.message}</p>
              )}
            </div>
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              className={cn(
                "w-full py-6 text-lg font-semibold rounded-xl transition-all duration-300",
                selectedType === "earned" 
                  ? "bg-success hover:bg-success/90 shadow-lg shadow-success/20 hover:shadow-success/30" 
                  : "bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30"
              )}
              disabled={isAdding}
            >
              {isAdding ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                `Record ${selectedType === "earned" ? "Earning" : "Usage"}`
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
