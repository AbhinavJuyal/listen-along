import axios, { AxiosResponse, Method } from "axios";
import { useEffect, useState, useRef } from "react";

interface IAxiosProps {
  url: string;
  method: Method;
  payload?: any;
}

export const useAxios = ({ url, method, payload }: IAxiosProps) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const controllerRef = useRef(new AbortController());
  const cancel = () => {
    controllerRef.current.abort();
  };

  useEffect(() => {
    (async () => {
      try {
        const response: AxiosResponse = await axios.request({
          data: payload,
          signal: controllerRef.current.signal,
          method,
          url,
        });

        setData(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) setError(error.message);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  return { cancel, data, error, loaded };
};
