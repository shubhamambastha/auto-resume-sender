CREATE TABLE public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  hr_name text,
  hr_email text NOT NULL,
  position_applied_for text NOT NULL,
  resume_type text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.submissions FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.submissions FOR INSERT WITH CHECK (true);
