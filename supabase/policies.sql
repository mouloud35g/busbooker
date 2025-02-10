
-- Enable RLS
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."bus_trips" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."bus_companies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."bookings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."reviews" ENABLE ROW LEVEL SECURITY;

-- Bus Companies Policies
CREATE POLICY "Enable read access for all users"
ON "public"."bus_companies"
FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable write access for admin users"
ON "public"."bus_companies"
FOR INSERT
TO authenticated
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Enable update access for admin users"
ON "public"."bus_companies"
FOR UPDATE
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Enable delete access for admin users"
ON "public"."bus_companies"
FOR DELETE
TO authenticated
USING (is_admin(auth.uid()));

-- Bookings Policies
CREATE POLICY "Enable read access for admin users and own bookings"
ON "public"."bookings"
FOR SELECT
TO authenticated
USING (
    is_admin(auth.uid()) OR
    user_id = auth.uid()
);

CREATE POLICY "Enable write access for authenticated users"
ON "public"."bookings"
FOR INSERT
TO authenticated
WITH CHECK (
    user_id = auth.uid()
);

CREATE POLICY "Enable update access for admin users and own bookings"
ON "public"."bookings"
FOR UPDATE
TO authenticated
USING (
    is_admin(auth.uid()) OR
    user_id = auth.uid()
)
WITH CHECK (
    is_admin(auth.uid()) OR
    user_id = auth.uid()
);

CREATE POLICY "Enable delete access for admin users and own bookings"
ON "public"."bookings"
FOR DELETE
TO authenticated
USING (
    is_admin(auth.uid()) OR
    user_id = auth.uid()
);

-- Profiles Policies
CREATE POLICY "Enable read access for admin users and own profile"
ON "public"."profiles"
FOR SELECT
TO authenticated
USING (
    is_admin(auth.uid()) OR
    id = auth.uid()
);

CREATE POLICY "Enable update access for admin users and own profile"
ON "public"."profiles"
FOR UPDATE
TO authenticated
USING (
    is_admin(auth.uid()) OR
    id = auth.uid()
)
WITH CHECK (
    is_admin(auth.uid()) OR
    id = auth.uid()
);

-- Reviews Policies
CREATE POLICY "Enable read access for all users"
ON "public"."reviews"
FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable write access for authenticated users"
ON "public"."reviews"
FOR INSERT
TO authenticated
WITH CHECK (
    user_id = auth.uid()
);

CREATE POLICY "Enable update access for admin users and own reviews"
ON "public"."reviews"
FOR UPDATE
TO authenticated
USING (
    is_admin(auth.uid()) OR
    user_id = auth.uid()
)
WITH CHECK (
    is_admin(auth.uid()) OR
    user_id = auth.uid()
);

CREATE POLICY "Enable delete access for admin users and own reviews"
ON "public"."reviews"
FOR DELETE
TO authenticated
USING (
    is_admin(auth.uid()) OR
    user_id = auth.uid()
);
