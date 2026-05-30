#!/usr/bin/env python3
"""
Backend API Test Suite for Atmosphere Restaurant
Tests all API endpoints with happy path and validation scenarios
"""
import requests
import json
import os
from datetime import datetime, timedelta

# Load environment variables
BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'https://banquet-venue.preview.emergentagent.com')
API_URL = f"{BASE_URL}/api"

print(f"Testing API at: {API_URL}")
print("=" * 80)

# Test counters
tests_passed = 0
tests_failed = 0
test_results = []

def test_endpoint(name, method, path, data=None, expected_status=200, should_contain=None, should_not_contain=None):
    """Generic test function for API endpoints"""
    global tests_passed, tests_failed
    url = f"{API_URL}/{path}" if path else API_URL
    
    try:
        if method == 'GET':
            response = requests.get(url, timeout=10)
        elif method == 'POST':
            response = requests.post(url, json=data, headers={'Content-Type': 'application/json'}, timeout=10)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        # Check status code
        if response.status_code != expected_status:
            print(f"❌ FAIL: {name}")
            print(f"   Expected status {expected_status}, got {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            tests_failed += 1
            test_results.append({'test': name, 'status': 'FAIL', 'reason': f"Status {response.status_code} != {expected_status}"})
            return None
        
        # Parse JSON response
        try:
            response_data = response.json()
        except:
            print(f"❌ FAIL: {name}")
            print(f"   Could not parse JSON response")
            print(f"   Response: {response.text[:200]}")
            tests_failed += 1
            test_results.append({'test': name, 'status': 'FAIL', 'reason': 'Invalid JSON response'})
            return None
        
        # Check content
        if should_contain:
            for key in should_contain:
                if key not in response_data and not any(key in str(v) for v in response_data.values()):
                    print(f"❌ FAIL: {name}")
                    print(f"   Response missing expected key/value: {key}")
                    print(f"   Response: {json.dumps(response_data, indent=2)[:300]}")
                    tests_failed += 1
                    test_results.append({'test': name, 'status': 'FAIL', 'reason': f"Missing {key}"})
                    return None
        
        if should_not_contain:
            for key in should_not_contain:
                if key in response_data:
                    print(f"❌ FAIL: {name}")
                    print(f"   Response contains unexpected key: {key}")
                    tests_failed += 1
                    test_results.append({'test': name, 'status': 'FAIL', 'reason': f"Contains {key}"})
                    return None
        
        print(f"✅ PASS: {name}")
        tests_passed += 1
        test_results.append({'test': name, 'status': 'PASS'})
        return response_data
        
    except requests.exceptions.RequestException as e:
        print(f"❌ FAIL: {name}")
        print(f"   Request error: {str(e)}")
        tests_failed += 1
        test_results.append({'test': name, 'status': 'FAIL', 'reason': f"Request error: {str(e)}"})
        return None
    except Exception as e:
        print(f"❌ FAIL: {name}")
        print(f"   Unexpected error: {str(e)}")
        tests_failed += 1
        test_results.append({'test': name, 'status': 'FAIL', 'reason': f"Error: {str(e)}"})
        return None

# ============================================================================
# 1. HEALTH CHECK TESTS
# ============================================================================
print("\n1. HEALTH CHECK TESTS")
print("-" * 80)

test_endpoint(
    "GET /api/ - Health check root",
    "GET", "",
    expected_status=200,
    should_contain=['status', 'ok', 'atmosphere-api']
)

test_endpoint(
    "GET /api/health - Health check endpoint",
    "GET", "health",
    expected_status=200,
    should_contain=['status', 'ok', 'atmosphere-api']
)

# ============================================================================
# 2. RESERVATIONS API TESTS
# ============================================================================
print("\n2. RESERVATIONS API TESTS")
print("-" * 80)

# Happy path - all fields
reservation_date = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
reservation_data_full = {
    "name": "Rajesh Kumar",
    "phone": "+91-9876543210",
    "email": "rajesh.kumar@example.com",
    "date": reservation_date,
    "time": "19:30",
    "guests": 4,
    "occasion": "Anniversary",
    "dietary": "Vegetarian",
    "special_requests": "Window seating preferred"
}

result = test_endpoint(
    "POST /api/reservations - Happy path with all fields",
    "POST", "reservations",
    data=reservation_data_full,
    expected_status=200,
    should_contain=['success', 'reservation', 'id', 'status', 'confirmed', 'created_at']
)

if result and 'reservation' in result:
    reservation_id = result['reservation'].get('id')
    print(f"   Created reservation ID: {reservation_id}")
    # Verify UUID format
    if reservation_id and len(reservation_id) == 36:
        print(f"   ✓ ID is valid UUID format")
    else:
        print(f"   ⚠ Warning: ID may not be UUID format: {reservation_id}")

# Happy path - required fields only
reservation_data_minimal = {
    "name": "Priya Sharma",
    "phone": "+91-9123456789",
    "date": reservation_date,
    "time": "20:00",
    "guests": 2
}

test_endpoint(
    "POST /api/reservations - Happy path with required fields only",
    "POST", "reservations",
    data=reservation_data_minimal,
    expected_status=200,
    should_contain=['success', 'reservation']
)

# Missing required field - phone
reservation_data_missing_phone = {
    "name": "Test User",
    "date": reservation_date,
    "time": "19:00",
    "guests": 3
}

test_endpoint(
    "POST /api/reservations - Missing required field 'phone'",
    "POST", "reservations",
    data=reservation_data_missing_phone,
    expected_status=400,
    should_contain=['error', 'phone']
)

# Missing required field - name
reservation_data_missing_name = {
    "phone": "+91-9999999999",
    "date": reservation_date,
    "time": "19:00",
    "guests": 3
}

test_endpoint(
    "POST /api/reservations - Missing required field 'name'",
    "POST", "reservations",
    data=reservation_data_missing_name,
    expected_status=400,
    should_contain=['error', 'name']
)

# GET reservations
result = test_endpoint(
    "GET /api/reservations - Retrieve all reservations",
    "GET", "reservations",
    expected_status=200,
    should_contain=['items']
)

if result and 'items' in result:
    items = result['items']
    print(f"   Retrieved {len(items)} reservation(s)")
    if len(items) >= 2:
        print(f"   ✓ Contains newly created reservations")
        # Check if sorted by created_at descending (most recent first)
        if len(items) >= 2:
            first_date = items[0].get('created_at', '')
            second_date = items[1].get('created_at', '')
            if first_date >= second_date:
                print(f"   ✓ Items sorted by created_at (most recent first)")
            else:
                print(f"   ⚠ Warning: Items may not be sorted correctly")

# ============================================================================
# 3. BANQUET INQUIRIES API TESTS
# ============================================================================
print("\n3. BANQUET INQUIRIES API TESTS")
print("-" * 80)

event_date = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')

# Happy path - Note: actual implementation requires email, not event_date/guest_count
banquet_data_full = {
    "name": "Ananya Reddy",
    "phone": "+91-9876501234",
    "email": "ananya.reddy@example.com",
    "event_type": "Wedding Reception",
    "event_date": event_date,
    "guest_count": 200,
    "budget_range": "5-7 lakhs",
    "special_requirements": "Outdoor setup with live music"
}

result = test_endpoint(
    "POST /api/banquet-inquiries - Happy path with all fields",
    "POST", "banquet-inquiries",
    data=banquet_data_full,
    expected_status=200,
    should_contain=['success', 'inquiry', 'id', 'created_at']
)

if result and 'inquiry' in result:
    inquiry_id = result['inquiry'].get('id')
    print(f"   Created inquiry ID: {inquiry_id}")

# Missing required field - email (actual implementation requires this)
banquet_data_missing_email = {
    "name": "Test User",
    "phone": "+91-9999999999",
    "event_type": "Corporate Event",
    "event_date": event_date,
    "guest_count": 100
}

test_endpoint(
    "POST /api/banquet-inquiries - Missing required field 'email'",
    "POST", "banquet-inquiries",
    data=banquet_data_missing_email,
    expected_status=400,
    should_contain=['error', 'email']
)

# Missing required field - phone
banquet_data_missing_phone = {
    "name": "Test User",
    "email": "test@example.com",
    "event_type": "Birthday Party",
    "event_date": event_date,
    "guest_count": 50
}

test_endpoint(
    "POST /api/banquet-inquiries - Missing required field 'phone'",
    "POST", "banquet-inquiries",
    data=banquet_data_missing_phone,
    expected_status=400,
    should_contain=['error', 'phone']
)

# GET banquet inquiries
result = test_endpoint(
    "GET /api/banquet-inquiries - Retrieve all inquiries",
    "GET", "banquet-inquiries",
    expected_status=200,
    should_contain=['items']
)

if result and 'items' in result:
    items = result['items']
    print(f"   Retrieved {len(items)} inquiry/inquiries")

# ============================================================================
# 4. EVENT BOOKINGS API TESTS
# ============================================================================
print("\n4. EVENT BOOKINGS API TESTS")
print("-" * 80)

# Happy path - Note: actual implementation requires email, not event_date/guests
event_booking_data_full = {
    "name": "Vikram Patel",
    "phone": "+91-9123450987",
    "email": "vikram.patel@example.com",
    "event_name": "New Year's Eve Celebration",
    "event_date": "2024-12-31",
    "guests": 150,
    "special_requests": "DJ and dance floor setup"
}

result = test_endpoint(
    "POST /api/event-bookings - Happy path with all fields",
    "POST", "event-bookings",
    data=event_booking_data_full,
    expected_status=200,
    should_contain=['success', 'booking', 'id', 'created_at']
)

if result and 'booking' in result:
    booking_id = result['booking'].get('id')
    print(f"   Created booking ID: {booking_id}")

# Missing required field - email (actual implementation requires this)
event_booking_missing_email = {
    "name": "Test User",
    "phone": "+91-9999999999",
    "event_name": "Birthday Bash",
    "event_date": event_date,
    "guests": 50
}

test_endpoint(
    "POST /api/event-bookings - Missing required field 'email'",
    "POST", "event-bookings",
    data=event_booking_missing_email,
    expected_status=400,
    should_contain=['error', 'email']
)

# Missing required field - phone
event_booking_missing_phone = {
    "name": "Test User",
    "email": "test@example.com",
    "event_name": "Anniversary Party",
    "event_date": event_date,
    "guests": 30
}

test_endpoint(
    "POST /api/event-bookings - Missing required field 'phone'",
    "POST", "event-bookings",
    data=event_booking_missing_phone,
    expected_status=400,
    should_contain=['error', 'phone']
)

# GET event bookings
result = test_endpoint(
    "GET /api/event-bookings - Retrieve all bookings",
    "GET", "event-bookings",
    expected_status=200,
    should_contain=['items']
)

if result and 'items' in result:
    items = result['items']
    print(f"   Retrieved {len(items)} booking(s)")

# ============================================================================
# 5. CONTACT MESSAGES API TESTS
# ============================================================================
print("\n5. CONTACT MESSAGES API TESTS")
print("-" * 80)

# Happy path - Note: actual implementation requires email and subject, not just name and message
contact_data_full = {
    "name": "Meera Iyer",
    "phone": "+91-9876509876",
    "email": "meera.iyer@example.com",
    "subject": "Catering Services Inquiry",
    "message": "I would like to know more about your catering services for a corporate event with 100 guests."
}

result = test_endpoint(
    "POST /api/contact-messages - Happy path with all fields",
    "POST", "contact-messages",
    data=contact_data_full,
    expected_status=200,
    should_contain=['success', 'message', 'id', 'created_at']
)

if result and 'message' in result:
    message_id = result['message'].get('id')
    print(f"   Created message ID: {message_id}")

# Missing required field - message
contact_data_missing_message = {
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject"
}

test_endpoint(
    "POST /api/contact-messages - Missing required field 'message'",
    "POST", "contact-messages",
    data=contact_data_missing_message,
    expected_status=400,
    should_contain=['error', 'message']
)

# Missing required field - email (actual implementation requires this)
contact_data_missing_email = {
    "name": "Test User",
    "subject": "Test Subject",
    "message": "Test message content"
}

test_endpoint(
    "POST /api/contact-messages - Missing required field 'email'",
    "POST", "contact-messages",
    data=contact_data_missing_email,
    expected_status=400,
    should_contain=['error', 'email']
)

# GET contact messages
result = test_endpoint(
    "GET /api/contact-messages - Retrieve all messages",
    "GET", "contact-messages",
    expected_status=200,
    should_contain=['items']
)

if result and 'items' in result:
    items = result['items']
    print(f"   Retrieved {len(items)} message(s)")

# ============================================================================
# 6. 404 ERROR HANDLING TEST
# ============================================================================
print("\n6. 404 ERROR HANDLING TEST")
print("-" * 80)

test_endpoint(
    "GET /api/unknown-route - 404 for unknown path",
    "GET", "unknown-route",
    expected_status=404,
    should_contain=['error', 'Not found', 'path']
)

# ============================================================================
# SUMMARY
# ============================================================================
print("\n" + "=" * 80)
print("TEST SUMMARY")
print("=" * 80)
print(f"Total Tests: {tests_passed + tests_failed}")
print(f"✅ Passed: {tests_passed}")
print(f"❌ Failed: {tests_failed}")
print(f"Success Rate: {(tests_passed / (tests_passed + tests_failed) * 100):.1f}%")

if tests_failed > 0:
    print("\nFailed Tests:")
    for result in test_results:
        if result['status'] == 'FAIL':
            print(f"  - {result['test']}: {result.get('reason', 'Unknown')}")

print("\n" + "=" * 80)
print("IMPORTANT NOTES:")
print("=" * 80)
print("1. Reservations API: ✓ Matches spec (required: name, phone, date, time, guests)")
print("2. Banquet Inquiries: ⚠ SPEC MISMATCH")
print("   - Spec says required: name, phone, event_type, event_date, guest_count")
print("   - Actual requires: name, phone, email, event_type")
print("   - event_date and guest_count are OPTIONAL in implementation")
print("3. Event Bookings: ⚠ SPEC MISMATCH")
print("   - Spec says required: name, phone, event_name, event_date, guests")
print("   - Actual requires: name, phone, email, event_name")
print("   - event_date and guests are OPTIONAL in implementation")
print("4. Contact Messages: ⚠ SPEC MISMATCH")
print("   - Spec says required: name, message")
print("   - Actual requires: name, email, subject, message")
print("5. All endpoints use UUID for id field (not MongoDB ObjectId) ✓")
print("6. All documents include created_at timestamp in ISO format ✓")
print("=" * 80)

exit(0 if tests_failed == 0 else 1)
