import { useEffect, useState } from "react";

export function useCartCount() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/cart/count");
        if (res.ok) {
          const data = await res.json();
          setCount(data.count);
        }
      } catch {
        setCount(0);
      }
      setLoading(false);
    };
    fetchCount();
  }, []);

  return { count, loading };
}