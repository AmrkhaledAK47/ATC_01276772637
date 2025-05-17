#!/bin/bash

# EventHub Auth Testing Script
# This script helps test various authentication flows in the EventHub application

# Set text colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# API endpoint
API_URL="http://localhost:3000/api"
FRONTEND_URL="http://localhost:8080"

# Test user credentials
TEST_EMAIL="test.user@example.com"
TEST_PASSWORD="SecurePassword123!"
TEST_NAME="Test User"

# Function to print section headers
print_header() {
  echo
  echo -e "${BLUE}==================================================${NC}"
  echo -e "${BLUE}   $1${NC}"
  echo -e "${BLUE}==================================================${NC}"
  echo
}

# Function to print test step
print_step() {
  echo -e "${YELLOW}➤ $1${NC}"
}

# Function to print success message
print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error message
print_error() {
  echo -e "${RED}✗ $1${NC}"
}

# Function to wait for user confirmation
wait_confirmation() {
  echo
  read -p "Press Enter to continue..."
  echo
}

print_header "EventHub Authentication Testing Utility"
echo "This utility will help you test all authentication flows in the EventHub application."
echo "Please ensure both frontend and backend servers are running before proceeding."
echo

# Initial check to see if API is up
print_step "Checking if API server is running..."
if curl -s "$API_URL/health" > /dev/null; then
  print_success "API is up and running!"
else
  print_error "Cannot reach API at $API_URL. Is the backend server running?"
  echo "Please start the backend server with: cd backend && npm run start:dev"
  exit 1
fi

# Check if frontend is running
print_step "Checking if frontend server is running..."
if curl -s "$FRONTEND_URL" > /dev/null; then
  print_success "Frontend is up and running!"
else
  print_error "Cannot reach frontend at $FRONTEND_URL. Is the frontend server running?"
  echo "Please start the frontend server with: cd frontend && npm run dev"
  exit 1
fi

print_header "TEST 1: Email Registration and Verification Flow"
echo "Manual steps to follow:"
echo "1. Open the frontend in your browser: $FRONTEND_URL/auth?tab=register"
echo "2. Fill in registration details:"
echo "   - Full Name: $TEST_NAME"
echo "   - Email: $TEST_EMAIL"
echo "   - Password: $TEST_PASSWORD"
echo "3. Check 'I agree to the Terms of Service and Privacy Policy'"
echo "4. Click 'Create account'"
echo
echo "After completing the form:"
print_step "Let's retrieve the OTP from the development API..."

# Wait for user to complete the registration form
wait_confirmation

# Get the latest OTP for the user
OTP_RESPONSE=$(curl -s "$API_URL/auth/dev/latest-otp/$TEST_EMAIL")
OTP=$(echo $OTP_RESPONSE | grep -o '"otp":"[^"]*"' | cut -d'"' -f4)

if [ -n "$OTP" ]; then
  print_success "Retrieved OTP: $OTP"
  echo "5. Enter this OTP on the verification page"
  echo "6. Click 'Verify Email'"
  echo
  echo "You should be redirected to the dashboard after successful verification."
else
  print_error "Failed to retrieve OTP. API response: $OTP_RESPONSE"
fi

wait_confirmation

print_header "TEST 2: Login with Verified Account"
echo "Manual steps to follow:"
echo "1. Open the frontend in your browser: $FRONTEND_URL/auth?tab=login"
echo "2. Enter credentials for the verified account:"
echo "   - Email: $TEST_EMAIL"
echo "   - Password: $TEST_PASSWORD"
echo "3. Check 'Remember me' option (to test localStorage)"
echo "4. Click 'Sign in'"
echo
echo "You should be redirected to the dashboard after successful login."
echo "Check localStorage in your browser to verify the token is stored."

wait_confirmation

