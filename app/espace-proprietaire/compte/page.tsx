import { User, Home, Bell, Shield, LogOut } from 'lucide-react'

export default function ProprietaireComptePage() {
  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Mon compte</h1>
        <p className="text-slate-500 mt-1">Gérez vos informations personnelles et préférences.</p>
      </div>

      <div className="space-y-6">
        {/* Personal info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <User className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Informations personnelles</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="prnom">Prénom</label>
              <input id="prnom" type="text" className="input-field" defaultValue="Jean" />
            </div>
            <div>
              <label className="label" htmlFor="nom">Nom</label>
              <input id="nom" type="text" className="input-field" defaultValue="Dupont" />
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" type="email" className="input-field" defaultValue="jean.dupont@email.fr" />
            </div>
            <div>
              <label className="label" htmlFor="tlphone">Téléphone</label>
              <input id="tlphone" type="tel" className="input-field" defaultValue="06 12 34 56 78" />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button className="btn-primary px-5 py-2.5">Enregistrer</button>
          </div>
        </div>

        {/* Housing info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Home className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Mon logement</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="type-de-logement">Type de logement</label>
              <select id="type-de-logement" className="input-field">
                <option>Maison individuelle</option>
                <option>Appartement</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="surface-m">Surface (m²)</label>
              <input id="surface-m" type="number" className="input-field" defaultValue="120" />
            </div>
            <div>
              <label className="label" htmlFor="anne-de-construction">Année de construction</label>
              <input id="anne-de-construction" type="number" className="input-field" defaultValue="1985" />
            </div>
            <div>
              <label className="label" htmlFor="code-postal">Code postal</label>
              <input id="code-postal" type="text" className="input-field" defaultValue="75016" />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button className="btn-primary px-5 py-2.5">Enregistrer</button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Bell className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Notifications</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Nouveau devis reçu', desc: 'Email + SMS', enabled: true },
              { label: 'Nouveau message artisan', desc: 'Email', enabled: true },
              { label: 'Rappels administratifs', desc: 'Email', enabled: true },
              { label: 'Newsletter RENOMAG', desc: 'Email', enabled: false },
            ].map((notif) => (
              <div key={notif.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-900">{notif.label}</p>
                  <p className="text-xs text-slate-400">{notif.desc}</p>
                </div>
                <button
                  className={`relative inline-flex w-10 h-6 rounded-full transition-colors ${notif.enabled ? 'bg-primary-600' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${notif.enabled ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Shield className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Sécurité</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="mot-de-passe-actuel">Mot de passe actuel</label>
              <input id="mot-de-passe-actuel" type="password" className="input-field" placeholder="••••••••" />
            </div>
            <div>
              <label className="label" htmlFor="nouveau-mot-de-passe">Nouveau mot de passe</label>
              <input id="nouveau-mot-de-passe" type="password" className="input-field" placeholder="••••••••" />
            </div>
            <div>
              <label className="label" htmlFor="confirmer-le-nouveau-mot-de-pa">Confirmer le nouveau mot de passe</label>
              <input id="confirmer-le-nouveau-mot-de-pa" type="password" className="input-field" placeholder="••••••••" />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button className="btn-primary px-5 py-2.5">Modifier le mot de passe</button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-red-50 rounded-xl border border-red-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <LogOut className="w-5 h-5 text-red-600" />
            <h2 className="font-semibold text-red-900">Zone de danger</h2>
          </div>
          <p className="text-sm text-red-700 mb-4">
            La suppression de votre compte est irréversible. Toutes vos données seront effacées.
          </p>
          <button className="text-sm font-medium text-red-600 hover:text-red-800 border border-red-300 rounded-lg px-4 py-2 hover:bg-red-100 transition-colors">
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  )
}
