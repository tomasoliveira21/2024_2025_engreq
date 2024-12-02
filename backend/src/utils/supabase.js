require('dotenv').config({ path: '../.env' })
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
console.log(process.env)
// if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
//     throw new Error('Supabase credentials error!');
// }

//  Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

module.exports = supabase;
