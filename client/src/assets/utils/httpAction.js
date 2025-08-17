import { toast } from 'react-toastify';

const httpAction = async (data) => {
  try {
    const response = await fetch(data.url, {
      method: data.method,
      headers: {
        'Content-Type': 'application/json',
        ...data.headers,
      },
      credentials: 'include', // Required for sending cookies
      body: data.body ? JSON.stringify(data.body) : null,
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const result = isJson ? await response.json() : { message: await response.text() };

    if (!response.ok) {
      // Show toast for client-side errors (like wrong password)
      if (response.status >= 400 && response.status < 500) {
        // toast.error(result.message || 'Invalid credentials');
        return { success: false, error: result.message };
      }

      // Server error
      throw new Error(result.message || 'Something went wrong');
    }

    // toast.success(result.message || 'Success');
    return { ...result, success: true };

  } catch (error) {
    // toast.error(error.message || 'Unexpected error');
    return { success: false, error: error.message };
  }
};

export default httpAction;
