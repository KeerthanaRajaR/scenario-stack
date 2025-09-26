-- Create scenarios table
CREATE TABLE public.scenarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create founders table
CREATE TABLE public.founders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scenario_id UUID NOT NULL REFERENCES public.scenarios(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  equity NUMERIC NOT NULL
);

-- Create rounds table
CREATE TABLE public.rounds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scenario_id UUID NOT NULL REFERENCES public.scenarios(id) ON DELETE CASCADE,
  round_name TEXT NOT NULL,
  investment NUMERIC NOT NULL,
  valuation NUMERIC NOT NULL
);

-- Create esop table
CREATE TABLE public.esop (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scenario_id UUID NOT NULL REFERENCES public.scenarios(id) ON DELETE CASCADE,
  percentage NUMERIC NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esop ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for scenarios
CREATE POLICY "Users can view their own scenarios" 
ON public.scenarios 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scenarios" 
ON public.scenarios 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scenarios" 
ON public.scenarios 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scenarios" 
ON public.scenarios 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for founders
CREATE POLICY "Users can view founders of their own scenarios" 
ON public.founders 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.scenarios 
  WHERE scenarios.id = founders.scenario_id 
  AND scenarios.user_id = auth.uid()
));

CREATE POLICY "Users can create founders for their own scenarios" 
ON public.founders 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.scenarios 
  WHERE scenarios.id = founders.scenario_id 
  AND scenarios.user_id = auth.uid()
));

CREATE POLICY "Users can update founders of their own scenarios" 
ON public.founders 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.scenarios 
  WHERE scenarios.id = founders.scenario_id 
  AND scenarios.user_id = auth.uid()
));

CREATE POLICY "Users can delete founders of their own scenarios" 
ON public.founders 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.scenarios 
  WHERE scenarios.id = founders.scenario_id 
  AND scenarios.user_id = auth.uid()
));

-- Create RLS policies for rounds
CREATE POLICY "Users can view rounds of their own scenarios" 
ON public.rounds 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.scenarios 
  WHERE scenarios.id = rounds.scenario_id 
  AND scenarios.user_id = auth.uid()
));

CREATE POLICY "Users can create rounds for their own scenarios" 
ON public.rounds 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.scenarios 
  WHERE scenarios.id = rounds.scenario_id 
  AND scenarios.user_id = auth.uid()
));

CREATE POLICY "Users can update rounds of their own scenarios" 
ON public.rounds 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.scenarios 
  WHERE scenarios.id = rounds.scenario_id 
  AND scenarios.user_id = auth.uid()
));

CREATE POLICY "Users can delete rounds of their own scenarios" 
ON public.rounds 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.scenarios 
  WHERE scenarios.id = rounds.scenario_id 
  AND scenarios.user_id = auth.uid()
));

-- Create RLS policies for esop
CREATE POLICY "Users can view esop of their own scenarios" 
ON public.esop 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.scenarios 
  WHERE scenarios.id = esop.scenario_id 
  AND scenarios.user_id = auth.uid()
));

CREATE POLICY "Users can create esop for their own scenarios" 
ON public.esop 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.scenarios 
  WHERE scenarios.id = esop.scenario_id 
  AND scenarios.user_id = auth.uid()
));

CREATE POLICY "Users can update esop of their own scenarios" 
ON public.esop 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.scenarios 
  WHERE scenarios.id = esop.scenario_id 
  AND scenarios.user_id = auth.uid()
));

CREATE POLICY "Users can delete esop of their own scenarios" 
ON public.esop 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.scenarios 
  WHERE scenarios.id = esop.scenario_id 
  AND scenarios.user_id = auth.uid()
));

-- Create trigger for updating updated_at timestamp on scenarios
CREATE TRIGGER update_scenarios_updated_at
BEFORE UPDATE ON public.scenarios
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();