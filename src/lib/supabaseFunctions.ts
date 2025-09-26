import { supabase } from "@/integrations/supabase/client";
import type { Scenario, Founder, Round, ESOP, CreateScenarioData, ScenarioWithDetails } from "./types";

export type { Scenario, Founder, Round, ESOP, CreateScenarioData, ScenarioWithDetails };

export async function createScenario(data: CreateScenarioData): Promise<{ data: Scenario | null; error: string | null }> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: "User not authenticated" };
    }

    // Create scenario
    const { data: scenario, error: scenarioError } = await supabase
      .from('scenarios')
      .insert({
        user_id: user.id,
        name: data.name
      })
      .select()
      .single();

    if (scenarioError) {
      return { data: null, error: scenarioError.message };
    }

    // Create founders
    if (data.founders.length > 0) {
      const { error: foundersError } = await supabase
        .from('founders')
        .insert(data.founders.map(founder => ({
          scenario_id: scenario.id,
          name: founder.name,
          equity: founder.equity
        })));

      if (foundersError) {
        return { data: null, error: foundersError.message };
      }
    }

    // Create rounds
    if (data.rounds.length > 0) {
      const { error: roundsError } = await supabase
        .from('rounds')
        .insert(data.rounds.map(round => ({
          scenario_id: scenario.id,
          round_name: round.round_name,
          investment: round.investment,
          valuation: round.valuation
        })));

      if (roundsError) {
        return { data: null, error: roundsError.message };
      }
    }

    // Create ESOP if provided
    if (data.esop) {
      const { error: esopError } = await supabase
        .from('esop')
        .insert({
          scenario_id: scenario.id,
          percentage: data.esop.percentage
        });

      if (esopError) {
        return { data: null, error: esopError.message };
      }
    }

    return { data: scenario, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function getScenariosForUser(): Promise<{ data: ScenarioWithDetails[] | null; error: string | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: "User not authenticated" };
    }

    // Get scenarios with related data
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
      return { data: null, error: scenariosError.message };
    }

    return { data: scenarios as ScenarioWithDetails[], error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function updateScenario(id: string, updates: Partial<Scenario>): Promise<{ data: Scenario | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('scenarios')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function deleteScenario(id: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('scenarios')
      .delete()
      .eq('id', id);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}