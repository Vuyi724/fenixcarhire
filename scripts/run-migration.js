#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration() {
  try {
    const sqlFile = path.join(process.cwd(), 'scripts', '01-init-database.sql')
    const sql = fs.readFileSync(sqlFile, 'utf-8')

    console.log('Running database migration...')

    const { error } = await supabase.rpc('exec_sql', { sql_string: sql })

    if (error) {
      console.error('Migration error:', error)
      process.exit(1)
    }

    console.log('✓ Migration completed successfully')
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

runMigration()
