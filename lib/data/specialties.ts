export const WORK_TYPE_TO_SPECIALTY: Record<string, { name: string; slug: string }> = {
  isolation_combles: { name: 'Isolation des combles', slug: 'isolation-combles' },
  isolation_murs: { name: 'Isolation des murs', slug: 'isolation-murs' },
  pac: { name: 'Pompe à chaleur', slug: 'pompe-a-chaleur' },
  photovoltaique: { name: 'Panneaux solaires', slug: 'panneaux-solaires' },
  fenetres: { name: 'Menuiseries', slug: 'menuiseries' },
  vmc: { name: 'VMC Double Flux', slug: 'vmc-double-flux' },
}

export function getSpecialtyFromWorkType(workTypeId: string): { name: string; slug: string } | null {
  return WORK_TYPE_TO_SPECIALTY[workTypeId] || null
}

export function getSpecialtySlugsFromWorkTypes(workTypeIds: string[]): string[] {
  return workTypeIds
    .map((id) => WORK_TYPE_TO_SPECIALTY[id]?.slug)
    .filter((slug): slug is string => !!slug)
}
