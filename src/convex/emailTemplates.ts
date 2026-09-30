/** Branded email templates for The Zariya Academy applications. */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type ApplicationEmailData = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  background: string;
  experience: string;
  motivation: string;
  preferredCallTime?: string;
  ref: string;
};

function shell(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f7f6f3;">
    <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(title)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6f3;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e6e3dc;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:28px 32px 0;">
                <div style="font-family:Georgia,serif;font-size:15px;letter-spacing:0.35em;color:#1c1c1a;">ZARIYA</div>
                <div style="height:1px;background:#e6e3dc;margin-top:20px;"></div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px;font-family:Helvetica,Arial,sans-serif;color:#1c1c1a;font-size:15px;line-height:1.65;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 28px;font-family:Helvetica,Arial,sans-serif;color:#8a877e;font-size:12px;line-height:1.6;">
                Zariya · [PLACEHOLDER: address] · India
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Email to the applicant confirming receipt. */
export function applicantConfirmationEmail(
  data: ApplicationEmailData,
): { subject: string; html: string; text: string } {
  const firstName = data.fullName.trim().split(/\s+/)[0] || "there";
  const html = shell(
    "Application received",
    `<p style="margin:0 0 16px;">Hi ${escapeHtml(firstName)},</p>
     <p style="margin:0 0 16px;">Your application to <strong>Zariya Academy — Barista Method course</strong> has been received.</p>
     <p style="margin:0 0 16px;">Our team reviews every application personally, and you can expect a call <strong>within 48 hours</strong> on the number you shared.</p>
     <div style="margin:24px 0;padding:14px 18px;border-left:3px solid #9a1b1e;background:#faf9f6;">
       <div style="font-size:12px;letter-spacing:0.12em;color:#8a877e;text-transform:uppercase;">Reference</div>
       <div style="font-family:Georgia,serif;font-size:18px;margin-top:4px;">${escapeHtml(data.ref)}</div>
     </div>
     <p style="margin:0;">— The Zariya team</p>`,
  );
  const text = `Hi ${firstName},

Your application to Zariya Academy — Barista Method course has been received.

Our team reviews every application personally, and you can expect a call within 48 hours on the number you shared.

Reference: ${data.ref}

— The Zariya team`;
  return {
    subject: "Application received — Zariya Academy",
    html,
    text,
  };
}

/** Email to the team announcing a new application. */
export function teamNotificationEmail(
  data: ApplicationEmailData,
): { subject: string; html: string; text: string } {
  const row = (label: string, value: string) =>
    `<tr>
       <td style="padding:6px 0;vertical-align:top;color:#8a877e;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;width:150px;">${escapeHtml(label)}</td>
       <td style="padding:6px 0;color:#1c1c1a;font-size:14px;">${escapeHtml(value)}</td>
     </tr>`;

  const html = shell(
    "New Academy application",
    `<p style="margin:0 0 16px;">A new application has been submitted.</p>
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
       ${row("Reference", data.ref)}
       ${row("Name", data.fullName)}
       ${row("Email", data.email)}
       ${row("Phone", data.phone)}
       ${row("City", data.city)}
       ${row("Background", data.background)}
       ${row("Experience", data.experience)}
       ${row("Preferred call", data.preferredCallTime ?? "—")}
     </table>
     <div style="margin:20px 0;padding:14px 18px;border-left:3px solid #9a1b1e;background:#faf9f6;font-size:14px;line-height:1.65;">
       ${escapeHtml(data.motivation)}
     </div>`,
  );

  const text = `New Academy application

Reference: ${data.ref}
Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
City: ${data.city}
Background: ${data.background}
Experience: ${data.experience}
Preferred call: ${data.preferredCallTime ?? "—"}

Why they want to join:
${data.motivation}`;

  return {
    subject: `New Academy application — ${data.fullName} (${data.ref})`,
    html,
    text,
  };
}
