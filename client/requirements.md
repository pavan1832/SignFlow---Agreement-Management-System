## Packages
framer-motion | Page transitions and UI animations
date-fns | Formatting audit log timestamps and created dates
lucide-react | Icons (already in base but explicit check)

## Notes
- File uploads use multipart/form-data for Agreement creation
- Status workflow: Draft -> Sent -> Signed
- Audit logs require fetching nested relations (user details)
- Authentication uses Replit Auth (handled by useAuth hook already provided)
