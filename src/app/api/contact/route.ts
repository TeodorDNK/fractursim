
// import { NextResponse } from "next/server";
// import { Resend } from "resend"; // Importă Resend

// // Inițializează Resend cu cheia API
// const resend = new Resend(process.env.RESEND_API_KEY);

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
//       CONTACT_TO_EMAIL,
//       RESEND_API_KEY,
//     } = process.env;

//     console.log("CONTACT_RECEIVER", {
//       CONTACT_TO_EMAIL
//     });


//     if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
//       return NextResponse.json(
//         { ok: false, error: "Config email incompletă (Resend sau Destinație lipsesc)." },
//         { status: 500 }
//       );
//     }

//     // Trimiterea simplă, direct la Yahoo
//     const response = await resend.emails.send({
//       from: 'Fracturism Site <onboarding@resend.dev>', 
//       to: CONTACT_TO_EMAIL, 
//       subject: `Noul Mesaj Contact de la ${email}`,
//       replyTo: email, // Corectat: 'reply_to' -> 'replyTo'
//       text: `De la: ${email}\n\nMesaj:\n${message}`, 
//     });

//     // Verificare pentru eroarea Resend (opțional, dar recomandat)
//     if (response.error) {
//         console.error("RESEND_API_ERROR", response.error);
//         // Tratam eroarea ca pe o eroare de server (500)
//         return NextResponse.json(
//             { ok: false, error: "Nu s-a putut trimite mesajul din cauza unei erori Resend." },
//             { status: 500 }
//         );
//     }
    
//     // Corectat: Acces la ID-ul mesajului
//     return NextResponse.json({ ok: true, id: response.data.id }); 
//   } catch (err: any) {
//     console.error("CONTACT_API_ERROR", err);
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

    // Anti-spam check (silent success for bots)
    if (hp) return NextResponse.json({ ok: true }, { status: 200 });

    // Validation errors (must be hardcoded on server)
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 }); // În loc de "Email invalid."
    }
    if (!message || message.length < 5) {
      return NextResponse.json({ ok: false, error: "Message too short." }, { status: 400 }); // În loc de "Mesaj prea scurt."
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
        { ok: false, error: "Incomplete email configuration (Resend or Destination missing)." }, // În loc de "Config email incompletă..."
        { status: 500 }
      );
    }

    // Trimiterea simplă, direct la destinație
    const response = await resend.emails.send({
      from: 'Fracturism Site <onboarding@resend.dev>', 
      to: CONTACT_TO_EMAIL, 
      subject: `New Contact Message from ${email}`, // În loc de "Noul Mesaj Contact..."
      replyTo: email,
      text: `From: ${email}\n\nMessage:\n${message}`, 
    });

    // Verificare pentru eroarea Resend
    if (response.error) {
        console.error("RESEND_API_ERROR", response.error);
        return NextResponse.json(
            { ok: false, error: "Could not send message due to a Resend error." }, // În loc de "Nu s-a putut trimite mesajul..."
            { status: 500 }
        );
    }
    
    return NextResponse.json({ ok: true, id: response.data.id }); 
  } catch (err: any) {
    console.error("CONTACT_API_ERROR", err);
    return NextResponse.json(
      { ok: false, error: "Could not send message. Please try again later." }, // În loc de "Nu s-a putut trimite mesajul. Încearcă mai târziu."
      { status: 500 }
    );
  }
}