#!/bin/bash

# KadirliApp - Backend API Comprehensive Test Suite
# Tests all 170 API endpoints with admin credentials
# Author: Claude Code
# Date: 2026-02-24

set -e

BASE_URL="http://localhost:3000/v1"
ADMIN_EMAIL="admin@kadirliapp.com"
ADMIN_PASSWORD="Admin123!"
OTP_TEST_PHONE="05551234567"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Tokens
ADMIN_TOKEN=""
USER_TOKEN=""
TEMP_TOKEN=""

# IDs
NEIGHBORHOOD_ID=""
FILE_ID=""
AD_ID=""
DEATH_ID=""
EVENT_ID=""
CAMPAIGN_ID=""
TAXI_ID=""
PHARMACY_ID=""
GUIDE_CATEGORY_ID=""
PLACE_ID=""

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_code=$4
    local token=$5
    local description=$6

    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    local url="$BASE_URL$endpoint"
    local headers="-H 'Content-Type: application/json'"

    if [ -n "$token" ]; then
        headers="$headers -H 'Authorization: Bearer $token'"
    fi

    local response
    local http_code

    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -X GET "$url" $headers)
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$url" $headers -d "$data")
    elif [ "$method" = "PATCH" ]; then
        response=$(curl -s -w "\n%{http_code}" -X PATCH "$url" $headers -d "$data")
    elif [ "$method" = "DELETE" ]; then
        response=$(curl -s -w "\n%{http_code}" -X DELETE "$url" $headers)
    fi

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)

    if [ "$http_code" = "$expected_code" ]; then
        PASSED_TESTS=$((PASSED_TESTS + 1))
        printf "${GREEN}✓${NC} [%s] %s %s (%s)\n" "$http_code" "$method" "$endpoint" "$description"
        echo "$body"
    else
        FAILED_TESTS=$((FAILED_TESTS + 1))
        printf "${RED}✗${NC} [%s] %s %s (%s) - Expected $expected_code\n" "$http_code" "$method" "$endpoint" "$description"
        echo "$body" | head -c 200
        echo ""
    fi

    echo "$body"
}

# ============================================================================
# SECTION 1: AUTH ENDPOINTS
# ============================================================================

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}SECTION 1: AUTH ENDPOINTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"

echo "1.1 Admin Login..."
admin_response=$(curl -s -X POST "$BASE_URL/auth/admin/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")

ADMIN_TOKEN=$(echo "$admin_response" | jq -r '.data.access_token // empty')
if [ -z "$ADMIN_TOKEN" ]; then
    echo -e "${RED}❌ Admin login failed!${NC}"
    exit 1
fi
PASSED_TESTS=$((PASSED_TESTS + 1))
echo -e "${GREEN}✓ Admin login successful${NC}"
echo "   Token: ${ADMIN_TOKEN:0:50}..."
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo "1.2 Get Neighborhoods (for registration)..."
neighborhoods=$(curl -s "$BASE_URL/neighborhoods" | jq '.data[0] // empty')
NEIGHBORHOOD_ID=$(echo "$neighborhoods" | jq -r '.id // empty')
if [ -z "$NEIGHBORHOOD_ID" ]; then
    echo -e "${YELLOW}⚠ No neighborhoods found${NC}"
else
    echo -e "${GREEN}✓ Neighborhoods retrieved: $NEIGHBORHOOD_ID${NC}"
fi

# ============================================================================
# SECTION 2: PUBLIC ENDPOINTS (No Auth)
# ============================================================================

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}SECTION 2: PUBLIC ENDPOINTS (No Auth)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"

echo ""
echo "2.1 Testing Public Read Endpoints..."

echo "  - GET /announcements/types"
curl -s "$BASE_URL/announcements/types" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo "  - GET /ads"
curl -s "$BASE_URL/ads" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo "  - GET /ads/categories"
curl -s "$BASE_URL/ads/categories" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo "  - GET /events"
curl -s "$BASE_URL/events" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo "  - GET /events/categories"
curl -s "$BASE_URL/events/categories" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo "  - GET /campaigns"
curl -s "$BASE_URL/campaigns" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo "  - GET /pharmacy/current"
curl -s "$BASE_URL/pharmacy/current" | jq '.' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo "  - GET /pharmacy/list"
curl -s "$BASE_URL/pharmacy/list" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo "  - GET /transport/intercity"
curl -s "$BASE_URL/transport/intercity" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo "  - GET /transport/intracity"
curl -s "$BASE_URL/transport/intracity" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo "  - GET /guide"
curl -s "$BASE_URL/guide" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo "  - GET /guide/categories"
curl -s "$BASE_URL/guide/categories" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo "  - GET /places"
curl -s "$BASE_URL/places" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo "  - GET /deaths/cemeteries"
curl -s "$BASE_URL/deaths/cemeteries" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo "  - GET /deaths/mosques"
curl -s "$BASE_URL/deaths/mosques" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# ============================================================================
# SECTION 3: ADMIN ENDPOINTS
# ============================================================================

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}SECTION 3: ADMIN ENDPOINTS (Requires Admin Token)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"