print_header "TEST 3: Social Authentication (GitHub)"
echo "Manual steps to follow:"
echo "1. Open the frontend in your browser: $FRONTEND_URL/auth?tab=login"
echo "2. Click the 'GitHub' button"
echo "3. Complete GitHub authentication"
echo "4. After successful login, check that you're redirected back to the dashboard"
echo "5. Verify the user data is retrieved correctly (profile pic, name, etc.)"

wait_confirmation

print_header "TEST 4: Social Authentication (Google)"
echo "Manual steps to follow:"
echo "1. Open the frontend in your browser: $FRONTEND_URL/auth?tab=login"
echo "2. Click the 'Google' button"
echo "3. Complete Google authentication"
echo "4. After successful login, check that you're redirected back to the dashboard"
echo "5. Verify the user data is retrieved correctly (profile pic, name, etc.)"

wait_confirmation

print_header "TEST 5: Forgot Password Flow"
echo "Manual steps to follow:"
echo "1. Open the frontend in your browser: $FRONTEND_URL/auth?tab=login"
echo "2. Click 'Forgot password?'"
echo "3. Enter the email address: $TEST_EMAIL"
echo "4. Click 'Send reset code'"

# Wait for user to complete the password reset request
wait_confirmation

# Get the latest OTP for the user
print_step "Let's retrieve the password reset OTP..."
OTP_RESPONSE=$(curl -s "$API_URL/auth/dev/latest-otp/$TEST_EMAIL")
OTP=$(echo $OTP_RESPONSE | grep -o '"otp":"[^"]*"' | cut -d'"' -f4)

if [ -n "$OTP" ]; then
  print_success "Retrieved password reset OTP: $OTP"
  echo "5. Enter this OTP in the verification code field"
  echo "6. Click 'Verify code'"
  echo "7. Enter a new password: NewSecurePassword456!"
  echo "8. Click 'Reset Password'"
  echo
  echo "After resetting password, try logging in with the new password."
else
  print_error "Failed to retrieve OTP. API response: $OTP_RESPONSE"
fi

wait_confirmation

print_header "TEST 6: Session Storage vs LocalStorage Test"
echo "Manual steps to follow:"
echo "1. Open the frontend in your browser in incognito/private mode: $FRONTEND_URL/auth?tab=login"
echo "2. Enter credentials:"
echo "   - Email: $TEST_EMAIL"
echo "   - Password: $TEST_PASSWORD"
echo "3. DO NOT check 'Remember me' option (to test sessionStorage)"
echo "4. Click 'Sign in'"
echo "5. After login, check sessionStorage in browser dev tools to verify token is stored there"
echo "6. Close the browser window and reopen the app - you should be logged out"
echo 
echo "7. Now login again with 'Remember me' checked"
echo "8. Close the browser window and reopen the app - you should still be logged in"

wait_confirmation

print_header "TEST 7: Logout Functionality"
echo "Manual steps to follow:"
echo "1. Ensure you're logged in to the application"
echo "2. Click on your user profile/avatar"
echo "3. Select 'Logout' from the dropdown menu"
echo "4. Verify you're redirected to the login page"
echo "5. Try accessing a protected route - you should be redirected to login"
echo "6. Check that localStorage/sessionStorage no longer contains the authentication token"

wait_confirmation

print_header "TEST 8: Protected Routes"
echo "Manual steps to follow:"
echo "1. Without being logged in, try to access: $FRONTEND_URL/user/dashboard"
echo "2. You should be redirected to the login page"
echo "3. Log in with user credentials"
echo "4. You should be able to access the user dashboard"
echo "5. Try to access admin route: $FRONTEND_URL/admin"
echo "6. Unless you have admin privileges, you should see an 'Unauthorized' page"

wait_confirmation

print_header "All authentication flows have been tested!"
echo "Make a note of any failures or unexpected behavior to address in the codebase."
echo "Remember to test edge cases like:"
echo "- Entering incorrect passwords multiple times (rate limiting)"
echo "- Using expired OTPs"
echo "- Using incorrect OTPs"
echo "- Cross-user OTP verification attempts"
echo 
print_success "Testing complete!"
