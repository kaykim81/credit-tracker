import { useState } from "react";
import { format } from "date-fns";
import { ArrowDownRight, ArrowUpRight, Trash2, Calendar, FileText, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditEntry } from "@workspace/api-client-react";
import { formatScore, cn } from "@/lib/utils";
import { useCreditMutations } from "@/hooks/use-credit-mutations";
import { Button } from "@/components/ui/button";
import { EditCreditDialog } from "@/components/edit-credit-dialog";

interface TransactionListProps {
  transactions: CreditEntry[];
  personId: number;
}

export function TransactionList({ transactions, personId }: TransactionListProps) {
  const { deleteCredit, isDeleting } = useCreditMutations(personId);
  const [editingEntry, setEditingEntry] = useState<CreditEntry | null>(null);

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-dashed border-border text-center">
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4 text-muted-foreground">
          <FileText className="w-8 h-8 opacity-50" />
        </div>
        <h3 className="text-lg font-display font-semibold text-foreground">No history yet</h3>
        <p className="text-muted-foreground mt-1 max-w-sm">
          Credit entries will appear here once you start adding earned or used credits.
        </p>
      </div>
    );
  }

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <>
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {sortedTransactions.map((tx, index) => {
            const isEarned = tx.type === "earned";
            
            return (
              <motion.div
                key={tx.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative bg-white p-5 rounded-2xl border border-border/60 shadow-sm hover:shadow-md hover:border-border transition-all duration-300 flex items-center justify-between overflow-hidden"
              >
                {/* Subtle status bar on the left */}
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1.5",
                  isEarned ? "bg-success" : "bg-rose-500"
                )} />

                <div className="flex items-center gap-4 pl-2">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                    isEarned ? "bg-success/10 text-success" : "bg-rose-500/10 text-rose-600"
                  )}>
                    {isEarned ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground text-lg">{tx.reason}</h4>
                    <div className="flex items-center text-sm text-muted-foreground mt-0.5 gap-1.5">
                      <Calendar className="w-3.5 h-3.5 opacity-70" />
                      <span>{format(new Date(tx.createdAt), "MMM d, yyyy • h:mm a")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className={cn(
                    "font-display font-bold text-xl mr-2",
                    isEarned ? "text-success" : "text-foreground"
                  )}>
                    {isEarned ? "+" : "-"}{formatScore(tx.amount)}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                    onClick={() => setEditingEntry(tx)}
                  >
                    <Pencil className="w-4 h-4" />
                    <span className="sr-only">Edit</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                    onClick={() => deleteCredit({ creditId: tx.id })}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {editingEntry && (
        <EditCreditDialog
          entry={editingEntry}
          personId={personId}
          open={!!editingEntry}
          onOpenChange={(open) => { if (!open) setEditingEntry(null); }}
        />
      )}
    </>
  );
}
