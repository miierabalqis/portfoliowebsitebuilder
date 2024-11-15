// src/supabaseClient.js
import {createClient} from '@supabase/supabase-js';

// Replace with your actual Supabase URL and anon key
const supabaseUrl = 'https://oanvchsayhsqpbnfioho.supabase.co';
const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hbnZjaHNheWhzcXBibmZpb2hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1NjQwODIsImV4cCI6MjA0NzE0MDA4Mn0.svrkp11aVCWER904f3zZU5pvccTXX6MFvWbqheaWtIw'; // Be sure to keep this secure!

// Create a Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseKey);
