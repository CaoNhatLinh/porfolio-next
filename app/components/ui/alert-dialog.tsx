"use client";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { cn } from "./cn";

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogCancel = forwardRef<ElementRef<typeof AlertDialogPrimitive.Cancel>, ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>>(({ className, ...props }, ref) => <AlertDialogPrimitive.Cancel ref={ref} className={cn("focus-ring inline-flex min-h-11 items-center justify-center rounded-full border border-black/15 px-4 py-2 text-sm hover:bg-black/5", className)} {...props} />);
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
export const AlertDialogAction = forwardRef<ElementRef<typeof AlertDialogPrimitive.Action>, ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>>(({ className, ...props }, ref) => <AlertDialogPrimitive.Action ref={ref} className={cn("focus-ring inline-flex min-h-11 items-center justify-center rounded-full bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800", className)} {...props} />);
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
export const AlertDialogTitle = forwardRef<ElementRef<typeof AlertDialogPrimitive.Title>, ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>>(({ className, ...props }, ref) => <AlertDialogPrimitive.Title ref={ref} className={cn("display text-3xl font-bold leading-[.9]", className)} {...props} />);
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
export const AlertDialogDescription = forwardRef<ElementRef<typeof AlertDialogPrimitive.Description>, ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>>(({ className, ...props }, ref) => <AlertDialogPrimitive.Description ref={ref} className={cn("mt-4 text-sm leading-relaxed text-black/60", className)} {...props} />);
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

export const AlertDialogContent = forwardRef<ElementRef<typeof AlertDialogPrimitive.Content>, ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>>(({ className, ...props }, ref) => <AlertDialogPrimitive.Portal><AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[var(--ink)]/65 backdrop-blur-sm" /><AlertDialogPrimitive.Content ref={ref} className={cn("fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-black/10 bg-[var(--paper)] p-7 text-[var(--ink)] shadow-2xl md:p-9", className)} {...props} /></AlertDialogPrimitive.Portal>);
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

export function AlertDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-8 flex flex-wrap justify-end gap-3", className)} {...props} />;
}
