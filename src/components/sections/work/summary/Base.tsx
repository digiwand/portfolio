import { MouseEvent, PointerEvent, ReactNode, useCallback, useEffect, useRef } from 'react';

import Fade from 'components/animations/Fade';
import TECH, { type TechKey } from 'constants/tech';
import { cn } from 'lib/cn';

import { ImgTrio } from '../img-trio/ImgTrio';
import { WorkImageConfig } from 'components/sections/work/shared/constants';

interface Props {
  companyName: string;
  companyHref?: string;
  logoSrc?: string;
  techKeys: readonly TechKey[];
  title: string;
  subtitle: string;
  date: string;

  children?: ReactNode;
  className?: string;
  imgConfigs?: WorkImageConfig[];
  workCarouselSlideOffset?: number;
  onOpenLightbox?: (globalIndex: number) => void;
}

/** Long enough to cancel a card click when the gesture is a double-click selection. */
const CARD_CLICK_DELAY_MS = 450;

function clickIsInsideSelection(target: EventTarget | null) {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) return false;
  if (!(target instanceof Node)) return true;

  try {
    return selection.getRangeAt(0).intersectsNode(target);
  } catch {
    return true;
  }
}

function selectionWithin(root: Node | null) {
  const selection = window.getSelection();
  if (!root || !selection || selection.isCollapsed || selection.rangeCount === 0) return false;
  return selection.anchorNode != null && root.contains(selection.anchorNode);
}

function Work({ children, ...props }: Props) {
  const {
    className,
    companyName,
    companyHref,
    logoSrc,
    title,
    subtitle,
    date,
    imgConfigs,
    techKeys,
    onOpenLightbox,
    workCarouselSlideOffset = 0,
  } = props;

  const rootRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<number | null>(null);
  const pointerOrigin = useRef<{ x: number; y: number } | null>(null);

  const clearOpenTimer = useCallback(() => {
    if (openTimer.current == null) return;
    window.clearTimeout(openTimer.current);
    openTimer.current = null;
  }, []);

  useEffect(() => clearOpenTimer, [clearOpenTimer]);

  const openCarouselFromTrio = useCallback((localIndex: number) => {
    onOpenLightbox?.(workCarouselSlideOffset + localIndex);
  }, [onOpenLightbox, workCarouselSlideOffset]);

  const onCardPointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (!companyHref || event.button !== 0) return;
    if (event.detail > 1) {
      clearOpenTimer();
      return;
    }
    pointerOrigin.current = { x: event.clientX, y: event.clientY };
  }, [clearOpenTimer, companyHref]);

  const openCardLink = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (!companyHref || event.defaultPrevented || event.button !== 0) return;

    const { target } = event;
    if (target instanceof Element && target.closest('a, button')) return;

    const origin = pointerOrigin.current;
    pointerOrigin.current = null;
    if (origin && Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > 4) return;

    if (event.detail > 1 || selectionWithin(rootRef.current) || clickIsInsideSelection(target)) {
      clearOpenTimer();
      return;
    }

    clearOpenTimer();
    openTimer.current = window.setTimeout(() => {
      openTimer.current = null;
      if (selectionWithin(rootRef.current)) return;
      window.open(companyHref, '_blank', 'noopener,noreferrer');
    }, CARD_CLICK_DELAY_MS);
  }, [clearOpenTimer, companyHref]);

  return (
    <div
      className={cn(
        'work-col-content max-w-[850rem]',
        companyHref && 'cursor-pointer',
        className,
      )}
      onClick={companyHref ? openCardLink : undefined}
      onDoubleClick={companyHref ? clearOpenTimer : undefined}
      onPointerDown={companyHref ? onCardPointerDown : undefined}
      ref={rootRef}
    >
      <Fade>
        <div className="u-glass rounded-[10rem] pt-64 pb-16 px-16 sm:px-32 text-center sm:text-left">
          <div
            className={cn(
              'flex flex-col sm:flex-row items-center gap-24',
              !logoSrc && 'sm:items-start',
            )}
          >
            {logoSrc && (
              <img
                className="shrink-0 w-[96rem] h-[96rem]"
                src={logoSrc}
                alt={`${title} logo`}
                width={96}
                height={96}
              />
            )}

            <div className="min-w-0">
              <h2
                className={cn(
                  `font-heading2 text-shadow-theme block land:inline-block pr-0 land:pr-16
                  tracking-[-0.5rem] sm:tracking-[3rem] text-[var(--theme-work-header)]`,
                  companyHref && 'cursor-text',
                )}
              >
                {title} • {subtitle}
              </h2>

              <h4
                className={cn(
                  'block pb-4 text-[var(--theme-work-sub-header)]',
                  logoSrc ? 'pt-8' : 'pt-16 sm:pt-32',
                  companyHref && 'cursor-text',
                )}
              >
                {companyHref ? (
                  <a
                    className="text-link cursor-pointer"
                    href={companyHref}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {companyName}
                  </a>
                ) : companyName}
              </h4>

              <h5 className={cn('text-[var(--theme-work-header)]', companyHref && 'cursor-text')}>
                {date}
              </h5>
            </div>
          </div>

          <p className={cn('text-body py-32 text-left', companyHref && 'cursor-text')}>
            {children}
          </p>

          <div className="pt-16 land:pt-8 pb-16 land:pb-32 text-left">
            {techKeys.map((techKey) => (
              <a
                className="btn-tag"
                href={TECH[techKey].href}
                key={`${companyName}-tech-${techKey}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {TECH[techKey].displayName}
              </a>
            ))}
          </div>

          {imgConfigs && onOpenLightbox && (
            <ImgTrio
              imgConfigs={imgConfigs}
              onOpenCarousel={openCarouselFromTrio}
            />
          )}
        </div>
      </Fade>
    </div>
  );
}

export default Work;