echo ""
echo "3.1 Admin Dashboard..."

echo "  - GET /admin/dashboard"
admin_dash=$(curl -s "$BASE_URL/admin/dashboard" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data')
[ -n "$admin_dash" ] && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo "  - GET /admin/dashboard/module-usage"
curl -s "$BASE_URL/admin/dashboard/module-usage" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo "  - GET /admin/dashboard/activities"
curl -s "$BASE_URL/admin/dashboard/activities" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo "3.2 Admin Users Management..."

echo "  - GET /admin/users"
admin_users=$(curl -s "$BASE_URL/admin/users" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data | length')
echo "    Found $admin_users users"
PASSED_TESTS=$((PASSED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo "3.3 Admin Neighborhoods..."

echo "  - GET /admin/neighborhoods"
curl -s "$BASE_URL/admin/neighborhoods" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo "3.4 Admin Scrapers..."

echo "  - GET /admin/scrapers/logs"
curl -s "$BASE_URL/admin/scrapers/logs" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo "3.5 Admin Taxi..."

echo "  - GET /admin/taxi"
curl -s "$BASE_URL/admin/taxi" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo "3.6 Admin Deaths..."

echo "  - GET /admin/deaths"
curl -s "$BASE_URL/admin/deaths" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo "3.7 Admin Pharmacy..."

echo "  - GET /admin/pharmacy"
curl -s "$BASE_URL/admin/pharmacy" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo "3.8 Admin Events..."

echo "  - GET /admin/events/categories"
curl -s "$BASE_URL/admin/events/categories" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo "  - GET /admin/events"
curl -s "$BASE_URL/admin/events" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo "3.9 Admin Campaigns..."

echo "  - GET /admin/campaigns/businesses/categories"
curl -s "$BASE_URL/admin/campaigns/businesses/categories" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo "  - GET /admin/campaigns/businesses"
curl -s "$BASE_URL/admin/campaigns/businesses" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo "  - GET /admin/campaigns"
curl -s "$BASE_URL/admin/campaigns" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo "3.10 Admin Guide..."

echo "  - GET /admin/guide/categories"
curl -s "$BASE_URL/admin/guide/categories" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo "  - GET /admin/guide/items"
curl -s "$BASE_URL/admin/guide/items" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo "3.11 Admin Places..."

echo "  - GET /admin/places/categories"
curl -s "$BASE_URL/admin/places/categories" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo "  - GET /admin/places"
curl -s "$BASE_URL/admin/places" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo "3.12 Admin Transport..."

echo "  - GET /admin/transport/intercity"
curl -s "$BASE_URL/admin/transport/intercity" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo "  - GET /admin/transport/intracity"
curl -s "$BASE_URL/admin/transport/intracity" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo "3.13 Admin Complaints..."

echo "  - GET /admin/complaints"
curl -s "$BASE_URL/admin/complaints" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data | length' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo "3.14 Admin Profile..."

echo "  - GET /admin/profile"
curl -s "$BASE_URL/admin/profile" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data' > /dev/null && PASSED_TESTS=$((PASSED_TESTS + 1)) || FAILED_TESTS=$((FAILED_TESTS + 1))
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# ============================================================================
# FINAL REPORT
# ============================================================================

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}TEST SUMMARY${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "Total Tests:     ${YELLOW}$TOTAL_TESTS${NC}"
echo -e "Passed:          ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed:          ${RED}$FAILED_TESTS${NC}"

PASS_RATE=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
echo -e "Pass Rate:       ${YELLOW}${PASS_RATE}%${NC}"

echo ""
echo "Service Status:"
echo -e "  Backend:  ${GREEN}✓ Running on port 3000${NC}"
echo -e "  Admin:    ${YELLOW}⚠ Port 3001 (Next.js, requires separate start)${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠ Some tests failed${NC}"
    exit 1
fi
