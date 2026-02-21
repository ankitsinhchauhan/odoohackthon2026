import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <p>hello word</p>
      </div>
    </>
  )
}

export default App

//CREATE TYPE public.app_role AS ENUM ('manager', 'dispatcher');

// -- Organizations table
// CREATE TABLE public.organizations (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   name TEXT NOT NULL,
//   created_at TIMESTAMPTZ NOT NULL DEFAULT now()
// );
// ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

// -- Profiles table
// CREATE TABLE public.profiles (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
//   organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
//   full_name TEXT,
//   role app_role NOT NULL DEFAULT 'dispatcher',
//   phone TEXT,
//   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
//   updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
// );
// ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

// -- Vehicles table
// CREATE TABLE public.vehicles (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
//   name TEXT NOT NULL,
//   license_plate TEXT NOT NULL,
//   type TEXT NOT NULL DEFAULT 'Truck',
//   max_capacity NUMERIC NOT NULL DEFAULT 0,
//   mileage NUMERIC NOT NULL DEFAULT 0,
//   status TEXT NOT NULL DEFAULT 'Available',
//   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
//   updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
// );
// ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

// -- Drivers table
// CREATE TABLE public.drivers (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
//   name TEXT NOT NULL,
//   phone TEXT,
//   license_expiry DATE,
//   license_category TEXT[] DEFAULT '{}',
//   safety_score INTEGER NOT NULL DEFAULT 100,
//   trips_completed INTEGER NOT NULL DEFAULT 0,
//   status TEXT NOT NULL DEFAULT 'On Duty',
//   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
//   updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
// );
// ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

// -- Trips table
// CREATE TABLE public.trips (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
//   vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
//   driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
//   origin TEXT NOT NULL,
//   destination TEXT NOT NULL,
//   cargo_weight NUMERIC NOT NULL DEFAULT 0,
//   status TEXT NOT NULL DEFAULT 'Draft',
//   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
//   updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
// );
// ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

// -- Maintenance logs table
// CREATE TABLE public.maintenance_logs (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
//   vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
//   service_type TEXT NOT NULL,
//   description TEXT,
//   cost NUMERIC NOT NULL DEFAULT 0,
//   status TEXT NOT NULL DEFAULT 'Scheduled',
//   service_date DATE NOT NULL DEFAULT CURRENT_DATE,
//   created_at TIMESTAMPTZ NOT NULL DEFAULT now()
// );
// ALTER TABLE public.maintenance_logs ENABLE ROW LEVEL SECURITY;

// -- Expense logs table
// CREATE TABLE public.expense_logs (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
//   vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
//   category TEXT NOT NULL,
//   description TEXT,
//   amount NUMERIC NOT NULL DEFAULT 0,
//   expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
//   created_at TIMESTAMPTZ NOT NULL DEFAULT now()
// );
// ALTER TABLE public.expense_logs ENABLE ROW LEVEL SECURITY;

// -- Helper function: get user's org id
// CREATE OR REPLACE FUNCTION public.get_user_organization_id(uid UUID)
// RETURNS UUID
// LANGUAGE sql
// STABLE
// SECURITY DEFINER
// SET search_path = public
// AS $$
//   SELECT organization_id FROM public.profiles WHERE user_id = uid LIMIT 1;
// $$;

// -- Helper function: check org membership
// CREATE OR REPLACE FUNCTION public.is_member_of_org(target_org_id UUID)
// RETURNS BOOLEAN
// LANGUAGE sql
// STABLE
// SECURITY DEFINER
// SET search_path = public
// AS $$
//   SELECT EXISTS (
//     SELECT 1 FROM public.profiles
//     WHERE user_id = auth.uid() AND organization_id = target_org_id
//   );
// $$;

// -- Helper: check if user is manager
// CREATE OR REPLACE FUNCTION public.is_manager()
// RETURNS BOOLEAN
// LANGUAGE sql
// STABLE
// SECURITY DEFINER
// SET search_path = public
// AS $$
//   SELECT EXISTS (
//     SELECT 1 FROM public.profiles
//     WHERE user_id = auth.uid() AND role = 'manager'
//   );
// $$;

