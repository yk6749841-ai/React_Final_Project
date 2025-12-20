import { useState, useEffect } from "react";
import axios from "axios";

export function UseApi<T>(url: string,method: 'GET' | 'POST'| 'PUT' | 'DELETE' = 'GET') {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    switch (method) {       
      case 'GET':
        const getData = async () => {
          try {
            const { data } = await axios.get(url);
            setData(data);
          } catch (err) {
            console.error("שגיאה: ", err);
          }
        };
        getData();
        break;
      case 'POST':
        const postData = async () => {
          try {
            const { data } = await axios.post(url);
            setData(data);
          } catch (err) {
            console.error("שגיאה: ", err);
          }
        };
        postData();
        break;
      case 'PUT':
        const putData = async () => {
          try {
            const { data } = await axios.put(url);
            setData(data);
          } catch (err) {
            console.error("שגיאה: ", err);
          }
        };
        putData();
        break;
      case 'DELETE':
        const deleteData = async () => {
          try {
            const { data } = await axios.delete(url);
            setData(data);
          } catch (err) {
            console.error("שגיאה: ", err);
          }
        };
        deleteData();
        break;
    }
    setLoading(true);
  }, [url]);

  return { data, loading };
}




