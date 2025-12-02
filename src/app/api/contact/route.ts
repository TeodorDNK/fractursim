// import { NextResponse } from "next/server";
// import nodemailer from "nodemailer";

// function sanitize(input: string) {
//   return input.replace(/<[^>]*>?/gm, "").trim();
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const email = sanitize(body.email || "");
//     const message = sanitize(body.message || "");
//     const hp = (body.hp || "").trim(); // honeypot anti-spam

//     if (hp) return NextResponse.json({ ok: true }, { status: 200 });

//     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       return NextResponse.json({ ok: false, error: "Email invalid." }, { status: 400 });
//     }
//     if (!message || message.length < 5) {
//       return NextResponse.json({ ok: false, error: "Mesaj prea scurt." }, { status: 400 });
//     }

//     const {
//       SMTP_HOST,
//       SMTP_PORT,
//       SMTP_SECURE,
//       SMTP_USER,
//       SMTP_PASS,
//       CONTACT_TO_EMAIL,
//     } = process.env;
// console.log("SERVER_EMAIL_CONFIG", {
//   SMTP_USER,
//   CONTACT_TO_EMAIL
// });


//     if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !CONTACT_TO_EMAIL) {
//       return NextResponse.json(
//         { ok: false, error: "Config email incompletă pe server." },
//         { status: 500 }
//       );
//     }

//     const transporter = nodemailer.createTransport({
//       host: SMTP_HOST,
//       port: Number(SMTP_PORT),
//       secure: String(SMTP_SECURE).toLowerCase() === "true",
//       auth: { user: SMTP_USER, pass: SMTP_PASS },
//     });

//     // Trimiterea email-ului folosind datele de autentificare Yahoo (SMTP_USER)
//     const info = await transporter.sendMail({
//       from: `"Fracturism Site" <${SMTP_USER}>`, // De la: fracturism.art@yahoo.com
//       to: CONTACT_TO_EMAIL, // Către: fracturism.art@yahoo.com
//       replyTo: email, // Răspunsul se duce la adresa userului
//       subject: `Formular Contact – ${email}`,
//       text: `From: ${email}\n\n${message}`,
//       html: `
//         <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
//           <h2>Mesaj nou de pe site</h2>
//           <p><b>De la:</b> ${email}</p>
//           <p style="white-space:pre-line">${message}</p>
//           <hr/>
//           <small>Fracturism • ${new Date().toLocaleString("ro-RO")}</small>
//         </div>
//       `,
//     });

//     return NextResponse.json({ ok: true, id: info.messageId });
//   } catch (err: any) {
// console.error("CONTACT_API_ERROR", err, err.response, err.responseCode);
//     return NextResponse.json(
//       { ok: false, error: "Nu s-a putut trimite mesajul. Încearcă mai târziu." },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { Resend } from "resend"; // Importă Resend

// Inițializează Resend cu cheia API
const resend = new Resend(process.env.RESEND_API_KEY);

function sanitize(input: string) {
  return input.replace(/<[^>]*>?/gm, "").trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = sanitize(body.email || "");
    const message = sanitize(body.message || "");
    const hp = (body.hp || "").trim(); // honeypot anti-spam

    if (hp) return NextResponse.json({ ok: true }, { status: 200 });

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Email invalid." }, { status: 400 });
    }
    if (!message || message.length < 5) {
      return NextResponse.json({ ok: false, error: "Mesaj prea scurt." }, { status: 400 });
    }

    const {
      CONTACT_TO_EMAIL,
      RESEND_API_KEY,
    } = process.env;

    console.log("CONTACT_RECEIVER", {
      CONTACT_TO_EMAIL
    });


    if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
      return NextResponse.json(
        { ok: false, error: "Config email incompletă (Resend sau Destinație lipsesc)." },
        { status: 500 }
      );
    }

    // Trimiterea simplă, direct la Yahoo
    const response = await resend.emails.send({
      from: 'Fracturism Site <onboarding@resend.dev>', 
      to: CONTACT_TO_EMAIL, 
      subject: `Noul Mesaj Contact de la ${email}`,
      replyTo: email, // Corectat: 'reply_to' -> 'replyTo'
      text: `De la: ${email}\n\nMesaj:\n${message}`, 
    });

    // Verificare pentru eroarea Resend (opțional, dar recomandat)
    if (response.error) {
        console.error("RESEND_API_ERROR", response.error);
        // Tratam eroarea ca pe o eroare de server (500)
        return NextResponse.json(
            { ok: false, error: "Nu s-a putut trimite mesajul din cauza unei erori Resend." },
            { status: 500 }
        );
    }
    
    // Corectat: Acces la ID-ul mesajului
    return NextResponse.json({ ok: true, id: response.data.id }); 
  } catch (err: any) {
    console.error("CONTACT_API_ERROR", err);
    return NextResponse.json(
      { ok: false, error: "Nu s-a putut trimite mesajul. Încearcă mai târziu." },
      { status: 500 }
    );
  }
}