// export const apiHeader = {
//     headers : {
//         "Content-Type" : "application/json"
//     }
// }

export const apiHeader = () => {
    // Fetch token from localStorage
    const token = localStorage.getItem('userToken'); // Assuming the token is stored under the key 'token'

    // Construct the headers with token
    return {
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }) // Add Authorization header if token exists
        }
    };
};