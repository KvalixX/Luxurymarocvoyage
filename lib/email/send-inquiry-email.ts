import 'server-only';
import nodemailer from 'nodemailer';

export interface InquiryEmailData {
  name: string;
  email: string;
  phone: string;
  travelDate?: string;
  travelers?: string;
  notes?: string;
  tourTitle?: string;
  tourSlug?: string;
  locale: string;
  requestType?: string;
  source?: string;
  price?: string;
  tripType?: string;
}

interface InquiryRequestMetadata {
  ipAddress: string;
  userAgent: string;
  originPage: string;
}

function cleanHeader(value: string) {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character] || character);
}

export async function sendInquiryEmail(inquiry: InquiryEmailData, metadata: InquiryRequestMetadata) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASS;
  const recipient = process.env.SMTP_TO || user;
  const fromAddress = process.env.SMTP_FROM || user;

  if (!host || !user || !password || !recipient || !fromAddress || !Number.isInteger(port)) {
    throw new Error('Email delivery is not configured');
  }

  const subject = cleanHeader(inquiry.tourTitle || 'Travel inquiry');
  const submittedAt = new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
    hourCycle: 'h23', timeZone: 'Africa/Casablanca',
  }).format(new Date());
  const tripKind = inquiry.tripType || 'unknown';
  const tripTypeLabel = tripKind === 'excursion' ? 'Excursion'
    : tripKind === 'circuit' ? 'Circuit'
      : tripKind === 'event' ? 'Événement'
        : tripKind === 'destination' ? 'Destination'
          : 'Non précisé';
  const requestTypeLabel = inquiry.requestType === 'information' ? 'Demande d’information'
    : inquiry.requestType === 'support' ? 'Demande de support'
      : inquiry.requestType === 'Event information request' ? 'Demande d’information événementielle'
        : inquiry.requestType === 'Quote request' || inquiry.requestType === 'quote' ? 'Demande de devis personnalisé'
          : inquiry.requestType || 'Demande de contact';
  const details = [
    ['Type de contact', requestTypeLabel],
    ['Date', submittedAt],
    ['Type de voyage', tripTypeLabel],
    ['Voyage sélectionné', inquiry.tourTitle],
    ['Référence', inquiry.tourSlug],
    ['Tarif de l’événement', inquiry.price],
    ['Date souhaitée', inquiry.travelDate],
    ['Nombre de personnes', inquiry.travelers],
    ['Langue du formulaire', inquiry.locale],
    ['Formulaire envoyé depuis', inquiry.source],
  ].filter(([, value]) => Boolean(value)) as [string, string][];
  const lines = [
    'Nouvelle demande reçue sur le site Luxury Maroc Voyage',
    '',
    ...details.map(([label, value]) => `${label}: ${value}`),
    '',
    `Nom: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Téléphone: ${inquiry.phone}`,
    '',
    'Message :',
    inquiry.notes || 'Aucun message complémentaire.',
    '',
    'Informations techniques :',
    `Adresse IP: ${metadata.ipAddress}`,
    `Navigateur: ${metadata.userAgent}`,
    `Page d'origine: ${metadata.originPage}`,
  ].filter((line) => line !== undefined);

  const detailRows = details.map(([label, value]) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #eee8e1;color:#667085;font-size:13px;width:38%">${escapeHtml(label)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #eee8e1;color:#181e4b;font-size:13px;font-weight:600">${escapeHtml(value)}</td>
    </tr>`).join('');
  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f5f2ed;font-family:Arial,Helvetica,sans-serif;color:#181e4b">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:680px;margin:0 auto;background:#fff;border:1px solid #eee8e1;border-radius:16px;overflow:hidden">
      <tr><td style="padding:24px 28px;background:#181e4b;color:#fff">
        <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#e8b77e">Luxury Maroc Voyage</div>
        <h1 style="font-size:23px;line-height:1.3;margin:10px 0 4px;color:#fff">Nouvelle demande de voyage</h1>
        <div style="font-size:14px;color:#e6e7ef">${escapeHtml(inquiry.tourTitle || tripTypeLabel)}</div>
      </td></tr>
      <tr><td style="padding:24px 28px 8px">
        <h2 style="font-size:15px;margin:0 0 10px;color:#b64f2e">Détails du devis</h2>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #eee8e1;border-radius:10px">${detailRows}</table>
      </td></tr>
      <tr><td style="padding:18px 28px 8px">
        <h2 style="font-size:15px;margin:0 0 10px;color:#b64f2e">Coordonnées du client</h2>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#faf8f5;border-radius:10px">
          <tr><td style="padding:12px 14px;color:#667085;font-size:13px;width:38%">Nom</td><td style="padding:12px 14px;color:#181e4b;font-weight:600;font-size:13px">${escapeHtml(inquiry.name)}</td></tr>
          <tr><td style="padding:12px 14px;border-top:1px solid #eee8e1;color:#667085;font-size:13px">Email</td><td style="padding:12px 14px;border-top:1px solid #eee8e1;font-size:13px"><a href="mailto:${escapeHtml(inquiry.email)}" style="color:#b64f2e;font-weight:600">${escapeHtml(inquiry.email)}</a></td></tr>
          <tr><td style="padding:12px 14px;border-top:1px solid #eee8e1;color:#667085;font-size:13px">Téléphone</td><td style="padding:12px 14px;border-top:1px solid #eee8e1;font-size:13px"><a href="tel:${escapeHtml(inquiry.phone)}" style="color:#b64f2e;font-weight:600">${escapeHtml(inquiry.phone)}</a></td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:18px 28px 26px">
        <h2 style="font-size:15px;margin:0 0 10px;color:#b64f2e">Message</h2>
        <div style="padding:16px;background:#faf8f5;border-left:3px solid #d87952;border-radius:6px;color:#344054;font-size:14px;line-height:1.65;white-space:pre-wrap">${escapeHtml(inquiry.notes || 'Aucun message complémentaire.').replace(/\n/g, '<br>')}</div>
      </td></tr>
      <tr><td style="padding:18px 28px 26px">
        <h2 style="font-size:15px;margin:0 0 10px;color:#b64f2e">Informations techniques</h2>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#faf8f5;border-radius:10px">
          <tr><td style="padding:10px 12px;color:#667085;font-size:13px;width:38%">Adresse IP</td><td style="padding:10px 12px;color:#181e4b;font-size:13px">${escapeHtml(metadata.ipAddress)}</td></tr>
          <tr><td style="padding:10px 12px;border-top:1px solid #eee8e1;color:#667085;font-size:13px">Navigateur</td><td style="padding:10px 12px;border-top:1px solid #eee8e1;color:#181e4b;font-size:12px;word-break:break-word">${escapeHtml(metadata.userAgent)}</td></tr>
          <tr><td style="padding:10px 12px;border-top:1px solid #eee8e1;color:#667085;font-size:13px">Page d'origine</td><td style="padding:10px 12px;border-top:1px solid #eee8e1;font-size:12px;word-break:break-word"><a href="${escapeHtml(metadata.originPage)}" style="color:#b64f2e">${escapeHtml(metadata.originPage)}</a></td></tr>
        </table>
        <p style="margin:20px 0 0;color:#667085;font-size:12px">Vous pouvez répondre directement à cet e-mail pour contacter le client.</p>
      </td></tr>
    </table>
  </body></html>`;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass: password },
  });

  await transporter.sendMail({
    from: { name: 'Luxury Maroc Voyage', address: fromAddress },
    to: recipient,
    replyTo: { name: cleanHeader(inquiry.name), address: inquiry.email },
    subject: `Nouvelle demande - ${subject}`,
    text: lines.join('\n'),
    html,
  });
}
