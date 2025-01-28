import axios from "axios";

export const getContent = async function (path: string): Promise<any> {
  return await axios
    .get(path)
    .then((res: any) => {
      return res.data.results;
    })
    .catch((e: any) => {
      console.log("Error: " + e.message);
    });
};
