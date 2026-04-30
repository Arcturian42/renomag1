'use client'

import { useController, Control } from 'react-hook-form'
import type { DevisFormData } from '@/lib/schemas/devis'

export default function ContactStep({ control }: { control: Control<DevisFormData> }) {
  const { field: firstNameField } = useController({ control, name: 'firstName' })
  const { field: lastNameField } = useController({ control, name: 'lastName' })
  const { field: emailField } = useController({ control, name: 'email' })
  const { field: phoneField } = useController({ control, name: 'phone' })
  const { field: messageField } = useController({ control, name: 'message' })

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 mb-1">
        Vos coordonnées
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Les artisans sélectionnés vous contacteront gratuitement sous 48h
      </p>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="firstName">Prénom</label>
            <input id="firstName" type="text" className="input-field" value={firstNameField.value || ''} onChange={firstNameField.onChange} />
          </div>
          <div>
            <label className="label" htmlFor="lastName">Nom</label>
            <input id="lastName" type="text" className="input-field" value={lastNameField.value || ''} onChange={lastNameField.onChange} />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="vous@email.com" className="input-field" value={emailField.value || ''} onChange={emailField.onChange} />
        </div>
        <div>
          <label className="label" htmlFor="phone">Téléphone</label>
          <input id="phone" type="tel" placeholder="06 12 34 56 78" className="input-field" value={phoneField.value || ''} onChange={phoneField.onChange} />
        </div>
        <div>
          <label className="label" htmlFor="message">Message (optionnel)</label>
          <textarea id="message" rows={3} placeholder="Décrivez votre projet en quelques mots..." className="input-field" value={messageField.value || ''} onChange={messageField.onChange} />
        </div>
      </div>
    </div>
  )
}
