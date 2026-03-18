import { useRoute } from "wouter";
import { format } from "date-fns";
import { ArrowUpRight, CalendarDays, LineChart } from "lucide-react";
import { useGetPerson, useGetCredits } from "@workspace/api-client-react";

import { Layout } from "@/components/layout";
import { formatScore, getInitials } from "@/lib/utils";
import { TransactionList } from "@/components/transaction-list";
import { AddCreditDialog } from "@/components/add-credit-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function PersonDetail() {
  const [, params] = useRoute("/person/:id");
  const personId = params?.id ? parseInt(params.id, 10) : 0;

  const { data: person, isLoading: isLoadingPerson } = useGetPerson(personId, {
    query: { enabled: !!personId }
  });
  
  const { data: credits, isLoading: isLoadingCredits } = useGetCredits(personId, {
    query: { enabled: !!personId }
  });

  if (isLoadingPerson) {
    return (
      <Layout showBack>
        <div className="space-y-8 animate-pulse">
          <div className="h-48 bg-card rounded-3xl border border-border" />
          <div className="space-y-4">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!person) {
    return (
      <Layout showBack>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold text-foreground">Person not found</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showBack title={person.name}>
      <div className="space-y-8 pb-12">
        {/* Header Hero Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 to-primary rounded-3xl p-8 sm:p-10 shadow-xl text-white">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <LineChart className="w-64 h-64" />
          </div>
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-display font-bold border border-white/30">
                  {getInitials(person.name)}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold opacity-90">Total Score</h1>
                  <div className="flex items-center text-sm opacity-70 gap-1.5 mt-0.5">
                    <CalendarDays className="w-4 h-4" />
                    <span>Member since {format(new Date(person.createdAt), "MMM yyyy")}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-6xl sm:text-7xl font-display font-extrabold tracking-tighter">
                  {formatScore(person.totalScore)}
                </span>
                <span className="text-2xl font-medium opacity-70">pts</span>
              </div>
            </div>

            <div className="shrink-0">
              <AddCreditDialog 
                personId={person.id} 
                personName={person.name} 
                trigger={
                  <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-primary px-6 py-4 rounded-xl font-bold text-lg hover:bg-white/90 shadow-[0_4px_14px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition-all active:scale-95">
                    <ArrowUpRight className="w-5 h-5" />
                    New Transaction
                  </button>
                }
              />
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div>
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-2xl font-display font-bold text-foreground">History</h2>
            <div className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
              {credits?.length || 0} Entries
            </div>
          </div>

          {isLoadingCredits ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <TransactionList transactions={credits || []} personId={person.id} />
          )}
        </div>
      </div>
    </Layout>
  );
}
