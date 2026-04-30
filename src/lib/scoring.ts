export type LeadData = {
  workTypes: string[];
  budget: string;
  zipCode: string;
  propertyType: string;
  propertyYear: string;
  surface: string;
  income: 'modeste' | 'intermediaire' | 'superieur';
};

export function calculateLeadScore(data: LeadData): number {
  let score = 0;

  // 1. Project Scope (Max 40 points)
  // Multiple work types or global renovation get higher scores
  if (data.workTypes.length > 1) {
    score += 40;
  } else if (data.workTypes.length === 1) {
    const type = data.workTypes[0];
    if (type === 'renovation-globale' || type === 'pompe-a-chaleur') {
      score += 30;
    } else {
      score += 20;
    }
  }

  // 2. Budget (Max 30 points)
  const budget = parseInt(data.budget);
  if (budget >= 50000) {
    score += 30;
  } else if (budget >= 20000) {
    score += 20;
  } else if (budget >= 10000) {
    score += 10;
  } else {
    score += 5;
  }

  // 3. Subsidy Eligibility / Income (Max 20 points)
  // Modeste households are more likely to convert due to higher subsidies
  if (data.income === 'modeste') {
    score += 20;
  } else if (data.income === 'intermediaire') {
    score += 10;
  } else {
    score += 5;
  }

  // 4. Property Age (Max 10 points)
  // Older properties often have more renovation needs
  if (data.propertyYear === 'avant1948') {
    score += 10;
  } else if (data.propertyYear === '1948-1975') {
    score += 7;
  } else {
    score += 3;
  }

  return score;
}
