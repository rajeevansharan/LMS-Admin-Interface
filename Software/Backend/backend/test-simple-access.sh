#!/bin/bash

# MPMA Simple API Access Test Script
# This script tests basic API access with JWT token

# Configuration
API_URL="http://localhost:8080"
USERNAME="DEMOLEC"
PASSWORD="DEMO"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== MPMA API Access Test ====${NC}"
echo "Testing with lecturer account: $USERNAME"

# Step 1: Login and get token
echo -e "\n${YELLOW}1. Authenticating with lecturer account...${NC}"
AUTH_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")

# Check if login was successful
if echo "$AUTH_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✓ Authentication successful!${NC}"
    TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"token":"[^"]*' | sed 's/"token":"//')
    echo "Token obtained successfully"
else
    echo -e "${RED}✗ Authentication failed!${NC}"
    echo "$AUTH_RESPONSE"
    exit 1
fi

# Set auth header for future requests
AUTH_HEADER="Authorization: Bearer $TOKEN"

# Step 2: Test a simple API endpoint
echo -e "\n${YELLOW}2. Testing /api/courses endpoint...${NC}"
COURSES_RESPONSE=$(curl -v -X GET "$API_URL/api/courses" \
    -H "$AUTH_HEADER" 2>&1)

echo "Full response:"
echo "$COURSES_RESPONSE"

# Also try to check user profile
echo -e "\n${YELLOW}3. Testing user profile endpoint...${NC}"
PROFILE_RESPONSE=$(curl -v -X GET "$API_URL/api/users/profile" \
    -H "$AUTH_HEADER" 2>&1)

echo "Full response:"
echo "$PROFILE_RESPONSE"

# Try to directly check your AnnouncementController's getAllAnnouncements method
echo -e "\n${YELLOW}4. Testing announcements list endpoint...${NC}"
ALL_ANNOUNCEMENTS_RESPONSE=$(curl -v -X GET "$API_URL/api/announcements" \
    -H "$AUTH_HEADER" 2>&1)

echo "Full response:"
echo "$ALL_ANNOUNCEMENTS_RESPONSE"

echo -e "\n${GREEN}=== Test Complete ===${NC}"