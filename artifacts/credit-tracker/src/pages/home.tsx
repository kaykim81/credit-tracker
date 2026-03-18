import { Link } from "wouter";
import { useGetPersons } from "@workspace/api-client-react";
import { ArrowRight, Activity, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

import { Layout } from "@/components/layout";
import { formatScore, getInitials } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { AddCreditDialog } from "@/components/add-credit-dialog";

export default function Home() {
  const { data: persons, isLoading, error } = useGetPersons();

  return (
    <Layout>
      <div className="mb-10 text-center sm:text-left space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
          <Activity className="w-4 h-4" />
          <span>Real-time tracking</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          Credit <span className="text-gradient">Overview</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto sm:mx-0">
          Manage and track credit scores across your shared accounts. Record earnings and usage seamlessly.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-card rounded-3xl p-8 border border-border shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <Skeleton className="w-14 h-14 rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-16 w-48 mb-8" />
              <div className="flex gap-3">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-destructive/5 border border-destructive/20 p-8 rounded-3xl text-center">
          <p className="text-destructive font-semibold">Failed to load persons. Please try again.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {persons?.map((person, index) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="group relative bg-white rounded-3xl p-8 border border-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Decorative card background element */}
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-primary/5 to-indigo-400/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-border flex items-center justify-center text-foreground font-display font-bold text-xl shadow-inner">
                      {getInitials(person.name)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold text-foreground group-hover:text-primary transition-colors">
                        {person.name}
                      </h2>
                      <div className="flex items-center text-muted-foreground text-sm gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>Account Member</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8 flex-1">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Total Balance</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-display font-extrabold text-foreground tracking-tighter">
                      {formatScore(person.totalScore)}
                    </span>
                    <TrendingUp className="w-6 h-6 text-success opacity-80" />
                  </div>
                </div>

                <div className="flex gap-3 mt-auto">
                  <AddCreditDialog 
                    personId={person.id} 
                    personName={person.name}
                    trigger={
                      <button className="flex-1 bg-primary text-primary-foreground font-semibold py-3.5 px-4 rounded-xl shadow-md shadow-primary/20 hover:shadow-lg hover:bg-primary/90 transition-all active:scale-[0.98]">
                        Quick Add
                      </button>
                    }
                  />
                  <Link href={`/person/${person.id}`}>
                    <button className="w-14 h-14 flex items-center justify-center bg-secondary hover:bg-secondary/80 text-foreground rounded-xl transition-all group/btn border border-transparent hover:border-border">
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Layout>
  );
}
