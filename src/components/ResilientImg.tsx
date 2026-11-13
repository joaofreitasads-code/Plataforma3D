import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  getOptimizedCardImageUrl,
  getCachedBlobUrl,
  fetchSameOriginImageAsBlobUrl,
  shouldPreferBlobFetch,
  markPreferBlobFetch,
  getCachedLocalFallback,
  loadLocalImageFallback,
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
  const [resolvedOverride, setResolvedOverride] = useState<{ forUrl: string; src: string } | null>(null);
  const [usedExternalFallback, setUsedExternalFallback] = useState(false);
  const latestCandidateRef = useRef<string>('');

  const candidateSrc =
    usedExternalFallback && externalFallback
      ? externalFallback
      : rawSrc.startsWith('/')
      ? rawSrc
      : getOptimizedCardImageUrl(rawSrc, attempt, targetWidth);

  latestCandidateRef.current = candidateSrc;

  const cachedSync = candidateSrc.startsWith('/')
    ? getCachedLocalFallback(candidateSrc) || getCachedBlobUrl(candidateSrc)
    : null;
  const activeOverride =
    resolvedOverride && resolvedOverride.forUrl === candidateSrc
      ? resolvedOverride.src
      : cachedSync;
  const displaySrc = activeOverride || candidateSrc;

  useEffect(() => {
    setAttempt(0);
    setResolvedOverride(null);
    setUsedExternalFallback(false);
  }, [rawSrc]);

  useEffect(() => {
    if (!candidateSrc.startsWith('/') || activeOverride || !shouldPreferBlobFetch()) return;
    let cancelled = false;
    const captured = candidateSrc;
    fetchSameOriginImageAsBlobUrl(captured).then((blobUrl) => {
      if (cancelled || latestCandidateRef.current !== captured) return;
      if (blobUrl) {
        setResolvedOverride({ forUrl: captured, src: blobUrl });
        return;
      }
      loadLocalImageFallback(captured).then((dataUri) => {
        if (!cancelled && dataUri && latestCandidateRef.current === captured) {
          setResolvedOverride({ forUrl: captured, src: dataUri });
        }
      });
    });
    return () => {
      cancelled = true;
    };
  }, [candidateSrc, activeOverride]);

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const captured = candidateSrc;
      if (captured.startsWith('/') && !activeOverride) {
        markPreferBlobFetch();
        fetchSameOriginImageAsBlobUrl(captured).then((blobUrl) => {
          if (latestCandidateRef.current !== captured) return;
          if (blobUrl) {
            setResolvedOverride({ forUrl: captured, src: blobUrl });
            return;
          }
          loadLocalImageFallback(captured).then((dataUri) => {
            if (latestCandidateRef.current !== captured) return;
            if (dataUri) {
              setResolvedOverride({ forUrl: captured, src: dataUri });
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
    [candidateSrc, activeOverride, rawSrc, attempt, externalFallback, usedExternalFallback, onFinalError, onError]
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
