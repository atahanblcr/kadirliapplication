#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_URL="http://localhost:3000/v1"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYTg0YTc1MTItZmU3NS00Zjc2LTk2OTYtN2M3YmJkMTIyODExIiwicm9sZSI6InN1cGVyX2FkbWluIiwicGhvbmUiOiIwNTU1MTIzNDU2NyIsImlhdCI6MTc3MTg3OTk1MCwiZXhwIjoxNzc0NDcxOTUwfQ.un-nFztYd1NN364yRugg8jMoqYno6trM08W4iw_QhR0"

test_count=0
pass_count=0
fail_count=0

# Test function
test_endpoint() {
  local method=$1
  local endpoint=$2
  local data=$3
  local expected_code=$4
  local description=$5

  test_count=$((test_count + 1))

  if [ -z "$data" ]; then
    response=$(curl -s -X $method "$API_URL$endpoint" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -w "\n%{http_code}" 2>/dev/null)
  else
    response=$(curl -s -X $method "$API_URL$endpoint" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "$data" \
      -w "\n%{http_code}" 2>/dev/null)
  fi

  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)

  if [[ $http_code == $expected_code* ]]; then
    echo -e "${GREEN}✓ $description${NC} [$method $endpoint] ($http_code)"
    pass_count=$((pass_count + 1))
  else
    echo -e "${RED}✗ $description${NC} [$method $endpoint] (Expected: $expected_code, Got: $http_code)"
    fail_count=$((fail_count + 1))
  fi
}

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   KadirliApp Admin Panel - Comprehensive API Test${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

# ============ Dashboard Tests ============
echo -e "${YELLOW}[1/11] Testing Dashboard Module${NC}"
test_endpoint "GET" "/admin/dashboard" "" "200" "Dashboard Stats"
test_endpoint "GET" "/admin/dashboard/chart" "" "200" "Dashboard Chart Data"
echo ""

# ============ Announcements Tests ============
echo -e "${YELLOW}[2/11] Testing Announcements Module${NC}"
test_endpoint "GET" "/admin/announcements?search=&page=1&limit=10" "" "200" "Get Announcements List"
test_endpoint "GET" "/admin/announcements?status=draft" "" "200" "Get Draft Announcements"
echo ""

# ============ Ads Tests ============
echo -e "${YELLOW}[3/11] Testing Ads Module${NC}"
test_endpoint "GET" "/admin/ads?search=&page=1&limit=10" "" "200" "Get Ads List"
test_endpoint "GET" "/admin/ads?status=approved" "" "200" "Get Approved Ads"
echo ""

# ============ Deaths Tests ============
echo -e "${YELLOW}[4/11] Testing Deaths Module${NC}"
test_endpoint "GET" "/admin/deaths?search=&page=1&limit=10" "" "200" "Get Death Notices"
test_endpoint "GET" "/admin/deaths/cemeteries" "" "200" "Get Cemeteries"
test_endpoint "GET" "/admin/deaths/mosques" "" "200" "Get Mosques"
test_endpoint "GET" "/admin/deaths/neighborhoods" "" "200" "Get Death Neighborhoods"
echo ""

# ============ Campaigns Tests ============
echo -e "${YELLOW}[5/11] Testing Campaigns Module${NC}"
test_endpoint "GET" "/admin/campaigns?status=pending&page=1&limit=10" "" "200" "Get Pending Campaigns"
test_endpoint "GET" "/admin/campaigns?status=approved&page=1&limit=10" "" "200" "Get Approved Campaigns"
test_endpoint "GET" "/admin/campaigns/businesses" "" "200" "Get Businesses for Campaign"
echo ""

# ============ Users Tests ============
echo -e "${YELLOW}[6/11] Testing Users Module${NC}"
test_endpoint "GET" "/admin/users?search=&page=1&limit=10" "" "200" "Get Users List"
test_endpoint "GET" "/admin/users?role=super_admin" "" "200" "Get Users by Role"
test_endpoint "GET" "/admin/users?is_banned=false" "" "200" "Get Active Users"
echo ""

# ============ Pharmacy Tests ============
echo -e "${YELLOW}[7/11] Testing Pharmacy Module${NC}"
test_endpoint "GET" "/admin/pharmacy?search=&page=1&limit=10" "" "200" "Get Pharmacies"
test_endpoint "GET" "/admin/pharmacy/schedule?start_date=2026-02-23&end_date=2026-03-23" "" "200" "Get Pharmacy Schedule"
echo ""

# ============ Transport Tests ============
echo -e "${YELLOW}[8/11] Testing Transport Module${NC}"
test_endpoint "GET" "/admin/transport/intercity?search=&page=1&limit=10" "" "200" "Get Intercity Routes"
test_endpoint "GET" "/admin/transport/intracity?search=&page=1&limit=10" "" "200" "Get Intracity Routes"
echo ""

# ============ Neighborhoods Tests ============
echo -e "${YELLOW}[9/11] Testing Neighborhoods Module${NC}"
test_endpoint "GET" "/admin/neighborhoods?search=&page=1&limit=10" "" "200" "Get Neighborhoods"
test_endpoint "GET" "/admin/neighborhoods?type=urban" "" "200" "Get Urban Neighborhoods"
echo ""

# ============ Taxi Tests ============
echo -e "${YELLOW}[10/11] Testing Taxi Module${NC}"
test_endpoint "GET" "/admin/taxi?search=&page=1&limit=10" "" "200" "Get Taxi Drivers"
echo ""

# ============ Summary ============
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "\n${YELLOW}Test Summary:${NC}"
echo -e "  Total Tests: ${BLUE}$test_count${NC}"
echo -e "  Passed: ${GREEN}$pass_count${NC}"
echo -e "  Failed: ${RED}$fail_count${NC}"

if [ $fail_count -eq 0 ]; then
  echo -e "\n${GREEN}✓ All API endpoints are working correctly!${NC}\n"
else
  echo -e "\n${RED}✗ Some tests failed. Check the output above.${NC}\n"
fi

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"
