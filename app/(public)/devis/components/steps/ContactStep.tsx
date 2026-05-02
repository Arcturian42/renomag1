'use client'

import { useFormContext } from 'react-hook-form'
import Link from 'next/link'
import type { DevisFormData } from '../../schema'

export default function ContactStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<DevisFormData>()

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Vos coordonnées</h2>
      <p className="text-sm text-slate-500 mb-6">
        Pour que les artisans puissent vous contacter
      </p>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="prnom">Prénom</label>
            <input
              id="prnom"
              type="text"
              placeholder="Jean"
              className="input-field"
              required
              aria-required="true"
              {...register('firstName')}
            />
            {errors.firstName && (
              <p role="alert" className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label className="label" htmlFor="nom">Nom</label>
            <input
              id="nom"
              type="text"
              placeholder="Dupont"
              className="input-field"
              required
              aria-required="true"
              {...register('lastName')}
            />
            {errors.lastName && (
              <p role="alert" className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="jean.dupont@email.fr"
            className="input-field"
            required
            aria-required="true"
            {...register('email')}
          />
          {errors.email && (
            <p role="alert" className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="label" htmlFor="tlphone">Téléphone</label>
          <input
            id="tlphone"
            type="tel"
            placeholder="06 12 34 56 78"
            className="input-field"
            required
            aria-required="true"
            {...register('phone')}
          />
          {errors.phone && (
            <p role="alert" className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="label" htmlFor="informations-complmentaires-op">
            Informations complémentaires (optionnel)
          </label>
          <textarea
            id="informations-complmentaires-op"
            rows={3}
            placeholder="Précisez votre projet, vos contraintes..."
            className="input-field resize-none"
            {...register('message')}
          />
          {errors.message && (
            <p role="alert" className="text-sm text-red-600 mt-1">{errors.message.message}</p>
          )}
        </div>

        <p className="text-xs text-slate-400">
          En soumettant ce formulaire, vous acceptez nos{' '}
          <Link href="/cgv" className="text-primary-600 hover:underline">CGU</Link>
          {' '}et notre{' '}
          <Link href="/confidentialite" className="text-primary-600 hover:underline">
            politique de confidentialité
          </Link>.
        </p>
      </div>
    </div>
  )
}
