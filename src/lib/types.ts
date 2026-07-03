export type RunStatus = 'completed' | 'failed' | 'partial';

export type StepStatus = 'success' | 'failed' | 'skipped';

export type StepType = 'plan' | 'reasoning' | 'tool' | 'output' | 'error';

export interface AgentStep {
  id: string;
  name: string;
  type: StepType;
  status: StepStatus;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  tool?: string;
  toolInput?: Record<string, unknown>;
  toolOutput?: string | null;
  error?: string;
  message?: string;
}

export interface AgentRun {
  id: string;
  name: string;
  agent: string;
  model: string;
  startedAt: string;
  endedAt: string;
  status: RunStatus;
  tags?: string[];
  steps: AgentStep[];
}

export interface RunsData {
  runs: AgentRun[];
}
