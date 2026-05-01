export function welcomeEmail({ firstName }: { firstName?: string | null }) {
  const greeting = firstName ? `Bonjour ${firstName},` : 'Bonjour,'
  return {
    subject: 'Bienvenue sur RENOMAG — Votre rénovation énergétique commence ici',
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Bienvenue</title></head>
<body style="font-family:system-ui,sans-serif;background:#f8fafc;padding:40px 20px;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <h1 style="color:#0f2744;font-size:20px;margin-bottom:12px;">🎉 Bienvenue sur RENOMAG</h1>
    <p style="color:#475569;line-height:1.6;">${greeting}</p>
    <p style="color:#475569;line-height:1.6;">Votre compte a été créé avec succès. Vous pouvez dès maintenant :</p>
    <ul style="color:#475569;line-height:1.7;padding-left:20px;">
      <li>Trouver des artisans RGE certifiés près de chez vous</li>
      <li>Obtenir des devis gratuits en quelques minutes</li>
      <li>Calculer vos aides MaPrimeRénov' et CEE</li>
    </ul>
    <a href="https://renomag.fr/annuaire" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#0f2744;color:#fff;border-radius:8px;text-decoration:none;font-weight:500;">Découvrir l'annuaire</a>
    <p style="color:#94a3b8;font-size:12px;margin-top:24px;">RENOMAG — La référence de la rénovation énergétique en France</p>
  </div>
</body>
</html>`,
  }
}

export function leadReceivedEmail({
  firstName,
  artisanName,
  leadName,
  projectType,
  city,
}: {
  firstName?: string | null
  artisanName: string
  leadName: string
  projectType: string
  city: string
}) {
  const greeting = firstName ? `Bonjour ${firstName},` : 'Bonjour,'
  return {
    subject: `Nouveau lead sur RENOMAG — ${projectType} à ${city}`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Nouveau lead</title></head>
<body style="font-family:system-ui,sans-serif;background:#f8fafc;padding:40px 20px;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <h1 style="color:#0f2744;font-size:20px;margin-bottom:12px;">🔔 Nouveau lead disponible</h1>
    <p style="color:#475569;line-height:1.6;">${greeting}</p>
    <p style="color:#475569;line-height:1.6;">Un nouveau projet vient d'être publié dans votre zone d'intervention :</p>
    <div style="background:#f1f5f9;border-radius:8px;padding:16px;margin:16px 0;">
      <p style="margin:0 0 4px;font-weight:600;color:#0f2744;">${leadName}</p>
      <p style="margin:0;color:#64748b;font-size:14px;">${projectType} — ${city}</p>
    </div>
    <a href="https://renomag.fr/espace-pro/leads" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#0f2744;color:#fff;border-radius:8px;text-decoration:none;font-weight:500;">Voir mes leads</a>
    <p style="color:#94a3b8;font-size:12px;margin-top:24px;">RENOMAG — Connecter les particuliers aux meilleurs artisans RGE</p>
  </div>
</body>
</html>`,
  }
}

export function passwordResetEmail({ resetUrl }: { resetUrl: string }) {
  return {
    subject: 'Réinitialisation de votre mot de passe RENOMAG',
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Réinitialisation</title></head>
<body style="font-family:system-ui,sans-serif;background:#f8fafc;padding:40px 20px;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <h1 style="color:#0f2744;font-size:20px;margin-bottom:12px;">🔐 Réinitialisation de mot de passe</h1>
    <p style="color:#475569;line-height:1.6;">Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour continuer :</p>
    <a href="${resetUrl}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#0f2744;color:#fff;border-radius:8px;text-decoration:none;font-weight:500;">Réinitialiser mon mot de passe</a>
    <p style="color:#94a3b8;font-size:12px;margin-top:24px;">Ce lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
  </div>
</body>
</html>`,
  }
}

export function newMessageEmail({
  senderName,
  preview,
}: {
  senderName: string
  preview: string
}) {
  return {
    subject: `Nouveau message de ${senderName} sur RENOMAG`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Nouveau message</title></head>
<body style="font-family:system-ui,sans-serif;background:#f8fafc;padding:40px 20px;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <h1 style="color:#0f2744;font-size:20px;margin-bottom:12px;">💬 Nouveau message</h1>
    <p style="color:#475569;line-height:1.6;"><strong>${senderName}</strong> vous a envoyé un message :</p>
    <div style="background:#f1f5f9;border-radius:8px;padding:16px;margin:16px 0;">
      <p style="margin:0;color:#475569;font-size:14px;">${preview}</p>
    </div>
    <a href="https://renomag.fr/espace-pro/messages" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#0f2744;color:#fff;border-radius:8px;text-decoration:none;font-weight:500;">Répondre</a>
  </div>
</body>
</html>`,
  }
}
