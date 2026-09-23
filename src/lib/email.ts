import { Resend } from "resend";

export class EmailConfigError extends Error {}

let client: Resend | null = null;

function getClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new EmailConfigError("Имэйл илгээх систем тохируулагдаагүй байна.");
  if (!client) client = new Resend(apiKey);
  return client;
}

function getFromAddress(): string {
  return process.env.EMAIL_FROM ?? "ТОТТИ Дэлгүүр <onboarding@resend.dev>";
}

export async function sendEmail(params: { to: string; subject: string; html: string }): Promise<void> {
  const resend = getClient();
  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: params.to,
    subject: params.subject,
    html: params.html,
  });
  if (error) throw new Error(`Resend send failed: ${error.message}`);
}

// Every caller wraps sendEmail in try/catch and swallows EmailConfigError (and any
// other send failure) — email is always a best-effort side effect, never something
// that should block a registration/order/payment flow from completing.
export async function sendEmailSafely(params: { to: string; subject: string; html: string }): Promise<void> {
  try {
    await sendEmail(params);
  } catch (err) {
    console.error("sendEmailSafely failed", params.subject, err);
  }
}
