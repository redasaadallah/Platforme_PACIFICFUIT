import axios from "axios";


const api = axios.create({

    baseURL: "http://localhost:8080"

});



// ===============================
// 1) Send Access Token automatically
// ===============================

api.interceptors.request.use(

(config)=>{


    const token =
        localStorage.getItem("accessToken");


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
                localStorage.getItem(
                    "refreshToken"
                );

            console.log(
            "REFRESH TOKEN:",
            refreshToken
        );

            // Ask backend for new access token

            const response =
                await axios.post(

                    "http://localhost:8080/api/auth/refresh",

                    {
                        refreshToken:
                        refreshToken
                    }

                );



            const newAccessToken =
                response.data.accessToken;



            // Save new token

            localStorage.setItem(
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

            localStorage.removeItem(
                "accessToken"
            );


            localStorage.removeItem(
                "refreshToken"
            );
            const type =localStorage.getItem("type");

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