const axios = require('axios');
const FormData = require('form-data');

async function testPeerSkillExchange() {
  const baseURL = 'http://localhost:5000';

  console.log('🧪 Testing Peer Skill Exchange Platform...\n');

  try {
    // Test 1: Server is running
    console.log('✅ Test 1: Server Status');
    const serverResponse = await axios.get(baseURL);
    console.log('   Server is running and serving HTML\n');

    // Test 2: API endpoints
    console.log('✅ Test 2: API Endpoints');
    const usersResponse = await axios.get(`${baseURL}/api/users`);
    console.log(`   Users API: ${usersResponse.status} - Found ${usersResponse.data.length} users\n`);

    // Test 3: Registration (without email for now)
    console.log('✅ Test 3: Registration Flow');
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@example.com`,
      password: 'testpassword123',
      qualification: 'Bachelor Degree',
      experience: 2,
      bio: 'Test user for API testing'
    };

    try {
      // Send as form data since the route expects multipart/form-data
      const formData = new FormData();
      Object.keys(testUser).forEach(key => {
        formData.append(key, testUser[key]);
      });

      const registerResponse = await axios.post(`${baseURL}/api/users`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log(`   Registration: ${registerResponse.status} - ${registerResponse.data.message}\n`);
    } catch (error) {
      console.log(`   Registration Error: ${error.response?.status} - ${error.response?.data?.message}`);
      if (error.response?.data?.message) {
        console.log(`   Error details: ${JSON.stringify(error.response.data)}`);
      }
      console.log('');
    }

    // Test 4: Login attempt
    console.log('✅ Test 4: Login Flow');
    try {
      const loginResponse = await axios.post(`${baseURL}/api/users/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log(`   Login: ${loginResponse.status} - ${loginResponse.data.message}\n`);
    } catch (error) {
      console.log(`   Login Error: ${error.response?.status} - ${error.response?.data?.message}\n`);
    }

    console.log('🎉 All basic tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPeerSkillExchange();