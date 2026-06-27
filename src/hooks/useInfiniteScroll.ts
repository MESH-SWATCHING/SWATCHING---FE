import { useState, useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions<T> {
  data: T[];
  pageSize?: number;
}

export function useInfiniteScroll<T>({
  data,
  pageSize = 5,
}: UseInfiniteScrollOptions<T>) {
  const [displayCount, setDisplayCount] = useState(pageSize);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false); // 중복 호출 방지

  const hasMore = displayCount < data.length;
  const displayedData = data.slice(0, displayCount);

  // 카테고리(data 길이) 바뀌면 초기화
  useEffect(() => {
    setDisplayCount(pageSize);
    isLoadingRef.current = false;
  }, [data.length, pageSize]);

  const loadMore = useCallback(() => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    // 약간의 딜레이로 연속 호출 방지
    setTimeout(() => {
      setDisplayCount((prev) => {
        const next = Math.min(prev + pageSize, data.length);
        return next;
      });
      isLoadingRef.current = false;
    }, 300);
  }, [pageSize, data.length]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !isLoadingRef.current) {
          loadMore();
        }
      },
      {
        threshold: 0,
        rootMargin: "0px 0px 100px 0px", // 로더가 100px 앞에 왔을 때 트리거
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return { displayedData, hasMore, loaderRef };
}
