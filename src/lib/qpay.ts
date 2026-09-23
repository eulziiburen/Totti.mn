export class QPayConfigError extends Error {}
export class QPayApiError extends Error {}

type QPayConfig = {
  baseUrl: string;
  username: string;
  password: string;
  invoiceCode: string;
  siteUrl: string;
};

function getConfig(): QPayConfig {
  const baseUrl = process.env.QPAY_BASE_URL;
  const username = process.env.QPAY_USERNAME;
  const password = process.env.QPAY_PASSWORD;
  const invoiceCode = process.env.QPAY_INVOICE_CODE;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!baseUrl || !username || !password || !invoiceCode || !siteUrl) {
    throw new QPayConfigError("Онлайн төлбөрийн систем тохируулагдаагүй байна.");
  }
  return { baseUrl, username, password, invoiceCode, siteUrl };
}

let tokenCache: { accessToken: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt - 60_000 > now) {
    return tokenCache.accessToken;
  }
  const { baseUrl, username, password } = getConfig();
  const res = await fetch(`${baseUrl}/auth/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new QPayApiError(`QPay auth failed: ${res.status}`);
  }
  const data = await res.json();
  if (typeof data?.access_token !== "string") {
    throw new QPayApiError("QPay auth response missing access_token");
  }
  tokenCache = {
    accessToken: data.access_token,
    expiresAt: now + Number(data.expires_in ?? 3600) * 1000,
  };
  return tokenCache.accessToken;
}

export type QPayBankUrl = { name: string; description: string; logo: string; link: string };

export type CreateInvoiceResult = {
  invoiceId: string;
  qrImage: string | null;
  qrText: string | null;
  shortUrl: string | null;
  bankUrls: QPayBankUrl[];
};

export async function createInvoice(params: {
  senderInvoiceNo: string;
  amount: number;
  description: string;
  orderNo: string;
}): Promise<CreateInvoiceResult> {
  const { baseUrl, invoiceCode, siteUrl } = getConfig();
  const token = await getAccessToken();
  const res = await fetch(`${baseUrl}/invoice`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      invoice_code: invoiceCode,
      sender_invoice_no: params.senderInvoiceNo,
      invoice_receiver_code: "terminal",
      invoice_description: params.description,
      amount: params.amount,
      callback_url: `${siteUrl}/api/qpay/callback?order=${encodeURIComponent(params.orderNo)}`,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new QPayApiError(`QPay invoice creation failed: ${res.status} ${body}`);
  }
  const data = await res.json();
  if (typeof data?.invoice_id !== "string") {
    throw new QPayApiError("QPay invoice response missing invoice_id");
  }
  return {
    invoiceId: data.invoice_id,
    qrImage: typeof data.qr_image === "string" ? data.qr_image : null,
    qrText: typeof data.qr_text === "string" ? data.qr_text : null,
    shortUrl: typeof data.qPay_shortUrl === "string" ? data.qPay_shortUrl : null,
    bankUrls: Array.isArray(data.urls) ? data.urls : [],
  };
}

export async function checkPayment(invoiceId: string): Promise<boolean> {
  const { baseUrl } = getConfig();
  const token = await getAccessToken();
  const res = await fetch(`${baseUrl}/payment/check`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({ object_type: "INVOICE", object_id: invoiceId }),
  });
  if (!res.ok) {
    throw new QPayApiError(`QPay payment check failed: ${res.status}`);
  }
  const data = await res.json();
  const rows: Array<{ payment_status?: string }> = Array.isArray(data?.rows) ? data.rows : [];
  const count = typeof data?.count === "number" ? data.count : rows.length;
  return count > 0 || rows.some((r) => r?.payment_status === "PAID");
}
