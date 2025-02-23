export const getUserSessions = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:5001/api/sessions/sessions/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
  
      const data = await response.json();
      return data || 'User';
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return 'User';
    }
  };
  