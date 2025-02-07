import axios from "axios";

export const axiosJWT = axios.create({
  baseURL: "http://localhost:8081",
  withCredentials: true,
});

export const config = (accessToken: string | null): {} => {
  if (!accessToken) {
    console.error("Access token is missing");
    return {};
  }
  return {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
};

export const getContentGetReq = async function <T>(path: string): Promise<T> {
  return await axios
    .get(path)
    .then((res: any) => {
      return res.data.results;
    })
    .catch((e: any) => {
      console.log("Error: " + e.message);
    });
};

export const getContentPostReq = async function <T>(
  path: string,
  credentials: object
): Promise<T> {
  return await axiosJWT
    .post(path, {}, credentials)
    .then((res: any) => {
      return res.data;
    })
    .catch((e: any) => {
      console.log("Error: " + e.message);
    });
};
