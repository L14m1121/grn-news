import { db } from "../../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import nodemailer from "nodemailer";

/**
 * Sends an email blast to all newsletter subscribers.
 * Expected body: { title: string, link: string }
 */
export async function POST(req) {
  try {
    const { title, link } = await req.json();

    // Get all subscribers from Firestore
    const snapshot = await getDocs(collection(db, "newsletter"));
    const emails = snapshot.docs.map((doc) => doc.data().email).filter(Boolean);

    if (!emails.length) {
      return new Response("No subscribers found", { status: 200 });
    }

    // 🔐 Gmail SMTP setup — use an App Password (not your main Gmail pw)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 💌 Email template
    const mailOptions = {
      from: `"GRN Daily" <${process.env.EMAIL_USER}>`,
      to: emails,
      subject: `🗞️ New Story: ${title}`,
      html: `
        <div style="font-family:sans-serif;padding:20px;">
          <h2 style="color:#008c5e;">GRN Daily Update</h2>
          <p>A new story was just published:</p>
          <h3>${title}</h3>
          <p><a href="${link}" target="_blank" style="color:#008c5e;">Read Now →</a></p>
          <hr/>
          <p style="font-size:12px;color:#888;">You’re receiving this because you subscribed to GRN Daily updates.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return new Response("Emails sent successfully", { status: 200 });
  } catch (err) {
    console.error("❌ Newsletter API Error:", err);
    return new Response("Failed to send newsletter", { status: 500 });
  }
}
