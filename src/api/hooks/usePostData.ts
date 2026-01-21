"use client";

import { useState } from "react";
import axios from "axios";

type PostFn<TPayload, TResponse> = (payload: TPayload) => Promise<TResponse>;

export function usePostData<TPayload, TResponse>(
  postFn: PostFn<TPayload, TResponse>,
) {
  const [data, setData] = useState<TResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postData = async (payload: TPayload) => {
    setLoading(true);
    setError(null);

    try {
      const result = await postFn(payload);
      setData(result);
      return result;
    } catch (err: unknown) {
      let message = "Something went wrong";

      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message ?? err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    postData,
    data,
    loading,
    error,
  };
}
