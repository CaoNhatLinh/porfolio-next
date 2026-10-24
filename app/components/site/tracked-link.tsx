"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { trackPortfolioEvent } from "./analytics-tracker";

type TrackedLinkProps = LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { eventName: string };

export function TrackedLink({ eventName, onClick, ...props }: TrackedLinkProps) {
  return <Link {...props} onClick={(event) => { trackPortfolioEvent(eventName); onClick?.(event); }} />;
}
