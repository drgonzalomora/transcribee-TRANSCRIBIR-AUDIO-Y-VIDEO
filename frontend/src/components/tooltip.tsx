import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { usePopper } from 'react-popper';

export function Tooltip({
  children,
  tooltipText,
  ...props
}: {
  children?: React.ReactNode;
  tooltipText: string;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom',
    modifiers: [
      {
        name: 'flip',
        options: {
          fallbackPlacements: ['top'],
          flipVariations: true,
        },
      },
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
      {
        name: 'arrow',
        options: {
          element: arrowElement,
        },
      },
    ],
  });

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (referenceElement === null) {
      return;
    }
    const showEvents = ['mouseenter', 'focus'];
    const hideEvents = ['mouseleave', 'blur'];

    const show = () => setShow(true);
    const hide = () => setShow(false);

    showEvents.forEach((event) => {
      referenceElement.addEventListener(event, show);
    });

    hideEvents.forEach((event) => {
      referenceElement.addEventListener(event, hide);
    });
    return () => {
      showEvents.forEach((event) => {
        referenceElement.removeEventListener(event, show);
      });

      hideEvents.forEach((event) => {
        referenceElement.removeEventListener(event, hide);
      });
    };
  }, [referenceElement]);

  return (
    <div ref={setReferenceElement}>
      {children}
      {show && tooltipText ? (
        <div
          {...props}
          className={clsx(
            'p-4',
            'bg-white dark:bg-neutral-900',
            'border-black dark:border-neutral-200',
            'border-2',
            'shadow-brutal',
            'shadow-slate-400 dark:shadow-neutral-600',
            'rounded-lg',
            'relative',
            'z-10',
          )}
          style={styles.popper}
          ref={setPopperElement}
          {...attributes.popper}
        >
          {tooltipText}
          <div
            ref={setArrowElement}
            style={styles.arrow}
            className={clsx(
              'top-[-7px]',
              'before:absolute',
              'before:w-[11px]',
              'before:h-[11px]',
              'before:bg-white dark:before:bg-neutral-900',
              "before:content-['']",
              'before:translate-x-[-6px]',
              'before:rotate-45',
              'before:border-l-2',
              'before:border-t-2',
              'before:border-solid',
              'before:border-black dark:before:border-neutral-200',
            )}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}