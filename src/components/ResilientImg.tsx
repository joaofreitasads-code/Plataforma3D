import React, { useState, useEffect, useCallback } from 'react';
import {
  getOptimizedCardImageUrl,
  getCachedBlobUrl,
  fetchSameOriginImageAsBlobUrl,
  shouldPreferBlobFetch,
  markPreferBlobFetch,
} from '../utils/imageOptimizer';

interface ResilientImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  rawSrc: string;
  targetWidth?: number;
  externalFallback?: string;
  onFinalError?: () => void;
}

export const ResilientImg: React.FC<ResilientImgProps> = ({
  rawSrc,
  targetWidth = 240,
  externalFallback,
  onFinalError,
  onError,
  referrerPolicy,
  ...rest
}) => {
  const [attempt, setAttempt] = useState(0);
  const [blobOverride, setBlobOverride] = useState<{ forUrl: string; blobUrl: string } | null>(null);
  const [usedExternalFallback, setUsedExternalFallback] = useState(false);

  const candidateSrc = usedExternalFallback && externalFallback
    ? externalFallback
    : (rawSrc.startsWith('/') ? rawSrc : getOptimizedCardImageUrl(rawSrc, attempt, targetWidth));

  const cachedBlob = candidateSrc.startsWith('/') ? getCachedBlobUrl(candidateSrc) : null;
  const activeBlobUrl =
    blobOverride && blobOverride.forUrl === candidateSrc ? blobOverride.blobUrl : cachedBlob;
  const displaySrc = activeBlobUrl || candidateSrc;

  useEffect(() => {
    setAttempt(0);
    setBlobOverride(null);
    setUsedExternalFallback(false);
  }, [rawSrc]);

  useEffect(() => {
    if (!candidateSrc.startsWith('/') || activeBlobUrl || !shouldPreferBlobFetch()) return;
    let cancelled = false;
    fetchSameOriginImageAsBlobUrl(candidateSrc).then((blobUrl) => {
      if (!cancelled && blobUrl) {
        setBlobOverride({ forUrl: candidateSrc, blobUrl });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [candidateSrc, activeBlobUrl]);

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (candidateSrc.startsWith('/') && !activeBlobUrl) {
        markPreferBlobFetch();
        fetchSameOriginImageAsBlobUrl(candidateSrc).then((blobUrl) => {
          if (blobUrl) {
            setBlobOverride({ forUrl: candidateSrc, blobUrl });
            return;
          }
          if (!rawSrc.startsWith('/') && attempt < 4) {
            setAttempt((prev) => prev + 1);
          } else if (externalFallback && !usedExternalFallback) {
            setUsedExternalFallback(true);
          } else {
            onFinalError?.();
            onError?.(e);
          }
        });
        return;
      }

      if (!rawSrc.startsWith('/') && attempt < 4) {
        setAttempt((prev) => prev + 1);
        return;
      }

      if (externalFallback && !usedExternalFallback) {
        setUsedExternalFallback(true);
        return;
      }

      onFinalError?.();
      onError?.(e);
    },
    [candidateSrc, activeBlobUrl, rawSrc, attempt, externalFallback, usedExternalFallback, onFinalError, onError]
  );

  return (
    <img
      {...rest}
      src={displaySrc}
      referrerPolicy={referrerPolicy ?? (displaySrc.startsWith('http') ? 'no-referrer' : undefined)}
      onError={handleError}
    />
  );
};
