Complete guide for managing events, reviewing registrations, and administering the EventX platform.

---

## 🔑 Understanding Roles

### Admin (Normal Admin)
**Permissions:**
- ✅ Create events
- ✅ Edit/delete **own** events only
- ✅ Build custom forms for **own** events
- ✅ View participants for **own** events
- ✅ Approve/reject registrations for **own** events
- ✅ **Set Club Profile:** Can edit their own club's name and logo.
- ❌ Cannot modify other admins' events

### Super Admin
**Permissions:**
- ✅ All Admin permissions
- ✅ Edit/delete **ANY** event (created by any admin)
- ✅ View participants for **ALL** events
- ✅ Approve/reject registrations for **ALL** events
- ✅ Manage admin users
- ✅ System-wide oversight

---

## 🚀 Getting Started

### 1. Logging In

1. Navigate to `/admin/login`
2. Enter your admin email and password
3. Click **"Login"**
4. You'll be redirected to the Admin Dashboard

### 2. Admin Dashboard Overview

The dashboard shows:
- **My Events** - Number of events you created (or all events for Super Admin)
- **Active Events** - Currently running events
- **Total Registrations** - All participant registrations
- **Pending Approvals** - Registrations awaiting your review

### 3. Set Up Your Club Profile (One-Time Setup)

