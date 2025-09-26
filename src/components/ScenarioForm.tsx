import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { CreateScenarioData } from '@/lib/supabaseFunctions';
import { useToast } from '@/hooks/use-toast';

interface ScenarioFormProps {
  onSubmit: (data: CreateScenarioData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ScenarioForm: React.FC<ScenarioFormProps> = ({ onSubmit, onCancel, isLoading = false }) => {
  const { toast } = useToast();
  const [scenarioName, setScenarioName] = useState('');
  const [founders, setFounders] = useState([{ name: '', equity: 0 }]);
  const [rounds, setRounds] = useState([{ round_name: '', investment: 0, valuation: 0 }]);
  const [esop, setEsop] = useState([{ percentage: 0 }]);

  const addFounder = () => {
    setFounders([...founders, { name: '', equity: 0 }]);
  };

  const removeFounder = (index: number) => {
    if (founders.length > 1) {
      setFounders(founders.filter((_, i) => i !== index));
    }
  };

  const updateFounder = (index: number, field: 'name' | 'equity', value: string | number) => {
    const updated = [...founders];
    updated[index] = { ...updated[index], [field]: value };
    setFounders(updated);
  };

  const addRound = () => {
    setRounds([...rounds, { round_name: '', investment: 0, valuation: 0 }]);
  };

  const removeRound = (index: number) => {
    if (rounds.length > 1) {
      setRounds(rounds.filter((_, i) => i !== index));
    }
  };

  const updateRound = (index: number, field: 'round_name' | 'investment' | 'valuation', value: string | number) => {
    const updated = [...rounds];
    updated[index] = { ...updated[index], [field]: value };
    setRounds(updated);
  };

  const updateEsop = (index: number, percentage: number) => {
    const updated = [...esop];
    updated[index] = { percentage };
    setEsop(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!scenarioName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a scenario name",
        variant: "destructive"
      });
      return;
    }

    if (founders.some(f => !f.name.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all founder names",
        variant: "destructive"
      });
      return;
    }

    if (rounds.some(r => !r.round_name.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all round names",
        variant: "destructive"
      });
      return;
    }

    const data: CreateScenarioData = {
      name: scenarioName.trim(),
      founders: founders.filter(f => f.name.trim()),
      rounds: rounds.filter(r => r.round_name.trim()),
      esop: esop.filter(e => e.percentage > 0)
    };

    await onSubmit(data);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Scenario</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="scenarioName">Scenario Name</Label>
            <Input
              id="scenarioName"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="Enter scenario name"
              required
            />
          </div>

          {/* Founders Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Founders</h3>
              <Button type="button" onClick={addFounder} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Founder
              </Button>
            </div>
            <div className="space-y-4">
              {founders.map((founder, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Founder name"
                      value={founder.name}
                      onChange={(e) => updateFounder(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      placeholder="Equity %"
                      min="0"
                      max="100"
                      step="0.1"
                      value={founder.equity}
                      onChange={(e) => updateFounder(index, 'equity', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  {founders.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFounder(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Rounds Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Funding Rounds</h3>
              <Button type="button" onClick={addRound} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Round
              </Button>
            </div>
            <div className="space-y-4">
              {rounds.map((round, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Round name (e.g., Seed, Series A)"
                      value={round.round_name}
                      onChange={(e) => updateRound(index, 'round_name', e.target.value)}
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      placeholder="Investment"
                      min="0"
                      step="1000"
                      value={round.investment}
                      onChange={(e) => updateRound(index, 'investment', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      placeholder="Valuation"
                      min="0"
                      step="1000"
                      value={round.valuation}
                      onChange={(e) => updateRound(index, 'valuation', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  {rounds.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRound(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ESOP Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">ESOP Pool</h3>
            <div className="space-y-4">
              {esop.map((e, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-32">
                    <Input
                      type="number"
                      placeholder="ESOP %"
                      min="0"
                      max="100"
                      step="0.1"
                      value={e.percentage}
                      onChange={(ev) => updateEsop(index, parseFloat(ev.target.value) || 0)}
                    />
                  </div>
                  <span className="text-muted-foreground">% allocated for employee stock options</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Scenario'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};