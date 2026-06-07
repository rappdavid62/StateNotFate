export interface AdaptiveProfile {
  id: string;
  createdAt: string;
  energyHistory: Array<{ mode: 'Collapse' | 'Low' | 'Medium' | 'High'; timestamp: string }>;
  anchorCompletions: Record<`level${0 | 1 | 2 | 3 | 4}`, number>;
  restartCount: number;
  totalPauses: number;
  restartFidelity: number;
  questionnaire: Record<string, string | null>;
  lastAnchorLevel: 0 | 1 | 2 | 3 | 4;
  safetyFlags: string[];
}

export interface SessionState {
  energyMode: 'Collapse' | 'Low' | 'Medium' | 'High' | null;
  currentAnchorLevel: 0 | 1 | 2 | 3 | 4;
  safetyFlag: boolean;
  paused: boolean;
}
