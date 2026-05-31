-- Create storage bucket manually in Supabase Dashboard:
-- 1. Go to Storage → New Bucket
-- 2. Name: social-proof
-- 3. Public: true
-- 4. File size limit: 5MB
-- 5. Allowed types: image/jpeg, image/png, image/webp
-- 6. Add storage policies: Allow authenticated admins to INSERT/DELETE objects in the bucket

CREATE TABLE public.social_proof_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  image_url TEXT NOT NULL,
  storage_path TEXT,
  category TEXT NOT NULL DEFAULT 'payout',
  display_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.social_proof_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible items"
  ON public.social_proof_items
  FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "Admins manage all items"
  ON public.social_proof_items
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
