import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { createScenario } from '@/lib/supabaseFunctions';
import type { CreateScenarioData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface ScenarioFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const ScenarioForm: React.FC<ScenarioFormProps> = ({ onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateScenarioData>({
    name: '',
    founders: [{ name: '', equity: 0 }],
    rounds: [],
    esop: undefined
  });

  const addFounder = () => {
    setFormData(prev => ({
      ...prev,
      founders: [...prev.founders, { name: '', equity: 0 }]
    }));
  };

  const removeFounder = (index: number) => {
    setFormData(prev => ({
      ...prev,
      founders: prev.founders.filter((_, i) => i !== index)
    }));
  };

  const updateFounder = (index: number, field: 'name' | 'equity', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      founders: prev.founders.map((founder, i) => 
        i === index ? { ...founder, [field]: value } : founder
      )
    }));
  };

  const addRound = () => {
    setFormData(prev => ({
      ...prev,
      rounds: [...prev.rounds, { round_name: '', investment: 0, valuation: 0 }]
    }));
  };

  const removeRound = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rounds: prev.rounds.filter((_, i) => i !== index)
    }));
  };

  const updateRound = (index: number, field: 'round_name' | 'investment' | 'valuation', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      rounds: prev.rounds.map((round, i) => 
        i === index ? { ...round, [field]: value } : round
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await createScenario(formData);
    
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Scenario created successfully"
      });
      onSuccess();
    }
    
    setLoading(false);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Scenario</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Scenario Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Founders</Label>
              <Button type="button" onClick={addFounder} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Founder
              </Button>
            </div>
            {formData.founders.map((founder, index) => (
              <div key={index} className="flex gap-4 mb-2">
                <Input
                  placeholder="Founder name"
                  value={founder.name}
                  onChange={(e) => updateFounder(index, 'name', e.target.value)}
                  required
                />
                <Input
                  type="number"
                  placeholder="Equity %"
                  value={founder.equity}
                  onChange={(e) => updateFounder(index, 'equity', parseFloat(e.target.value) || 0)}
                  required
                />
                {formData.founders.length > 1 && (
                  <Button type="button" onClick={() => removeFounder(index)} variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Funding Rounds</Label>
              <Button type="button" onClick={addRound} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Round
              </Button>
            </div>
            {formData.rounds.map((round, index) => (
              <div key={index} className="flex gap-4 mb-2">
                <Input
                  placeholder="Round name"
                  value={round.round_name}
                  onChange={(e) => updateRound(index, 'round_name', e.target.value)}
                  required
                />
                <Input
                  type="number"
                  placeholder="Investment amount"
                  value={round.investment}
                  onChange={(e) => updateRound(index, 'investment', parseFloat(e.target.value) || 0)}
                  required
                />
                <Input
                  type="number"
                  placeholder="Valuation"
                  value={round.valuation}
                  onChange={(e) => updateRound(index, 'valuation', parseFloat(e.target.value) || 0)}
                  required
                />
                <Button type="button" onClick={() => removeRound(index)} variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div>
            <Label>ESOP Pool (%)</Label>
            <Input
              type="number"
              placeholder="ESOP percentage"
              value={formData.esop?.percentage || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setFormData(prev => ({
                  ...prev,
                  esop: value ? { percentage: value } : undefined
                }));
              }}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Scenario'}
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