
-- Add description and address columns to service_providers table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_providers' AND column_name = 'description') THEN
        ALTER TABLE service_providers ADD COLUMN description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_providers' AND column_name = 'address') THEN
        ALTER TABLE service_providers ADD COLUMN address TEXT;
    END IF;
END $$;
