import os
import sys
from supabase import create_client

# Get Supabase credentials
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not supabase_url or not supabase_key:
    print("Error: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set")
    sys.exit(1)

# Create Supabase client
supabase = create_client(supabase_url, supabase_key)

# Read and execute the SQL script
with open('/vercel/share/v0-project/scripts/00-create-tables.sql', 'r') as f:
    sql_script = f.read()

try:
    # Execute the SQL through the REST API
    response = supabase.postgrest.client.post(
        f"{supabase_url}/rest/v1/rpc/exec",
        json={"sql": sql_script}
    )
    print("Database initialized successfully!")
    print(response)
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
