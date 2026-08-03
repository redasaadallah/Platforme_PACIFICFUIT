import axios from "axios";


const api = axios.create({

    baseURL: "/api"

});



// ===============================
// 1) Send Access Token automatically
// ===============================

api.interceptors.request.use(

(config)=>{


    const token =
        sessionStorage.getItem("accessToken");


    if(token){

        config.headers.Authorization =
        `Bearer ${token}`;

    }


    return config;


},

(error)=>{

    return Promise.reject(error);

}

);





// ===============================
// 2) Refresh Token automatically
// ===============================


api.interceptors.response.use(


(response)=>{

    return response;

},



async(error)=>{


    const originalRequest =
        error.config;

    console.log("ERROR STATUS:",
        error.response?.status
    );

    // Access token expired

    if(
        error.response &&
        error.response.status === 403 &&
        !originalRequest._retry
    ){
        console.log("ACCESS TOKEN EXPIRED");

        originalRequest._retry = true;



        try {


            const refreshToken =
                sessionStorage.getItem(
                    "refreshToken"
                );

            console.log(
            "REFRESH TOKEN:",
            refreshToken
        );

            // Ask backend for new access token

            const response =
                await axios.post(

                    "/api/auth/refresh",

                    {
                        refreshToken:
                        refreshToken
                    }

                );



            const newAccessToken =
                response.data.accessToken;



            // Save new token

            sessionStorage.setItem(
                "accessToken",
                newAccessToken
            );



            // Update failed request

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;



            // Retry request

            return api(originalRequest);



        }
        catch(refreshError){


            // Refresh token invalid

            sessionStorage.removeItem(
                "accessToken"
            );


            sessionStorage.removeItem(
                "refreshToken"
            );
            const type =sessionStorage.getItem("type");

            if(type === "ADMIN"){

                window.location.href="/admin";

            }
            else if(type === "CLIENT"){

                window.location.href="/reservation";

            }
            else{

                window.location.href="/";

            }


            return Promise.reject(refreshError);

        }

    }



    return Promise.reject(error);

}

);


export default api;