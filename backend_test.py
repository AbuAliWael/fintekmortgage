#!/usr/bin/env python3
"""
Backend API Testing Script for Mortgage Broker Platform
Tests the core backend functionality as requested in the review.
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL from environment
BACKEND_URL = "https://qualify-demo.preview.emergentagent.com"

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing Health Check Endpoint...")
    try:
        response = requests.get(f"{BACKEND_URL}/api/", timeout=10)
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {response.json()}")
        
        if response.status_code == 200:
            print("   ✅ Health check PASSED")
            return True
        else:
            print("   ❌ Health check FAILED")
            return False
    except Exception as e:
        print(f"   ❌ Health check ERROR: {str(e)}")
        return False

def test_daily_insights():
    """Test the daily insights endpoint"""
    print("\n🔍 Testing Daily Insights Endpoint...")
    try:
        # The user mentioned /api/insights/recent?limit=3 but code shows /api/insights with limit param
        response = requests.get(f"{BACKEND_URL}/api/insights?limit=3", timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Response: {json.dumps(data, indent=2)}")
            
            if isinstance(data, list):
                print(f"   Returned {len(data)} insights")
                if len(data) <= 3:
                    print("   ✅ Daily insights PASSED")
                    return True
                else:
                    print("   ⚠️  Returned more than 3 insights (limit not working)")
                    return False
            else:
                print("   ❌ Expected array response")
                return False
        else:
            print(f"   Response: {response.text}")
            print("   ❌ Daily insights FAILED")
            return False
    except Exception as e:
        print(f"   ❌ Daily insights ERROR: {str(e)}")
        return False

def test_lead_creation():
    """Test lead creation endpoint"""
    print("\n🔍 Testing Lead Creation Endpoint...")
    try:
        # Sample lead data as provided in the request
        lead_data = {
            "first_name": "John",
            "last_name": "Smith", 
            "email": "john.smith@example.com",
            "phone": "5551234567",
            "loan_amount": 300000,
            "property_value": 400000,
            "source": "web_form"
        }
        
        response = requests.post(
            f"{BACKEND_URL}/api/leads", 
            json=lead_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Response: {json.dumps(data, indent=2)}")
            
            # Check if lead ID is returned
            if 'id' in data:
                print(f"   Lead ID: {data['id']}")
                print("   ✅ Lead creation PASSED")
                return True, data['id']
            else:
                print("   ❌ No lead ID returned")
                return False, None
        else:
            print(f"   Response: {response.text}")
            print("   ❌ Lead creation FAILED")
            return False, None
    except Exception as e:
        print(f"   ❌ Lead creation ERROR: {str(e)}")
        return False, None

def test_ai_chatbot():
    """Test AI chatbot endpoint"""
    print("\n🔍 Testing AI Chatbot Endpoint...")
    try:
        # Sample chat data as provided in the request
        chat_data = {
            "message": "What loan programs do you offer?",
            "session_id": f"test_session_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        }
        
        # The user mentioned /api/chat but code shows /api/ai/chat
        response = requests.post(
            f"{BACKEND_URL}/api/ai/chat", 
            json=chat_data,
            headers={"Content-Type": "application/json"},
            timeout=15  # AI calls might take longer
        )
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Response: {json.dumps(data, indent=2)}")
            
            # Check if AI response is returned
            if 'response' in data and data['response']:
                print(f"   AI Response Length: {len(data['response'])} characters")
                print("   ✅ AI chatbot PASSED")
                return True
            else:
                print("   ❌ No AI response returned")
                return False
        else:
            print(f"   Response: {response.text}")
            print("   ❌ AI chatbot FAILED")
            return False
    except Exception as e:
        print(f"   ❌ AI chatbot ERROR: {str(e)}")
        return False

def main():
    """Run all backend tests"""
    print("=" * 60)
    print("🚀 MORTGAGE BROKER PLATFORM - BACKEND API TESTS")
    print("=" * 60)
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    results = {}
    
    # Test 1: Health Check
    results['health_check'] = test_health_check()
    
    # Test 2: Daily Insights
    results['daily_insights'] = test_daily_insights()
    
    # Test 3: Lead Creation
    lead_success, lead_id = test_lead_creation()
    results['lead_creation'] = lead_success
    
    # Test 4: AI Chatbot
    results['ai_chatbot'] = test_ai_chatbot()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for result in results.values() if result)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"   {test_name.replace('_', ' ').title()}: {status}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED - Backend is working correctly!")
        return 0
    else:
        print("⚠️  SOME TESTS FAILED - Backend needs attention!")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)