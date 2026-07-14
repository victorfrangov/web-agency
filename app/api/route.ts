import { NextResponse } from "next/server"

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const SMTP2GO_API_KEY = process.env.SMTP2GO_API_KEY
    const SMTP2GO_FROM = process.env.SMTP2GO_FROM || "victor.frangov@situsdigital.com"
    const SMTP2GO_TO = process.env.SMTP2GO_TO || "victor.frangov@situsdigital.com"

    if (!SMTP2GO_API_KEY) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
    }

    const html = `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
    `

    const res = await fetch("https://api.smtp2go.com/v3/email/send", {
      method: "POST",
      headers: {
        "X-Smtp2go-Api-Key": SMTP2GO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: SMTP2GO_FROM,
        to: [SMTP2GO_TO],
        subject: `Website inquiry — ${name}`,
        html_body: html,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: "Failed to send", detail: text }, { status: res.status })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}