"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, CaretDown, CaretUp } from "@phosphor-icons/react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { cn } from "./cn";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;
export const SelectGroup = SelectPrimitive.Group;
export const SelectLabel = SelectPrimitive.Label;
export const SelectSeparator = SelectPrimitive.Separator;

export const SelectTrigger = forwardRef<ElementRef<typeof SelectPrimitive.Trigger>, ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>>(({ className, children, ...props }, ref) => <SelectPrimitive.Trigger ref={ref} className={cn("focus-ring flex min-h-11 w-full items-center justify-between rounded-xl border border-black/15 bg-transparent px-3 py-2 text-left text-sm text-[var(--ink)]", className)} {...props}>{children}<SelectPrimitive.Icon><CaretDown size={16} /></SelectPrimitive.Icon></SelectPrimitive.Trigger>);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export const SelectContent = forwardRef<ElementRef<typeof SelectPrimitive.Content>, ComponentPropsWithoutRef<typeof SelectPrimitive.Content>>(({ className, children, position = "popper", ...props }, ref) => <SelectPrimitive.Portal><SelectPrimitive.Content ref={ref} position={position} className={cn("z-50 max-h-72 min-w-[8rem] overflow-hidden rounded-xl border border-black/10 bg-[var(--paper)] p-1 text-[var(--ink)] shadow-xl", className)} {...props}><SelectPrimitive.ScrollUpButton className="flex items-center justify-center py-1"><CaretUp size={14} /></SelectPrimitive.ScrollUpButton><SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport><SelectPrimitive.ScrollDownButton className="flex items-center justify-center py-1"><CaretDown size={14} /></SelectPrimitive.ScrollDownButton></SelectPrimitive.Content></SelectPrimitive.Portal>);
SelectContent.displayName = SelectPrimitive.Content.displayName;

export const SelectItem = forwardRef<ElementRef<typeof SelectPrimitive.Item>, ComponentPropsWithoutRef<typeof SelectPrimitive.Item>>(({ className, children, ...props }, ref) => <SelectPrimitive.Item ref={ref} className={cn("focus-ring relative flex min-h-10 cursor-pointer select-none items-center rounded-lg py-2 pl-8 pr-3 text-sm outline-none data-[highlighted]:bg-black/5", className)} {...props}><SelectPrimitive.ItemIndicator className="absolute left-2"><Check size={15} weight="bold" /></SelectPrimitive.ItemIndicator><SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText></SelectPrimitive.Item>);
SelectItem.displayName = SelectPrimitive.Item.displayName;
