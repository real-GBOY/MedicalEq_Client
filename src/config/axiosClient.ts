import axios from "axios";

const axiosClient = axios.create({
	baseURL: "https://zaher-backend.vercel.app/api",
});

export default axiosClient;