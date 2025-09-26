import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ScenarioList } from '@/components/ScenarioList';
import { ScenarioForm } from '@/components/ScenarioForm';
import { 
  getScenariosForUser, 
  createScenario, 
  deleteScenario,
  ScenarioWithDetails,
  CreateScenarioData
} from '@/lib/supabaseFunctions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [scenarios, setScenarios] = useState<ScenarioWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        await loadScenarios();
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadScenarios();
      } else {
        setScenarios([]);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadScenarios = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getScenariosForUser();
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load scenarios",
          variant: "destructive"
        });
      } else {
        setScenarios(data || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load scenarios",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateScenario = async (data: CreateScenarioData) => {
    setIsCreating(true);
    try {
      const { data: newScenario, error } = await createScenario(data);
      if (error) {
        toast({
          title: "Error",
          description: "Failed to create scenario",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Scenario created successfully"
        });
        setShowForm(false);
        await loadScenarios();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create scenario",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteScenario = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scenario?')) {
      return;
    }

    try {
      const { error } = await deleteScenario(id);
      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete scenario",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Scenario deleted successfully"
        });
        await loadScenarios();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete scenario",
        variant: "destructive"
      });
    }
  };

  const handleEditScenario = (scenario: ScenarioWithDetails) => {
    // For now, just show a message. Edit functionality can be implemented later
    toast({
      title: "Edit Scenario",
      description: "Edit functionality coming soon"
    });
  };

  const signInWithEmail = async () => {
    // Redirect to auth page or implement sign-in logic
    toast({
      title: "Authentication",
      description: "Please implement authentication first"
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Founder Equity Tracker</h1>
          <p className="text-xl text-muted-foreground mb-6">Track equity distribution and funding rounds</p>
          <Button onClick={signInWithEmail}>
            Sign In to Get Started
          </Button>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="container mx-auto py-8">
        <ScenarioForm
          onSubmit={handleCreateScenario}
          onCancel={() => setShowForm(false)}
          isLoading={isCreating}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Equity Scenarios</h1>
          <p className="text-muted-foreground">
            Manage your founder equity and funding scenarios
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Scenario
          </Button>
          <Button variant="outline" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </div>

      <ScenarioList
        scenarios={scenarios}
        onEdit={handleEditScenario}
        onDelete={handleDeleteScenario}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Index;
