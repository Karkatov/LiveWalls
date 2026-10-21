'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/** Аккордеон (Radix). Иконка раскрытия вращается через CSS-трансформацию. */
export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-border/60 border-b last:border-b-0', className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'group text-foreground hover:text-brand-foreground flex flex-1 items-start justify-between gap-4 py-5 text-left text-base font-medium transition-colors',
        'focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-4',
        '[&[data-state=open]>svg]:rotate-45',
        className,
      )}
      {...props}
    >
      {children}
      <Plus className="text-muted-foreground group-hover:text-brand-foreground mt-0.5 size-5 shrink-0 transition-transform duration-300" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      'text-muted-foreground overflow-hidden text-sm',
      'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
    )}
    {...props}
  >
    <div className={cn('pr-8 pb-5 leading-relaxed', className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
