/** @format */

import axios from "axios";

const axiosClient = axios.create({
	baseURL: "https://zaher-backend.vercel.app/",
});

export default axiosClient;
