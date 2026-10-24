"use client";

import { Archive } from "@phosphor-icons/react";
import type { FormEvent } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";

export function ArchiveConfirm({ id, entity, action }: { id: string; entity: string; action: (formData: FormData) => Promise<void> }) {
  function confirm(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    if (!form.checkValidity()) event.preventDefault();
  }

  return <AlertDialog><AlertDialogTrigger asChild><Button variant="danger"><Archive size={14} /> Archive</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogTitle>Archive this {entity}?</AlertDialogTitle><AlertDialogDescription>It will leave the public site but remain recoverable from the admin list. You can restore it later.</AlertDialogDescription><AlertDialogFooter><AlertDialogCancel>Keep it</AlertDialogCancel><form action={action} onSubmit={confirm}><input type="hidden" name="id" value={id} /><AlertDialogAction asChild><button type="submit">Archive</button></AlertDialogAction></form></AlertDialogFooter></AlertDialogContent></AlertDialog>;
}
