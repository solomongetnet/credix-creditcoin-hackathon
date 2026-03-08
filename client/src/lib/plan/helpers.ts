import { planFeatures } from "./plan-features";

export type PlanName = "FREE" | "PLUS";

// Define all possible feature keys here, must match your planFeatures keys exactly
export type FeatureKey =
  | "characters"
  | "messages"
  | "chats"
  | "themes"
  | "export"
  | "custom_personality"
  | "voice_calls";

/**
 * Find a feature by key in a specific plan's features list.
 * Returns the feature or undefined if not found.
 */
function findFeature(plan: PlanName, featureKey: FeatureKey) {
  return planFeatures[plan].find((feature) => feature.key === featureKey);
}

/**
 * Check if a feature is available for the given plan.
 */
export function canUseFeature(plan: PlanName, featureKey: FeatureKey): boolean {
  const feature = findFeature(plan, featureKey);
  if (!feature) return false;
  return feature.description !== false;
}

/**
 * Get the description string for a feature in a given plan.
 * Returns string or null if feature unavailable or not found.
 */
export function getFeatureDescription(
  plan: PlanName,
  featureKey: FeatureKey
): string | null {
  const feature = findFeature(plan, featureKey);
  if (!feature || feature.description === false) return null;
  if (typeof feature.description === "string") return feature.description;
  return null;
}

/**
 * Throws error if condition is false.
 */
export function assertCan(
  condition: boolean,
  message = "Feature not available on your current plan"
): asserts condition {
  if (!condition) throw new Error(message);
}

/**
 * Extracts numeric limit from feature description if possible.
 * Returns number or null.
 */
export function getNumericLimit(
  plan: PlanName,
  featureKey: FeatureKey
): number | null {
  const description = getFeatureDescription(plan, featureKey);
  if (!description) return null;
  const match = description.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}
