'use server';

import { createClient } from '@/lib/supabase/server';
import { calculateLeadScore } from '@/src/lib/scoring';

export async function submitLead(formData: {
  workTypes: string[];
  budget: string;
  zipCode: string;
  propertyType: string;
  propertyYear: string;
  surface: string;
  income: 'modeste' | 'intermediaire' | 'superieur';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message?: string;
}) {
  try {
    const score = calculateLeadScore({
      workTypes: formData.workTypes,
      budget: formData.budget,
      zipCode: formData.zipCode,
      propertyType: formData.propertyType,
      propertyYear: formData.propertyYear,
      surface: formData.surface,
      income: formData.income,
    });

    const supabase = await createClient();

    const leadData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      zip_code: formData.zipCode,
      department: formData.zipCode.substring(0, 2),
      project_type: formData.workTypes.join(', '),
      description: formData.message ?? null,
      budget: formData.budget,
      score,
      status: 'NEW',
    };

    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('Error submitting lead:', error);
    return { success: false, error: message };
  }
}
