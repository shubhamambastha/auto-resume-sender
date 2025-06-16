CREATE TABLE public.resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  link text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.resumes FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.resumes FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.resumes FOR UPDATE WITH CHECK (true);

-- Insert default resume types
INSERT INTO public.resumes (name, display_name, link, description) VALUES
  ('full-stack-developer', 'Full Stack Developer', 'https://drive.google.com/file/d/1VoBDechzMb9MYEdF77fDZOlftF7yf2aA/view?usp=sharing', 'Resume optimized for full stack development positions'),
  ('frontend-developer', 'Frontend Developer', 'https://drive.google.com/file/d/1az8Qru8QxAj1lJLudPB8R5alkvpUv9WZ/view?usp=sharing', 'Resume tailored for frontend development roles'),
  ('backend-developer', 'Backend Developer', 'https://drive.google.com/file/d/1VoBDechzMb9MYEdF77fDZOlftF7yf2aA/view?usp=sharing', 'Resume focused on backend development');

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON public.resumes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 