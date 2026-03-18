import { useQueryClient } from "@tanstack/react-query";
import { 
  useAddCredit, 
  useDeleteCredit,
  getGetPersonsQueryKey,
  getGetPersonQueryKey,
  getGetCreditsQueryKey
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export function useCreditMutations(personId?: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addCreditMutation = useAddCredit({
    mutation: {
      onSuccess: () => {
        // Invalidate lists and specific person
        queryClient.invalidateQueries({ queryKey: getGetPersonsQueryKey() });
        if (personId) {
          queryClient.invalidateQueries({ queryKey: getGetPersonQueryKey(personId) });
          queryClient.invalidateQueries({ queryKey: getGetCreditsQueryKey(personId) });
        }
        toast({
          title: "Credit entry added",
          description: "The credit balance has been updated successfully.",
        });
      },
      onError: (error) => {
        toast({
          title: "Failed to add credit",
          description: error.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }
  });

  const deleteCreditMutation = useDeleteCredit({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetPersonsQueryKey() });
        if (personId) {
          queryClient.invalidateQueries({ queryKey: getGetPersonQueryKey(personId) });
          queryClient.invalidateQueries({ queryKey: getGetCreditsQueryKey(personId) });
        }
        toast({
          title: "Entry deleted",
          description: "The credit entry has been removed.",
        });
      },
      onError: (error) => {
        toast({
          title: "Failed to delete entry",
          description: error.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }
  });

  return {
    addCredit: addCreditMutation.mutate,
    isAdding: addCreditMutation.isPending,
    deleteCredit: deleteCreditMutation.mutate,
    isDeleting: deleteCreditMutation.isPending
  };
}
