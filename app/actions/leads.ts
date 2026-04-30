'use server'

import { createClient } from '@supabase/supabase-js';
import { calculateLeadScore } from '@/src/lib/scoring';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function submitLead(formData: any) {
  try {
    // 1. Calculate Score
    const score = calculateLeadScore({
      workTypes: formData.workTypes,
      budget: formData.budget,
      zipCode: formData.zipCode,
      propertyType: formData.propertyType,
      propertyYear: formData.propertyYear,
      surface: formData.surface,
      income: formData.income,
    });

    // 2. Map to Database Schema
    // In our Prisma schema, the Lead model has:
    // firstName, lastName, email, phone, zipCode, department, projectType, description, budget, status, score
    
    const leadData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      zipCode: formData.zipCode,
      department: formData.zipCode.substring(0, 2),
      projectType: formData.workTypes.join(', '),
      description: formData.message,
      budget: formData.budget,
      score: score,
      status: 'NEW',
    };

    // 3. Save to Supabase
    const { data, error } = await supabase
      .from('Lead') // Prisma maps models to table names (usually PascalCase or camelCase depending on config)
      .insert([leadData])
      .select();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error submitting lead:', error);
    return { success: false, error: error.message };
  }
}
