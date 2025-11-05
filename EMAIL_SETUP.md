# Email Notification Setup Guide

This guide explains how to set up email notifications for the IEEE Club Hackathon Website using **Supabase Edge Functions**.

## 📧 Email Features

The system sends automated emails for:
1. **Admin Notification** - When a new participant registers (sent to event creator)
2. **Approval Email** - When admin approves a registration (sent to participant)
3. **Rejection Email** - When admin rejects a registration (sent to participant)

## 🚀 Setup Options

### Option A: Supabase Edge Functions (Recommended)

**Steps:**

1. **Install Supabase CLI** (if not already installed)
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

3. **Link your project**
   ```bash
   supabase link --project-ref fyisunazyiumzvpetsei
   ```

4. **Create Edge Function**
   ```bash
   supabase functions new send-email
   ```

5. **Copy the email function code**
   
   Copy the content from `/app/supabase/functions/send-email/index.ts` (see below) into the created function file.

6. **Set secrets** (for email service)
   
   Choose one email provider:
   
   **Using Resend (Recommended - 100 free emails/day)**
   ```bash
   supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxx
   ```
   
   **Using SendGrid**
   ```bash
   supabase secrets set SENDGRID_API_KEY=SG.xxxxxxxxxxxx
   ```

7. **Deploy the function**
   ```bash
   supabase functions deploy send-email
   ```

8. **Update environment variables**
   
   Add to your `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_FUNCTION_URL=https://fyisunazyiumzvpetsei.supabase.co/functions/v1/send-email
   ```

### Option B: External Email Service (Alternative)

If you prefer to use an external email service directly:

1. **Using Resend**
   ```bash
   npm install resend
   ```
   
   Add to `.env.local`:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxx
   EMAIL_FROM=noreply@yourdomain.com
   ```

2. **Using SendGrid**
   ```bash
   npm install @sendgrid/mail
   ```
   
   Add to `.env.local`:
   ```env
   SENDGRID_API_KEY=SG.xxxxxxxxxxxx
   EMAIL_FROM=noreply@yourdomain.com
   ```

3. **Update `/app/lib/email.js`**
   
   Replace the `sendEmail` function with direct API integration (examples provided in the file).

## 📝 Supabase Edge Function Code

Create this file: `/app/supabase/functions/send-email/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }

  try {
    const { to, subject, html, from } = await req.json()

    // Validate inputs
    if (!to || !subject || !html) {
      throw new Error('Missing required fields: to, subject, html')
    }

    const fromEmail = from || 'IEEE Club <noreply@ieeeclub.com>'

    // Choose email service based on available API key
    let result
    
    if (RESEND_API_KEY) {
      // Use Resend
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject,
          html
        })
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Resend API error: ${error}`)
      }

      result = await response.json()
    } else if (SENDGRID_API_KEY) {
      // Use SendGrid
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SENDGRID_API_KEY}`
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: fromEmail.match(/<(.+)>/)?.[1] || fromEmail },
          subject,
          content: [{ type: 'text/html', value: html }]
        })
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`SendGrid API error: ${error}`)
      }

      result = { success: true }
    } else {
      throw new Error('No email service configured. Set RESEND_API_KEY or SENDGRID_API_KEY')
    }

    return new Response(
      JSON.stringify({ success: true, result }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
})
```

## 🔑 Getting API Keys

### Resend (Recommended)
1. Go to https://resend.com
2. Sign up for free account
3. Navigate to API Keys
4. Create new API key
5. Copy the key (starts with `re_`)

### SendGrid
1. Go to https://sendgrid.com
2. Sign up for free account
3. Navigate to Settings > API Keys
4. Create new API key with "Mail Send" permissions
5. Copy the key (starts with `SG.`)

## ✅ Testing

After setup, test emails by:

1. Register as a participant for an event
2. Check admin email for new registration notification
3. As admin, approve/reject the registration
4. Check participant email for approval/rejection notification

## 🐛 Troubleshooting

**Emails not sending:**
- Check Supabase Functions logs: `supabase functions logs send-email`
- Verify API keys are set correctly
- Check spam folder for received emails
- Verify email addresses are correct

**Edge function not deployed:**
- Run `supabase functions list` to see deployed functions
- Redeploy: `supabase functions deploy send-email --no-verify-jwt`

**CORS errors:**
- Edge functions should allow all origins (`*`) for development
- For production, update CORS policy in the function

## 📚 Additional Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Resend Docs](https://resend.com/docs)
- [SendGrid Docs](https://docs.sendgrid.com/)

---

**Note:** Email sending is currently logged to console if no service is configured. The registration system will work normally even without emails set up.
