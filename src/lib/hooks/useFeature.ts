import { useGetSubscriptionQuery } from "@/src/lib/api/subscriptionApi";
import type { Feature } from "@/src/lib/api/subscriptionApi";

export function useFeature(feature: Feature) {
  const { data, isLoading } = useGetSubscriptionQuery();

  const subscription = data?.data;

  const hasFeature =
    subscription?.features.includes(feature) ?? false;

  return {
    hasFeature,
    isLoading,
    subscription,
  };
}
