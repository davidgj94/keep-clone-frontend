import React, { useState, useEffect, useRef } from 'react';

interface Options {
  callback: () => Promise<unknown>;
  element: HTMLElement | null;
}

const useInfiniteScroll = ({ callback, element }: Options) => {
  const [isFetching, setIsFetching] = useState(false);
  const observer = useRef<IntersectionObserver>();

  useEffect(() => {
    if (!element) {
      return;
    }

    observer.current = new IntersectionObserver((entries) => {
      if (!isFetching && entries[0].isIntersecting) {
        setIsFetching(true);
        callback().finally(() => setIsFetching(false));
      }
    });
    observer.current.observe(element);

    return () => observer.current?.disconnect();
  }, [callback, isFetching, element]);

  return isFetching;
};

interface InfiniteLoaderProps {
  children: React.ReactElement;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

const InfiniteLoader = ({
  children,
  loadMore,
  hasMore,
}: InfiniteLoaderProps) => {
  const element = useRef<HTMLDivElement>(null);
  useInfiniteScroll({ callback: loadMore, element: element.current });
  return (
    <>
      {children}
      {hasMore && <div ref={element} />}
    </>
  );
};

export default InfiniteLoader;
