import nodemailer from "nodemailer";
import { connectDB } from "@/lib/db";
import { Newsletter } from "@/lib/models/Newsletter";

let transporter: nodemailer.Transporter | null = null;

const SITE_URL = process.env.NEXTAUTH_URL || "https://opa-blog.vercel.app";

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
}

// ─── Shared email wrapper with OPA branding ───
function brandedEmail(content: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:20px">
    <!-- Header -->
    <div style="text-align:center;padding:32px 0 24px">
      <div style="display:inline-block;background:#155eef;color:white;font-size:20px;font-weight:800;padding:8px 20px;border-radius:10px;letter-spacing:1px">OPA</div>
    </div>

    <!-- Content card -->
    <div style="background:white;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden">
      ${content}
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px 0 16px">
      <p style="margin:0;font-size:12px;color:#98a2b3">
        OverPowers Agency — Marketing + AI + Technology
      </p>
      <p style="margin:8px 0 0;font-size:11px;color:#c0c7d1">
        <a href="${SITE_URL}" style="color:#98a2b3;text-decoration:none">${SITE_URL.replace("https://", "")}</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

// ─── 1. Contact form → Admin notification ───
export async function sendContactNotification(data: {
  name: string;
  email: string;
  message: string;
}) {
  const t = getTransporter();
  if (!t) return;

  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

  try {
    await t.sendMail({
      from: `"OPA Website" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `Tin nhắn mới từ ${data.name}`,
      replyTo: data.email,
      html: brandedEmail(`
        <div style="padding:32px">
          <div style="text-align:center;margin-bottom:24px">
            <div style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:12px;background:#fff7ed">
              <span style="font-size:24px">&#9993;</span>
            </div>
            <h2 style="margin:12px 0 4px;color:#101828;font-size:20px">Tin Nhắn Mới</h2>
            <p style="margin:0;color:#667085;font-size:14px">Từ form liên hệ trên website</p>
          </div>

          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <tr>
              <td style="padding:10px 12px;background:#f8fafc;border-radius:8px 8px 0 0;border-bottom:1px solid #e2e8f0;color:#667085;font-size:13px;width:70px">Tên</td>
              <td style="padding:10px 12px;background:#f8fafc;border-radius:8px 8px 0 0;border-bottom:1px solid #e2e8f0;font-weight:600;color:#101828;font-size:14px">${data.name}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;background:#f8fafc;border-radius:0 0 8px 8px;color:#667085;font-size:13px">Email</td>
              <td style="padding:10px 12px;background:#f8fafc;border-radius:0 0 8px 8px;font-size:14px"><a href="mailto:${data.email}" style="color:#155eef;text-decoration:none">${data.email}</a></td>
            </tr>
          </table>

          <div style="padding:16px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0">
            <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#98a2b3;font-weight:600">Nội dung</p>
            <p style="margin:0;color:#344054;font-size:14px;line-height:1.7;white-space:pre-wrap">${data.message}</p>
          </div>

          <div style="text-align:center;margin-top:24px">
            <a href="mailto:${data.email}" style="display:inline-block;padding:10px 24px;background:#155eef;color:white;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600">
              Trả Lời ${data.name}
            </a>
          </div>
        </div>
      `),
    });
  } catch (err) {
    console.error("Failed to send contact email:", err);
  }
}

// ─── 2. Newsletter → Welcome email ───
export async function sendNewsletterWelcome(email: string) {
  const t = getTransporter();
  if (!t) return;

  try {
    await t.sendMail({
      from: `"OPA Blog" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Chao mung ban den voi OPA Blog!",
      html: brandedEmail(`
        <div style="padding:40px 32px;text-align:center">
          <div style="display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;background:#eff6ff;margin-bottom:16px">
            <span style="font-size:28px">&#127881;</span>
          </div>
          <h2 style="margin:0 0 8px;color:#101828;font-size:22px">Dang Ky Thanh Cong!</h2>
          <p style="margin:0 0 24px;color:#667085;font-size:15px;line-height:1.7;max-width:400px;display:inline-block">
            Cam on ban da dang ky nhan tin tu OPA Blog. Ban se nhan duoc thong bao khi co bai viet moi ve AI, Marketing va Cong nghe.
          </p>

          <div style="background:#f8fafc;border-radius:12px;padding:20px;margin:0 auto 24px;max-width:360px;border:1px solid #e2e8f0">
            <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#98a2b3;font-weight:600">Ban se nhan duoc</p>
            <table style="width:100%;text-align:left;margin-top:8px">
              <tr><td style="padding:4px 0;color:#344054;font-size:13px">&#10003; Bai viet moi nhat</td></tr>
              <tr><td style="padding:4px 0;color:#344054;font-size:13px">&#10003; Tips & chien luoc AI</td></tr>
              <tr><td style="padding:4px 0;color:#344054;font-size:13px">&#10003; Xu huong cong nghe</td></tr>
            </table>
          </div>

          <a href="${SITE_URL}/blog" style="display:inline-block;padding:12px 32px;background:#155eef;color:white;text-decoration:none;border-radius:10px;font-size:15px;font-weight:600">
            Doc Blog Ngay
          </a>
        </div>
      `),
    });
  } catch (err) {
    console.error("Failed to send newsletter welcome:", err);
  }
}

// ─── 3. New post published → Notify all subscribers ───
export async function sendNewPostNotification(post: {
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category?: string;
}) {
  const t = getTransporter();
  if (!t) return;

  await connectDB();
  const subscribers = await Newsletter.find({ active: true }).select("email").lean();

  if (subscribers.length === 0) return;

  const postUrl = `${SITE_URL}/blog/${post.slug}`;

  const html = brandedEmail(`
    ${post.coverImage ? `<img src="${post.coverImage}" alt="${post.title}" style="width:100%;height:240px;object-fit:cover">` : `<div style="height:8px;background:linear-gradient(135deg,#155eef,#2970ff)"></div>`}

    <div style="padding:32px">
      ${post.category ? `<span style="display:inline-block;padding:4px 12px;background:#eff6ff;color:#155eef;border-radius:20px;font-size:12px;font-weight:600;margin-bottom:12px">${post.category}</span>` : ""}

      <h1 style="margin:0 0 12px;color:#101828;font-size:24px;line-height:1.3">${post.title}</h1>

      <p style="margin:0 0 24px;color:#667085;font-size:15px;line-height:1.7">${post.excerpt || ""}</p>

      <a href="${postUrl}" style="display:inline-block;padding:12px 32px;background:#155eef;color:white;text-decoration:none;border-radius:10px;font-size:15px;font-weight:600">
        Doc Bai Viet
      </a>
    </div>
  `);

  // Send in batches of 10 to avoid SMTP rate limits
  const batchSize = 10;
  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);
    await Promise.allSettled(
      batch.map((sub) =>
        t.sendMail({
          from: `"OPA Blog" <${process.env.SMTP_USER}>`,
          to: sub.email,
          subject: `Bai viet moi: ${post.title}`,
          html,
        })
      )
    );
  }
}