// -- Auto-create profile on signup trigger
// CREATE OR REPLACE FUNCTION public.handle_new_user()
// RETURNS TRIGGER
// LANGUAGE plpgsql
// SECURITY DEFINER
// SET search_path = public
// AS $$
// DECLARE
//   org_id UUID;
//   user_role app_role;
//   user_name TEXT;
// BEGIN
//   user_role := COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'dispatcher');
//   user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  
//   -- Check if org name provided, else create default
//   IF NEW.raw_user_meta_data->>'organization_name' IS NOT NULL AND NEW.raw_user_meta_data->>'organization_name' != '' THEN
//     INSERT INTO public.organizations (name) VALUES (NEW.raw_user_meta_data->>'organization_name') RETURNING id INTO org_id;
//   ELSE
//     -- Join first available org or create one
//     SELECT id INTO org_id FROM public.organizations LIMIT 1;
//     IF org_id IS NULL THEN
//       INSERT INTO public.organizations (name) VALUES ('Default Organization') RETURNING id INTO org_id;
//     END IF;
//   END IF;

//   INSERT INTO public.profiles (user_id, organization_id, full_name, role)
//   VALUES (NEW.id, org_id, user_name, user_role);
  
//   RETURN NEW;
// END;
// $$;

// CREATE TRIGGER on_auth_user_created
//   AFTER INSERT ON auth.users
//   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

// -- Update timestamp trigger
// CREATE OR REPLACE FUNCTION public.update_updated_at()
// RETURNS TRIGGER
// LANGUAGE plpgsql
// SET search_path = public
// AS $$
// BEGIN
//   NEW.updated_at = now();
//   RETURN NEW;
// END;
// $$;

// CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
// CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
// CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON public.drivers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
// CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON public.trips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

// -- RLS Policies

// -- Organizations: members can view
// CREATE POLICY "Members can view their org" ON public.organizations FOR SELECT USING (public.is_member_of_org(id));

// -- Profiles: members can view org profiles, users can update own
// CREATE POLICY "Members can view org profiles" ON public.profiles FOR SELECT USING (public.is_member_of_org(organization_id));
// CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
// -- Allow trigger to insert
// CREATE POLICY "Service role can insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);

// -- Vehicles
// CREATE POLICY "Members can view vehicles" ON public.vehicles FOR SELECT USING (public.is_member_of_org(organization_id));
// CREATE POLICY "Members can insert vehicles" ON public.vehicles FOR INSERT WITH CHECK (public.is_member_of_org(organization_id));
// CREATE POLICY "Members can update vehicles" ON public.vehicles FOR UPDATE USING (public.is_member_of_org(organization_id));
// CREATE POLICY "Managers can delete vehicles" ON public.vehicles FOR DELETE USING (public.is_manager() AND public.is_member_of_org(organization_id));

// -- Drivers
// CREATE POLICY "Members can view drivers" ON public.drivers FOR SELECT USING (public.is_member_of_org(organization_id));
// CREATE POLICY "Members can insert drivers" ON public.drivers FOR INSERT WITH CHECK (public.is_member_of_org(organization_id));
// CREATE POLICY "Members can update drivers" ON public.drivers FOR UPDATE USING (public.is_member_of_org(organization_id));
// CREATE POLICY "Managers can delete drivers" ON public.drivers FOR DELETE USING (public.is_manager() AND public.is_member_of_org(organization_id));

// -- Trips
// CREATE POLICY "Members can view trips" ON public.trips FOR SELECT USING (public.is_member_of_org(organization_id));
// CREATE POLICY "Members can insert trips" ON public.trips FOR INSERT WITH CHECK (public.is_member_of_org(organization_id));
// CREATE POLICY "Members can update trips" ON public.trips FOR UPDATE USING (public.is_member_of_org(organization_id));
// CREATE POLICY "Members can delete trips" ON public.trips FOR DELETE USING (public.is_member_of_org(organization_id));

// -- Maintenance logs
// CREATE POLICY "Members can view maintenance" ON public.maintenance_logs FOR SELECT USING (public.is_member_of_org(organization_id));
// CREATE POLICY "Members can insert maintenance" ON public.maintenance_logs FOR INSERT WITH CHECK (public.is_member_of_org(organization_id));
// CREATE POLICY "Members can update maintenance" ON public.maintenance_logs FOR UPDATE USING (public.is_member_of_org(organization_id));
// CREATE POLICY "Members can delete maintenance" ON public.maintenance_logs FOR DELETE USING (public.is_member_of_org(organization_id));

// -- Expense logs
// CREATE POLICY "Members can view expenses" ON public.expense_logs FOR SELECT USING (public.is_member_of_org(organization_id));
// CREATE POLICY "Members can insert expenses" ON public.expense_logs FOR INSERT WITH CHECK (public.is_member_of_org(organization_id));
// CREATE POLICY "Members can update expenses" ON public.expense_logs FOR UPDATE USING (public.is_member_of_org(organization_id));
// CREATE POLICY "Members can delete expenses" ON public.expense_logs FOR DELETE USING (public.is_member_of_org(organization_id));