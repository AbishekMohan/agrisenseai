# Diagnostic script to verify the API routes are correctly updated

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  AgriSense API Routes Diagnostic" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "C:\Users\sande\Downloads\studio-main-with-api\studio-main"

Write-Host "Checking: Chat Route" -ForegroundColor Yellow
$chatPath = Join-Path $projectRoot "src\app\api\chat\route.ts"
$chatContent = Get-Content $chatPath -Raw
if ($chatContent -like "*definePrompt*") {
    Write-Host "  [OK] Contains definePrompt" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] Missing definePrompt" -ForegroundColor Red
}
if ($chatContent -notlike "*import { answerFarmingQuestionsViaChat }*") {
    Write-Host "  [OK] Old import removed" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] Old import still present" -ForegroundColor Red
}
Write-Host ""

Write-Host "Checking: Recommendations Route" -ForegroundColor Yellow
$recPath = Join-Path $projectRoot "src\app\api\recommendations\route.ts"
$recContent = Get-Content $recPath -Raw
if ($recContent -like "*definePrompt*") {
    Write-Host "  [OK] Contains definePrompt" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] Missing definePrompt" -ForegroundColor Red
}
if ($recContent -notlike "*import { generatePersonalizedRecommendations }*") {
    Write-Host "  [OK] Old import removed" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] Old import still present" -ForegroundColor Red
}
Write-Host ""

Write-Host "Checking: Diagnose Route" -ForegroundColor Yellow
$diagPath = Join-Path $projectRoot "src\app\api\diagnose\route.ts"
$diagContent = Get-Content $diagPath -Raw
if ($diagContent -like "*definePrompt*") {
    Write-Host "  [OK] Contains definePrompt" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] Missing definePrompt" -ForegroundColor Red
}
if ($diagContent -notlike "*import { diagnoseCropDisease }*") {
    Write-Host "  [OK] Old import removed" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] Old import still present" -ForegroundColor Red
}
Write-Host ""

Write-Host "Checking: Flow files for 'use server'" -ForegroundColor Yellow
$flow1 = Get-Content (Join-Path $projectRoot "src\ai\flows\answer-farming-questions-via-chat.ts") -Raw
if ($flow1 -notlike "*'use server'*") {
    Write-Host "  [OK] answer-farming-questions-via-chat.ts - use server removed" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] answer-farming-questions-via-chat.ts - still has use server" -ForegroundColor Red
}

$flow2 = Get-Content (Join-Path $projectRoot "src\ai\flows\generate-personalized-recommendations.ts") -Raw
if ($flow2 -notlike "*'use server'*") {
    Write-Host "  [OK] generate-personalized-recommendations.ts - use server removed" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] generate-personalized-recommendations.ts - still has use server" -ForegroundColor Red
}

$flow3 = Get-Content (Join-Path $projectRoot "src\ai\flows\diagnose-crop-disease.ts") -Raw
if ($flow3 -notlike "*'use server'*") {
    Write-Host "  [OK] diagnose-crop-disease.ts - use server removed" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] diagnose-crop-disease.ts - still has use server" -ForegroundColor Red
}
Write-Host ""

Write-Host "Checking: .env file" -ForegroundColor Yellow
$envContent = Get-Content (Join-Path $projectRoot ".env") -Raw
if ($envContent -like "*GOOGLE_GENAI_API_KEY=*") {
    Write-Host "  [OK] GOOGLE_GENAI_API_KEY is set" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] GOOGLE_GENAI_API_KEY not found" -ForegroundColor Red
}
Write-Host ""

Write-Host "================================================" -ForegroundColor Green
Write-Host "Diagnostic complete. All files should be ready." -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
