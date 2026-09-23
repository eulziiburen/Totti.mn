function wrapper(title: string, bodyHtml: string): string {
  return `
  <div style="background:#f5f4f0;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e3dc;">
      <div style="background:#0d0c0a;padding:24px 28px;">
        <span style="color:#d4af37;font-weight:800;letter-spacing:0.08em;font-size:14px;">ТОТТИ</span>
      </div>
      <div style="padding:28px;color:#0d0c0a;">
        <h1 style="font-size:20px;margin:0 0 16px;">${title}</h1>
        ${bodyHtml}
      </div>
      <div style="padding:16px 28px;color:#8a8577;font-size:12px;border-top:1px solid #e5e3dc;">
        ТОТТИ Спортын Агентлаг · Сүхбаатар дүүрэг, Улаанбаатар
      </div>
    </div>
  </div>`;
}

function button(url: string, label: string): string {
  return `<a href="${url}" style="display:inline-block;background:#d4af37;color:#0d0c0a;font-weight:800;text-decoration:none;padding:12px 24px;border-radius:999px;margin-top:12px;">${label}</a>`;
}

export function welcomeEmailHtml(name: string): { subject: string; html: string } {
  return {
    subject: "Тавтай морил, ТОТТИ дэлгүүрт бүртгэгдлээ",
    html: wrapper(
      "Тавтай морил! 👋",
      `<p style="margin:0 0 12px;line-height:1.6;">Сайн байна уу, ${name},</p>
       <p style="margin:0 0 12px;line-height:1.6;">Таны бүртгэл ТОТТИ Онлайн дэлгүүрт амжилттай үүслээ. Одооноос захиалга хийхдээ мэдээллээ дахин бөглөх шаардлагагүй.</p>`
    ),
  };
}

export function passwordResetEmailHtml(resetUrl: string): { subject: string; html: string } {
  return {
    subject: "Нууц үг сэргээх хүсэлт — ТОТТИ",
    html: wrapper(
      "Нууц үг сэргээх",
      `<p style="margin:0 0 12px;line-height:1.6;">Таны акаунтад нууц үг сэргээх хүсэлт ирлээ. Доорх товч дээр дарж шинэ нууц үг тохируулна уу (1 цагийн дотор хүчинтэй).</p>
       ${button(resetUrl, "Нууц үг сэргээх")}
       <p style="margin:16px 0 0;line-height:1.6;font-size:13px;color:#5c5952;">Хэрэв та энэ хүсэлтийг илгээгээгүй бол энэ имэйлийг үл тоомсорлож болно.</p>`
    ),
  };
}

export function orderConfirmationEmailHtml(params: {
  orderNo: string;
  items: { productName: string; variantLabel: string; quantity: number; lineTotal: number }[];
  total: number;
  orderUrl: string;
}): { subject: string; html: string } {
  const rows = params.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0;">${i.productName}${
          i.variantLabel && i.variantLabel !== "—" ? ` (${i.variantLabel})` : ""
        } × ${i.quantity}</td><td style="padding:6px 0;text-align:right;">${i.lineTotal.toLocaleString("mn-MN")}₮</td></tr>`
    )
    .join("");
  return {
    subject: `Захиалга #${params.orderNo} баталгаажлаа`,
    html: wrapper(
      "Захиалга хүлээн авлаа",
      `<p style="margin:0 0 12px;line-height:1.6;">Таны <b>#${params.orderNo}</b> захиалгыг бид хүлээн авлаа.</p>
       <table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}</table>
       <p style="margin:12px 0;font-weight:800;font-size:16px;">Нийт: ${params.total.toLocaleString("mn-MN")}₮</p>
       ${button(params.orderUrl, "Захиалгын төлөв харах")}`
    ),
  };
}

export function orderPaidEmailHtml(orderNo: string, orderUrl: string): { subject: string; html: string } {
  return {
    subject: `Захиалга #${orderNo} — төлбөр баталгаажлаа`,
    html: wrapper(
      "Төлбөр амжилттай ✓",
      `<p style="margin:0 0 12px;line-height:1.6;">Таны <b>#${orderNo}</b> захиалгын төлбөр амжилттай хийгдлээ. Бид удахгүй холбогдож хүргэлтийг зохион байгуулна.</p>
       ${button(orderUrl, "Захиалгын төлөв харах")}`
    ),
  };
}

export function adminNewOrderEmailHtml(params: {
  orderNo: string;
  customerName: string;
  customerPhone: string;
  total: number;
  adminUrl: string;
}): { subject: string; html: string } {
  return {
    subject: `Шинэ захиалга #${params.orderNo}`,
    html: wrapper(
      "Шинэ захиалга ирлээ",
      `<p style="margin:0 0 8px;line-height:1.6;"><b>${params.customerName}</b> (${params.customerPhone}) — ${params.total.toLocaleString(
        "mn-MN"
      )}₮</p>
       ${button(params.adminUrl, "Admin дээр харах")}`
    ),
  };
}
