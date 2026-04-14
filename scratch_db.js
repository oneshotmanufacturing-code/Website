import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
);

async function check() {
  const { data, error } = await supabase.from('quote_requests').select('*').limit(1);
  console.log('Quote requests:', data, error);
}

check();