1. After logging in, click **"Club Profile"** in the navigation bar. (Super Admins will not see this, as they don't have a single club).
2. Enter your **Club Name** (e.g., "Computer Society").
3. Upload your **Club Logo**.
4. Click **"Save Profile"**.
5. This name and logo will now appear on the homepage and on all events you create.

---

## 📅 Event Management

### Creating a New Event (Draft/Publish Workflow)

This is a 3-step process: Create, Build Form, and Publish.

**Step 1: Create the Event (as a Draft)**
1.  **Navigate to Events**
    * Dashboard → **"Manage Events"** → **"Create Event"**
2.  **Fill Event Details**
    * Fill in Title, Description, Dates, and Banner.
    * **Auto-Save:** Your progress is automatically saved in your browser. If you refresh, the data will still be there.
    * **Leave "Event is Active" UNCHECKED.** This keeps it a draft.
3.  **Save Draft**
    * Click **"Create Event"**.
    * You'll be redirected to the events list. Your new event will be visible here with an "Inactive" badge. Public users cannot see it yet.

**Step 2: Build the Registration Form**
1.  On the "Manage Events" page, find your new draft event.
2.  Click the **"Form"** button.
3.  **Add Form Fields** using the **"Add Field Here"** buttons.
4.  **Reorder Fields** using the "Move Up" and "Move Down" arrows on each field card.
5.  **Auto-Save:** Your form structure is also auto-saved as you work.
6.  Click **"Save Form to Database"** when you are finished.

**Step 3: Publish the Event**
1.  Go back to the "Manage Events" page.
2.  Click the **"Edit"** button on your draft event.
3.  Scroll down and check the **"Event is Active (Publicly Visible)"** box.
4.  Click **"Update Event"**.

Your event is now **published** and visible to the public on the homepage and events page.

### Editing Events

1. Navigate to **"Manage Events"**.
2. Click **"Edit"** on the event card.
3. Modify event details. Your changes are auto-saved to your browser.
4. Click **"Update Event"** to save changes to the database.

**Note:** Only the event creator or Super Admin can edit events.

### Deleting Events

1. Navigate to **"Manage Events"**.
2. Click **"Delete"** on the event card.
3. Confirm deletion.
4. Event and all associated data will be removed.

⚠️ **Warning:** Deletion is permanent and cannot be undone!

---

## 👥 Registration Management

### Viewing Pending Registrations

1. **From Dashboard**
   * Click **"Review Registrations"** card
   * Or click **"Review Now"** on the pending approvals alert
2.  **Review Participant Details**
    * Click the **"View Details"** button on any registration.
    * A dialog will appear showing the participant's submissions.
    * **Note:** The fields are now displayed with their **proper labels** (e.g., "Team Name") and are shown in the **same order** you created in the Form Builder.

### Approving Registrations

1. Find the pending registration.
2. Review participant responses in the "View Details" dialog.
3. Click the green **"Approve"** button.
4. Participant receives an approval email automatically (if configured).

### Rejecting Registrations

1. Find the pending registration.
2. Review the responses.
3. Click the red **"Reject"** button.
4. Participant receives a rejection email (if configured).

### Viewing Event Participants

1. **Navigate to Events**
2. Click **"Participants"** on the event card.
3. View all **approved** registrations for that event.
4. **Export to CSV:**
   - Click **"Export CSV"** button.
   - This downloads a CSV file containing all approved participants' data, with columns matching your form's field labels.

---

## ⚡ Best Practices

### Event Creation
1.  **Draft First:** Always create events with "Event is Active" unchecked.
2.  **Build Form:** Go to "Form" and build the registration form.
3.  **Test:** Review the form yourself.
4.  **Publish:** Go to "Edit" and check "Event is Active" only when it's 100% ready.

### Registration Review
1.  **Timely Reviews:** Review registrations promptly.
2.  **Use "View Details":** Always check the details dialog to see the full, ordered submission before approving or rejecting.

---

## 🔒 Security and Privacy

- Participant data is confidential.
- Use CSV export responsibly.
- Do not share your admin credentials.

---

## 🛠️ Troubleshooting

### Can't Edit/Delete an Event
**Problem:** Edit/Delete buttons are disabled
**Solution:** - You can only edit/delete your own events (unless Super Admin).

### Form Not Saving
**Problem:** My form fields disappeared after a refresh.
**Solution:**
- This should no longer happen. Form data is auto-saved to your browser's session storage.
- **Remember:** You must still click **"Save Form to Database"** (on Form Builder) or **"Update Event"** (on Edit Event page) to make your changes permanent. The auto-save is just a backup.

---

## 📈 Event Workflow (Lifecycle)

1. **Setup (One-Time)**
   - ✅ Log in.
   - ✅ Go to "Club Profile" and set your club name and logo.
2. **Planning Phase**
   - ✅ Create new event (leave "Active" unchecked).
   - ✅ Go to "Form Builder" for the event, add fields, and save.
   - ✅ Go to "Edit Event", check **"Event is Active"**, and save.
3. **Registration Phase**
   - ✅ Monitor new registrations in "Review Registrations".
   - ✅ Approve/reject participants.
4. **Post-Event**
   - ✅ Go to "Edit Event", uncheck "Registration is Open".
   - ✅ Go to "Participants" page to view and export the final list.

---

## 📞 Getting Help

### For Technical Issues
- Check DEVELOPER_GUIDE.md for technical details
- Review troubleshooting section
- Contact system administrator

### For Policy Questions
- Contact your organization's leadership
- Review institutional guidelines
- Consult with co-admins

---

**Happy Event Managing! 🎉**

For platform support, refer to DEVELOPER_GUIDE.md or contact your system administrator.
3. DEVELOPER_GUIDE.md
I've replaced "IEEE" with "EventX" or generic terms, and updated the footer.

Markdown

# EventX Platform - Developer Guide

## 🛠️ Technical Documentation

Complete technical reference for developers working on the EventX platform.

---

## 📚 Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Setup & Installation](#setup--installation)
4. [Database Schema](#database-schema)
5. [API Documentation](#api-documentation)
6. [Authentication & Authorization](#authentication--authorization)
7. [Features Implementation](#features-implementation)
8. [Deployment](#deployment)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **React:** 18
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI)
- **State Management:** React Hooks, Context API
- **Form Handling:** React State (with Session Storage auto-save)
- **Date Handling:** date-fns, date-fns-tz

### Backend
- **API:** Next.js API Routes (catch-all route)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Email:** Supabase Edge Functions (optional)

### DevOps
- **Version Control:** Git
- **Hosting:** Vercel (or any Node.js host)
- **Package Manager:** Yarn

---