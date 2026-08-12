"""
TV2 riport-email küldő.

Ezt egy repository_dispatch trigger indítja el (a weboldal "Küldés" gombja
hívja meg a GitHub API dispatches végpontját). A payload adatait a workflow
egy JSON fájlba írja ki (payload.json), ezt a script itt olvassa be - így
nem kell a payload-ot GitHub Actions env változóként átadni (ami a speciális
karaktereknél/hosszú szövegnél problémás lehetne).
"""

import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timezone

EMAIL_KULDO = os.environ.get("EMAIL_KULDO")
EMAIL_JELSZO = os.environ.get("EMAIL_JELSZO")

HISTORY_FILE = "tv2_riport/data/sent_emails.json"
PAYLOAD_FILE = "tv2_riport/payload.json"


def load_history():
    if not os.path.exists(HISTORY_FILE):
        return []
    try:
        with open(HISTORY_FILE, encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return []


def save_history(history):
    os.makedirs(os.path.dirname(HISTORY_FILE), exist_ok=True)
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=2, ensure_ascii=False)


def build_body(event_title, event_url, extra_info):
    lines = []
    if event_title:
        lines.append(f"VÉSZ esemény: {event_title}")
        if event_url:
            lines.append(f"Forrás: {event_url}")
        lines.append("")
    if extra_info:
        lines.append("Egyéb információ:")
        lines.append(extra_info)
    return "\n".join(lines)


def send_email(subject, body, recipients):
    msg = MIMEMultipart()
    msg["From"] = EMAIL_KULDO
    msg["To"] = EMAIL_KULDO  # magunknak, a többiek BCC-ben
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain", "utf-8"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(EMAIL_KULDO, EMAIL_JELSZO)
        # BCC-ben megy mindenkinek, hogy a címzettek ne lássák egymás címét
        server.sendmail(EMAIL_KULDO, [EMAIL_KULDO] + recipients, msg.as_string())


def main():
    if not EMAIL_KULDO or not EMAIL_JELSZO:
        print("❌ HIBA: EMAIL_KULDO / EMAIL_JELSZO nincs beállítva.")
        raise SystemExit(1)

    with open(PAYLOAD_FILE, encoding="utf-8") as f:
        payload = json.load(f)

    event_title = payload.get("event_title", "")
    event_url = payload.get("event_url", "")
    extra_info = payload.get("extra_info", "")
    recipients = payload.get("recipients", [])

    if not recipients:
        print("❌ HIBA: nincs kiválasztott címzett.")
        raise SystemExit(1)

    subject = f"TV2 riport: {event_title}" if event_title else "TV2 riport"
    body = build_body(event_title, event_url, extra_info)

    print(f"📧 Küldés {len(recipients)} címzettnek...")
    send_email(subject, body, recipients)
    print("✅ Email elküldve.")

    history = load_history()
    history.insert(0, {
        "sent_at": datetime.now(timezone.utc).isoformat(),
        "event_title": event_title,
        "event_url": event_url,
        "extra_info": extra_info,
        "recipients": recipients,
        "subject": subject,
        "body": body,
    })
    # Csak az utolsó 200 emailt tartjuk meg, hogy a fájl ne nőjön a végtelenségig
    history = history[:200]
    save_history(history)
    print(f"✅ Előzmény mentve ({len(history)} bejegyzés).")


if __name__ == "__main__":
    main()
