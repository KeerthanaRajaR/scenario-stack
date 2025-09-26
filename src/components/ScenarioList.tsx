import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Users, TrendingUp, Percent } from 'lucide-react';
import { ScenarioWithDetails } from '@/lib/supabaseFunctions';

interface ScenarioListProps {
  scenarios: ScenarioWithDetails[];
  onEdit: (scenario: ScenarioWithDetails) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const ScenarioList: React.FC<ScenarioListProps> = ({ 
  scenarios, 
  onEdit, 
  onDelete, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (scenarios.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No scenarios yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first equity scenario to start tracking founder equity and funding rounds.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {scenarios.map((scenario) => (
        <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg truncate">{scenario.name}</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(scenario)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(scenario.id)}
                  className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Created {new Date(scenario.created_at).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Founders */}
            {scenario.founders.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Founders</span>
                  <Badge variant="secondary">{scenario.founders.length}</Badge>
                </div>
                <div className="space-y-1">
                  {scenario.founders.slice(0, 3).map((founder) => (
                    <div key={founder.id} className="flex justify-between text-sm">
                      <span className="truncate">{founder.name}</span>
                      <span className="text-muted-foreground">{founder.equity}%</span>
                    </div>
                  ))}
                  {scenario.founders.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{scenario.founders.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Funding Rounds */}
            {scenario.rounds.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Funding Rounds</span>
                  <Badge variant="secondary">{scenario.rounds.length}</Badge>
                </div>
                <div className="space-y-1">
                  {scenario.rounds.slice(0, 2).map((round) => (
                    <div key={round.id} className="text-sm">
                      <div className="flex justify-between">
                        <span className="truncate">{round.round_name}</span>
                        <span className="text-muted-foreground">
                          ${round.investment.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {scenario.rounds.length > 2 && (
                    <p className="text-xs text-muted-foreground">
                      +{scenario.rounds.length - 2} more
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ESOP */}
            {scenario.esop.length > 0 && scenario.esop[0].percentage > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">ESOP Pool</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {scenario.esop[0].percentage}% allocated
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};