const apis = () => {

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050';

    const list = {
        registerUser: `${baseUrl}/user/register`,
        loginUser: `${baseUrl}/user/login`,
        logout: `${baseUrl}/user/logout`,
        userProfile: `${baseUrl}/user/profile`,
        donateItem: `${baseUrl}/donations`,
        getDonations: `${baseUrl}/donations`,
        getNGOs: `${baseUrl}/ngos`,

        createReview: `${baseUrl}/api/reviews`,
        getMyReviews: `${baseUrl}/api/reviews/my`,
        updateReview: (id) => `${baseUrl}/api/reviews/${id}`,
        deleteReview: (id) => `${baseUrl}/api/reviews/${id}`,
        getAllReviews: `${baseUrl}/api/reviews/all`,

       reportBug: `${baseUrl}/api/bug/report-bug`,
       getMyBugReports: `${baseUrl}/api/bug/my-reports`,
       dashboardStats : `${baseUrl}/api/dashboard/stats`,

    }

    return list
}

export default apis;