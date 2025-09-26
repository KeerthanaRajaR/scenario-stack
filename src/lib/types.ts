export interface Scenario {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Founder {
  id: string;
  scenario_id: string;
  name: string;
  equity: number;
}

export interface Round {
  id: string;
  scenario_id: string;
  round_name: string;
  investment: number;
  valuation: number;
}

export interface ESOP {
  id: string;
  scenario_id: string;
  percentage: number;
}

export interface CreateScenarioData {
  name: string;
  founders: Omit<Founder, 'id' | 'scenario_id'>[];
  rounds: Omit<Round, 'id' | 'scenario_id'>[];
  esop?: Omit<ESOP, 'id' | 'scenario_id'>;
}

export interface ScenarioWithDetails extends Scenario {
  founders: Founder[];
  rounds: Round[];
  esop: ESOP[];
}