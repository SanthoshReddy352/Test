## 🚀 Setup & Installation

(See `SETUP_INSTRUCTIONS.md` for a more user-friendly guide)

1.  **Clone, `yarn install`**
2.  **Environment:** Create `.env.local` (see `.env.example`).
3.  **Database:** Run `SUPABASE_SETUP.sql` in your Supabase SQL Editor.
4.  **Admin User:** Create a user in Supabase Auth, then **manually add their UUID** to the `public.admin_users` table.
    ```sql
    INSERT INTO public.admin_users (user_id, role)
    VALUES ('your-auth-user-id', 'super_admin');
    ```
5.  **Run:** `yarn dev`.

---

## 🗄️ Database Schema

### Tables

#### `events`
Stores hackathon/event information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Event name |
| description | TEXT | Event details |
| banner_url | TEXT | Banner image URL |
| event_date | TIMESTAMPTZ | Event start |
| event_end_date | TIMESTAMPTZ | Event end |
| is_active | BOOLEAN | **Defaults to `false`**. Acts as "is_published". |
| registration_open | BOOLEAN | Registration toggle |
| registration_start | TIMESTAMPTZ | Registration opens |
| registration_end | TIMESTAMPTZ | Registration closes |
| form_fields | JSONB | Custom form schema |
| created_by | UUID | Admin who created event |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

#### `participants`
Stores event registrations.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| event_id | UUID | FK to events |
| user_id | UUID | FK to auth.users |
| responses | JSONB | Form submission data (key is `field.id`) |
| status | TEXT | pending/approved/rejected |
| reviewed_by | UUID | Admin who reviewed |
| reviewed_at | TIMESTAMPTZ | Review timestamp |
| created_at | TIMESTAMPTZ | Registration timestamp |

#### `admin_users`
Defines admin roles and club info.

| Column | Type | Description |
|--------|------|-------------|
| user_id | UUID | PK, FK to auth.users |
| role | TEXT | 'admin' or 'super_admin' |
| club_name | TEXT | **NEW:** Club's public display name |
| club_logo_url | TEXT | **NEW:** Public URL for club's logo |
| created_at | TIMESTAMPTZ | Creation timestamp |

#### `profiles`
User profile information.
...

#### `contact_submissions`
Contact form submissions.
...

### JSONB Schema Examples

#### `form_fields` (in `events` table)
```json
[
  {
    "id": "field-1-uuid",
    "type": "text",
    "label": "Full Name",
    "required": true
  },
  {
    "id": "field-2-uuid",
    "type": "dropdown",
    "label": "Team Size",
    "required": true,
    "options": ["1-2", "3-4", "5+"]
  }
]
responses (in participants table)
Note: The keys in this JSON object must match the id from the form_fields array.

JSON

{
  "field-1-uuid": "John Doe",
  "field-2-uuid": "3-4"
}