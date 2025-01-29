import axios from "axios";

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
  user_id: number
): Promise<T> {
  return await axios
    .post(path, { user_id })
    .then((res: any) => {
      return res.data;
    })
    .catch((e: any) => {
      console.log("Error: " + e.message);
    });
};
