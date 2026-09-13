const fs = require('fs');
const path = 'supabase/functions/redeem-promotion/index.ts';
let content = fs.readFileSync(path, 'utf8');

// Insert a log before filtering guest entries
content = content.replace(
  'redeemableGuestEntries = ((guestEntries || []) as GuestEntry[])',
  'console.log("[redeem-promotion] All guest entries found:", JSON.stringify(guestEntries));\n      (guestEntries || []).forEach(g => {\n        const err = validateGuestEntryForAccess(g as GuestEntry, accessCode);\n        console.log("[redeem-promotion] Validation for guest entry", g.id, ":", err);\n      });\n      redeemableGuestEntries = ((guestEntries || []) as GuestEntry[])'
);

fs.writeFileSync(path, content);
