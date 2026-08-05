'use client';

import { Children, cloneElement, isValidElement, useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './FoldText.css';

/* ScrollTrigger touches the document as soon as it registers, and every page
   here is a client component that still gets server-rendered for the first
   paint. Register once the browser exists. */
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const HINGE_CONFIG = {
  top: { origin: '50% 0%', rotateX: -92, rotateY: 0 },
  bottom: { origin: '50% 100%', rotateX: 92, rotateY: 0 },
  left: { origin: '0% 50%', rotateX: 0, rotateY: 92 },
  right: { origin: '100% 50%', rotateX: 0, rotateY: -92 },
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/* One hinged piece. The outer span owns the perspective, the inner one is what
   GSAP rotates — separating them keeps the transform off the element that
   establishes the vanishing point. */
const foldPiece = (content, key, ctx, split) => (
  <span
    className="fold-text-segment"
    data-fold-split={split}
    key={key}
    style={{ '--fold-perspective': `${ctx.perspective}px` }}
  >
    <span className="fold-text-piece" data-fold-hinge={ctx.hinge} style={ctx.pieceStyle}>
      {content}
    </span>
  </span>
);

const renderWhitespace = (value, key) =>
  value.split(/(\n)/).map((part, index) => {
    if (part === '\n') return <br key={`${key}-br-${index}`} />;
    if (!part) return null;

    return (
      <span className="fold-text-whitespace" key={`${key}-space-${index}`}>
        {part}
      </span>
    );
  });

const splitString = (value, ctx, keyPrefix) => {
  if (!value) return [];

  if (ctx.splitBy === 'line') {
    return value.split('\n').map((line, index) => (
      <span className="fold-text-line" key={`${keyPrefix}-line-${index}`}>
        {foldPiece(line || ' ', `${keyPrefix}-line-${index}-piece`, ctx, 'line')}
      </span>
    ));
  }

  return value.split(/(\s+)/).flatMap((part, index) => {
    if (!part) return [];
    if (/^\s+$/.test(part)) return renderWhitespace(part, `${keyPrefix}-ws-${index}`);

    if (ctx.splitBy === 'char') {
      return (
        <span className="fold-text-word" key={`${keyPrefix}-word-${index}`}>
          {Array.from(part).map((char, charIndex) =>
            foldPiece(char, `${keyPrefix}-word-${index}-char-${charIndex}`, ctx, 'char')
          )}
        </span>
      );
    }

    return foldPiece(part, `${keyPrefix}-word-${index}`, ctx, 'word');
  });
};

/* A gradient text fill is painted by the element that carries it and clipped to
   the glyphs inside it, so it cannot survive being cut into per-word spans.
   Those elements fold as a single piece with their markup left alone. */
const carriesOwnFill = element => {
  const elementStyle = element.props?.style;
  if (!elementStyle) return false;
  return elementStyle.WebkitBackgroundClip === 'text' || elementStyle.backgroundClip === 'text';
};

/* Walks the JSX handed in and rebuilds it with the text split into hinged
   pieces. Wrapper elements are cloned rather than flattened, so a heading keeps
   the spans, classes and inline styles it was written with. */
const renderNodes = (node, ctx, keyPrefix) => {
  if (node === null || node === undefined || typeof node === 'boolean') return [];

  if (typeof node === 'string' || typeof node === 'number') {
    return splitString(String(node), ctx, keyPrefix);
  }

  if (Array.isArray(node)) {
    return Children.toArray(node).flatMap((child, index) =>
      renderNodes(child, ctx, `${keyPrefix}-${index}`)
    );
  }

  if (isValidElement(node)) {
    if (node.type === 'br') return [cloneElement(node, { key: `${keyPrefix}-br` })];

    if (carriesOwnFill(node) || node.props?.children == null) {
      return [foldPiece(node, `${keyPrefix}-node`, ctx, 'node')];
    }

    return [
      cloneElement(
        node,
        { key: `${keyPrefix}-wrap` },
        renderNodes(node.props.children, ctx, `${keyPrefix}-wrap`)
      ),
    ];
  }

  return [];
};

const nodeToText = node => {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join('');
  if (isValidElement(node)) return node.type === 'br' ? '\n' : nodeToText(node.props?.children);
  return '';
};

const FoldText = ({
  as: Tag = 'span',
  text = '',
  children,
  splitBy = 'char',
  hinge = 'top',
  duration = 0.65,
  stagger = 0.045,
  ease = 'power3.out',
  perspective = 700,
  creaseShading = 0.55,
  trigger = 'mount',
  once = false,
  fontSize,
  fontWeight,
  color,
  className = '',
  style,
  ...rest
}) => {
  const rootRef = useRef(null);
  const timelineRef = useRef(null);
  const hingeConfig = HINGE_CONFIG[hinge] || HINGE_CONFIG.top;
  const safeCrease = clamp(creaseShading, 0, 1);
  const safePerspective = Math.max(120, perspective);

  const source = children ?? text;
  const plainText = useMemo(() => nodeToText(source), [source]);

  /* Hover starts from a settled heading; every other trigger plays the fold in,
     so the pieces are rendered hidden and never flash before GSAP arms them. */
  const startsHidden = trigger !== 'hover';

  const segments = useMemo(() => {
    const ctx = {
      splitBy,
      hinge,
      perspective: safePerspective,
      pieceStyle: {
        transformOrigin: hingeConfig.origin,
        '--fold-crease': 0,
        ...(startsHidden ? { opacity: 0 } : null),
      },
    };

    return renderNodes(source, ctx, 'fold');
  }, [source, splitBy, hinge, hingeConfig.origin, safePerspective, startsHidden]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const root = rootRef.current;
    if (!root) return undefined;

    const pieces = Array.from(root.querySelectorAll('.fold-text-piece'));
    if (!pieces.length) return undefined;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const activeDuration = reduceMotion ? Math.min(duration, 0.22) : duration;
    const activeStagger = reduceMotion ? Math.min(stagger, 0.02) : stagger;
    const fromVars = {
      opacity: 0,
      rotateX: reduceMotion ? 0 : hingeConfig.rotateX,
      rotateY: reduceMotion ? 0 : hingeConfig.rotateY,
      '--fold-crease': reduceMotion ? 0 : safeCrease,
      transformOrigin: hingeConfig.origin,
      force3D: true,
    };
    const toVars = {
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      '--fold-crease': 0,
      duration: activeDuration,
      ease: reduceMotion ? 'power1.out' : ease,
      stagger: activeStagger,
      clearProps: 'willChange',
    };

    const killTimeline = () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
      gsap.killTweensOf(pieces);
    };

    const play = repeat => {
      killTimeline();
      timelineRef.current = gsap.timeline({
        repeat: repeat ? -1 : 0,
        repeatDelay: repeat ? 0.75 : 0,
      });
      timelineRef.current.fromTo(pieces, fromVars, toVars);
      return timelineRef.current;
    };

    /* Back to the folded-away state, ready to play again the next time the
       heading crosses into view. */
    const rewind = () => {
      killTimeline();
      gsap.set(pieces, fromVars);
    };

    let scrollTrigger;
    let hoverHandler;

    if (trigger === 'hover') {
      gsap.set(pieces, {
        opacity: 1,
        rotateX: 0,
        rotateY: 0,
        '--fold-crease': 0,
        transformOrigin: hingeConfig.origin,
      });
      hoverHandler = () => play(false);
      root.addEventListener('mouseenter', hoverHandler);
    } else if (trigger === 'scroll') {
      gsap.set(pieces, fromVars);
      /* Unless `once`, the heading re-folds once it has left the viewport in
         either direction, so it plays again on the way back rather than sitting
         already-unfolded for the rest of the session. The rewind happens off
         screen — past `end` going down, past `start` coming up. */
      scrollTrigger = ScrollTrigger.create({
        trigger: root,
        start: 'top 88%',
        once,
        onEnter: () => play(false),
        onEnterBack: once ? undefined : () => play(false),
        onLeave: once ? undefined : rewind,
        onLeaveBack: once ? undefined : rewind,
      });
    } else if (trigger === 'loop') {
      play(true);
    } else {
      play(false);
    }

    return () => {
      if (hoverHandler) root.removeEventListener('mouseenter', hoverHandler);
      scrollTrigger?.kill();
      killTimeline();
    };
  }, [
    plainText,
    splitBy,
    hinge,
    duration,
    stagger,
    ease,
    perspective,
    safeCrease,
    trigger,
    once,
    hingeConfig.origin,
    hingeConfig.rotateX,
    hingeConfig.rotateY,
  ]);

  /* Typography is only forced when a caller asks for it. Left alone, the
     heading keeps its own classes. */
  const rootStyle = { ...style };
  if (fontSize !== undefined) {
    rootStyle.fontSize = typeof fontSize === 'number' ? `${fontSize}px` : fontSize;
  }
  if (fontWeight !== undefined) rootStyle.fontWeight = fontWeight;
  if (color !== undefined) rootStyle.color = color;

  return (
    <Tag ref={rootRef} className={`fold-text ${className}`.trim()} style={rootStyle} {...rest}>
      <span className="fold-text-sr-only">{plainText}</span>
      <span className="fold-text-visual" aria-hidden="true">
        {segments}
      </span>
    </Tag>
  );
};

export default FoldText;
