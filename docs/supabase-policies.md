# Supabase Policies

This project expects RLS to enforce the same role boundaries as the server
actions and service helpers. Keep these notes in sync with the active Supabase
project whenever policies change.

## Role Resolution

- `office.id` and `stakeholder.id` are expected to match `auth.users.id`.
- `admin` is an application role used by server-side authorization. If admins
  are stored outside `office` and `stakeholder`, document that table before
  adding admin-scoped RLS rules that depend on database rows.
- Service-role clients may bypass RLS only for account administration flows.
  User-submitted domain mutations should use the normal server client.

## Table Policies

| Table | Required role policies |
| --- | --- |
| `office` | Office users can read and update only their own row. Admin/service-role flows can create, read, update, and delete office rows. Stakeholders may read minimal office identity fields when required for inbox and help request context. |
| `stakeholder` | Stakeholders can read and update only their own row. Admin/service-role flows can create, read, update, and delete stakeholder rows. Office users may read stakeholder context needed for assigned or visible help requests. |
| `crisis` | Office users can create crises with `office_id = auth.uid()`, update/delete their own crises, and read crises visible to their office workflows. Stakeholders can read active crises needed for dashboards, help requests, surveys, and announcements. Admins can read and manage all rows. |
| `announcement` | Office users can create announcements for their own office and update/delete announcements they own. Stakeholders can read announcements tied to visible crises. Admins can read and manage all rows. |
| `survey` | Office users can create, update, close, and read surveys they own. Stakeholders can read active surveys tied to visible crises. Admins can read and manage all rows. |
| `survey_response` | Stakeholders can insert responses only with `stakeholder_id = auth.uid()` and read their own responses. Office users can read responses for surveys they own. Duplicate response prevention should be backed by a unique constraint on `(survey_id, stakeholder_id)`. Admins can read and manage all rows. |
| `help_request` | Stakeholders can create requests with `stakeholder_id = auth.uid()` and read their own requests. Office users can read visible requests and update status/assignment according to office visibility rules. Admins can read and manage all rows. |
| `message` | Stakeholders can read and insert messages only for help requests they own. Office users can read and insert messages only for visible or assigned help requests. Admins can read all rows for moderation/audit workflows. |
| `progress_report` | Office users can create and update reports for crises they own, with `office_id = auth.uid()`. Stakeholders can read reports tied to visible crises. Admins can read and manage all rows. |
| `emergency_contact` | Office users can read and manage contacts for their own office. Stakeholders can read emergency contacts that are intentionally public for stakeholder dashboards. Admins can read and manage all rows. |
| `audit_log` | Authenticated application code can insert audit rows for its actor. Reads should be admin-only unless a narrower audit viewer exists. Updates and deletes should be blocked except for service-role retention jobs. |

## Storage Policies

Receipt uploads use the `receipts` storage bucket. The bucket must exist before
users submit donation survey receipts; application code must not create buckets
during user submissions.

Required `receipts` bucket assumptions:

- Bucket name: `receipts`.
- Public access: currently expected, because receipt URLs are stored via
  `getPublicUrl`. If receipts should be private, replace public URLs with signed
  URL generation and update the read policies.
- Object path: `${stakeholderId}/{timestamp}_receipt.{ext}`.
- Stakeholders can upload only into their own top-level folder, where the folder
  name equals `auth.uid()`.
- Stakeholders can read their own receipts.
- Office users can read receipts attached to survey responses for surveys they
  own.
- Admins or service-role maintenance jobs can read and delete receipt objects.
