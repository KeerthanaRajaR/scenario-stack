import { supabase } from "@/integrations/supabase/client";

// TypeScript interfaces for the database tables
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

export interface ScenarioWithDetails extends Scenario {
  founders: Founder[];
  rounds: Round[];
  esop: ESOP[];
}

export interface CreateScenarioData {
  name: string;
  founders: Omit<Founder, 'id' | 'scenario_id'>[];
  rounds: Omit<Round, 'id' | 'scenario_id'>[];
  esop: Omit<ESOP, 'id' | 'scenario_id'>[];
}

// Create a new scenario with associated data
export const createScenario = async (data: CreateScenarioData): Promise<{ data: ScenarioWithDetails | null; error: any }> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    // Create the scenario
    const { data: scenario, error: scenarioError } = await supabase
      .from('scenarios')
      .insert([{ 
        name: data.name, 
        user_id: user.id 
      }])
      .select()
      .single();

    if (scenarioError) {
      return { data: null, error: scenarioError };
    }

    // Insert founders
    const foundersToInsert = data.founders.map(founder => ({
      ...founder,
      scenario_id: scenario.id
    }));

    const { data: founders, error: foundersError } = await supabase
      .from('founders')
      .insert(foundersToInsert)
      .select();

    if (foundersError) {
      return { data: null, error: foundersError };
    }

    // Insert rounds
    const roundsToInsert = data.rounds.map(round => ({
      ...round,
      scenario_id: scenario.id
    }));

    const { data: rounds, error: roundsError } = await supabase
      .from('rounds')
      .insert(roundsToInsert)
      .select();

    if (roundsError) {
      return { data: null, error: roundsError };
    }

    // Insert ESOP
    const esopToInsert = data.esop.map(esop => ({
      ...esop,
      scenario_id: scenario.id
    }));

    const { data: esop, error: esopError } = await supabase
      .from('esop')
      .insert(esopToInsert)
      .select();

    if (esopError) {
      return { data: null, error: esopError };
    }

    return {
      data: {
        ...scenario,
        founders: founders || [],
        rounds: rounds || [],
        esop: esop || []
      },
      error: null
    };
  } catch (error) {
    return { data: null, error };
  }
};

// Get all scenarios for the current user
export const getScenariosForUser = async (): Promise<{ data: ScenarioWithDetails[] | null; error: any }> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    // Get scenarios with all related data
    const { data: scenarios, error: scenariosError } = await supabase
      .from('scenarios')
      .select(`
        *,
        founders (*),
        rounds (*),
        esop (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (scenariosError) {
      return { data: null, error: scenariosError };
    }

    return { data: scenarios || [], error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Update a scenario
export const updateScenario = async (id: string, data: Partial<Pick<Scenario, 'name'>>): Promise<{ data: Scenario | null; error: any }> => {
  try {
    const { data: scenario, error } = await supabase
      .from('scenarios')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    return { data: scenario, error };
  } catch (error) {
    return { data: null, error };
  }
};

// Delete a scenario (cascade delete will handle related data)
export const deleteScenario = async (id: string): Promise<{ error: any }> => {
  try {
    const { error } = await supabase
      .from('scenarios')
      .delete()
      .eq('id', id);

    return { error };
  } catch (error) {
    return { error };
  }
};

// Update founders for a scenario
export const updateFounders = async (scenarioId: string, founders: Omit<Founder, 'scenario_id'>[]): Promise<{ data: Founder[] | null; error: any }> => {
  try {
    // First delete existing founders
    await supabase
      .from('founders')
      .delete()
      .eq('scenario_id', scenarioId);

    // Then insert new founders
    const foundersToInsert = founders.map(founder => ({
      ...founder,
      scenario_id: scenarioId
    }));

    const { data, error } = await supabase
      .from('founders')
      .insert(foundersToInsert)
      .select();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

// Update rounds for a scenario
export const updateRounds = async (scenarioId: string, rounds: Omit<Round, 'scenario_id'>[]): Promise<{ data: Round[] | null; error: any }> => {
  try {
    // First delete existing rounds
    await supabase
      .from('rounds')
      .delete()
      .eq('scenario_id', scenarioId);

    // Then insert new rounds
    const roundsToInsert = rounds.map(round => ({
      ...round,
      scenario_id: scenarioId
    }));

    const { data, error } = await supabase
      .from('rounds')
      .insert(roundsToInsert)
      .select();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

// Update ESOP for a scenario
export const updateEsop = async (scenarioId: string, esop: Omit<ESOP, 'scenario_id'>[]): Promise<{ data: ESOP[] | null; error: any }> => {
  try {
    // First delete existing ESOP
    await supabase
      .from('esop')
      .delete()
      .eq('scenario_id', scenarioId);

    // Then insert new ESOP
    const esopToInsert = esop.map(e => ({
      ...e,
      scenario_id: scenarioId
    }));

    const { data, error } = await supabase
      .from('esop')
      .insert(esopToInsert)
      .select();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};