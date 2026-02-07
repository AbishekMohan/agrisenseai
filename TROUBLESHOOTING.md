# TROUBLESHOOTING GUIDE - Dev Server Crash Fix

## Problem

The dev server starts but crashes silently when trying to access the API routes. This is because the API routes are importing functions marked with `'use server'` directive, which creates a conflict in Next.js API routes.

## Root Cause

```typescript
// ❌ PROBLEMATIC CODE in src/app/api/chat/route.ts
import { answerFarmingQuestionsViaChat } from '@/ai/flows/answer-farming-questions-via-chat';
// This function has 'use server' directive which conflicts with API routes
```

The functions in `src/ai/flows/` use the `'use server'` directive, which is meant for Server Actions (used directly in React components), not for API routes. When API routes try to import these functions, Next.js gets confused and the server crashes.

## Solution

**Replace the API route files with versions that define the Genkit flows directly, instead of importing the server action functions.**

## Step-by-Step Fix

### 1. Replace `src/app/api/chat/route.ts`

Replace the entire content of this file with the fixed version.

**Location:** `C:\Users\sande\Downloads\studio-main-with-api\studio-main\src\app\api\chat\route.ts`

### 2. Replace `src/app/api/recommendations/route.ts`

Replace the entire content of this file with the fixed version.

**Location:** `C:\Users\sande\Downloads\studio-main-with-api\studio-main\src\app\api\recommendations\route.ts`

### 3. Replace `src/app/api/diagnose/route.ts`

Replace the entire content of this file with the fixed version.

**Location:** `C:\Users\sande\Downloads\studio-main-with-api\studio-main\src\app\api\diagnose\route.ts`

## Quick Copy-Paste Instructions

### PowerShell Commands:

```powershell
cd 'C:\Users\sande\Downloads\studio-main-with-api\studio-main'

# Backup the old files first
Copy-Item "src\app\api\chat\route.ts" "src\app\api\chat\route.ts.backup"
Copy-Item "src\app\api\recommendations\route.ts" "src\app\api\recommendations\route.ts.backup"
Copy-Item "src\app\api\diagnose\route.ts" "src\app\api\diagnose\route.ts.backup"

# Then replace with the fixed versions (you'll need to manually copy the content)
```

## After Fixing

Once you've replaced all three files:

1. **Start the dev server:**
   ```powershell
   cd 'C:\Users\sande\Downloads\studio-main-with-api\studio-main'
   npm run dev
   ```

2. **Wait for compilation** (should say "Ready in..." without crashing)

3. **Test the API:**
   ```powershell
   # In a new PowerShell window
   cd 'C:\Users\sande\Downloads\studio-main-with-api\studio-main'
   node test-api.js
   ```

## What Changed

### Before (Problematic):
```typescript
// Importing server action
import { answerFarmingQuestionsViaChat } from '@/ai/flows/answer-farming-questions-via-chat';

export async function POST(request: NextRequest) {
  const response = await answerFarmingQuestionsViaChat({ question, language });
  // ...
}
```

### After (Fixed):
```typescript
// Defining the prompt inline in the API route
const answerFarmingQuestionsPrompt = ai.definePrompt({
  name: 'answerFarmingQuestionsPrompt',
  // ... prompt configuration
});

export async function POST(request: NextRequest) {
  const { output } = await answerFarmingQuestionsPrompt({ question, language });
  // ...
}
```

## Why This Works

- API routes should **directly use Genkit flows**, not import server actions
- Server actions (`'use server'`) are for React components, not API routes
- By defining the prompts directly in the API routes, we avoid the import conflict

## Additional Notes

- The original server action files in `src/ai/flows/` can stay as they are
- The frontend (`src/app/advisor/page.tsx`) can continue using server actions directly
- The API routes are now independent and won't crash the server

## Verification

After applying the fixes, you should see:

```
✓ Ready in 1-2 seconds
○ Compiling /api/chat ...
✓ Compiled /api/chat in XXXms
```

And the test script should run successfully without "connection refused" errors.

## Environment Variables

Don't forget to ensure your `.env` file has the correct API key:

```
GOOGLE_GENAI_API_KEY=your_actual_api_key_here
```

If you're still having issues after the fix, the problem might be:
1. Invalid or missing Google AI API key
2. API key doesn't have proper permissions
3. Network/firewall blocking Google AI API access

Test the API key separately by running a simple Genkit test.
