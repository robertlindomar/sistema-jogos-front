import axios from "axios";

// API pública sem autenticação para convites
const apiPublic = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
});

export default apiPublic;
