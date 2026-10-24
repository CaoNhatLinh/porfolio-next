"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, Check, CircleNotch } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  createContactSchema,
  type ContactInput,
} from "../../features/contact/schema";
import { trackPortfolioEvent } from "./analytics-tracker";

type ContactFormProps = {
  locale: "vi" | "en";
  initiallySent?: boolean;
  defaultIntent?: NonNullable<ContactInput["intent"]>;
};

const intents = [
  {
    value: "hire",
    vi: "Trao đổi công việc",
    en: "Work enquiry",
  },
  {
    value: "general",
    vi: "Hỏi về kỹ thuật",
    en: "Technical question",
  },
  { value: "speaking", vi: "Kết nối / chia sẻ", en: "Connect / share" },
] as const;

export function ContactForm({
  locale,
  initiallySent = false,
  defaultIntent = "general",
}: ContactFormProps) {
  const copy = locale === "vi";
  const [startedAt] = useState(() => Date.now());
  const [sent, setSent] = useState(initiallySent);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(createContactSchema(locale)),
    defaultValues: {
      intent: defaultIntent,
      formStartedAt: startedAt,
      companyWebsite: "",
      timeline: "",
    },
  });
  const [intent, setIntent] =
    useState<NonNullable<ContactInput["intent"]>>(defaultIntent);
  useEffect(() => {
    if (defaultIntent === "hire") trackPortfolioEvent("hire_start");
  }, [defaultIntent]);

  async function submit(values: ContactInput) {
    setServerError("");
    let response: Response;
    try {
      response = await fetch(`/api/contact?lang=${locale}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
      });
    } catch {
      setServerError(copy ? "Mất kết nối. Nội dung vẫn được giữ lại; bạn hãy thử gửi lại." : "Connection failed. Your message is still here; please try again.");
      return;
    }
    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as {
        error?: { message?: string };
      } | null;
      setServerError(
        result?.error?.message ??
          (copy
            ? "Có lỗi xảy ra. Vui lòng thử lại."
            : "Something went wrong. Please try again."),
      );
      return;
    }
    trackPortfolioEvent("contact_submit");
    if (values.intent === "hire") trackPortfolioEvent("hire_submit");
    setSent(true);
    setIntent(defaultIntent);
    reset({
      intent: defaultIntent,
      formStartedAt: startedAt,
      companyWebsite: "",
      timeline: "",
    });
  }

  if (sent)
    return (
      <div className="border-t border-white/20 py-12" role="status">
        <Check size={30} className="text-[var(--accent)]" />
        <h2 className="display mt-7 text-5xl font-bold leading-[.88] md:text-7xl">
          {copy ? "Đã gửi tin nhắn." : "Message sent."}
        </h2>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-white/60">
          {copy
            ? "Tôi sẽ phản hồi qua email bạn đã nhập."
            : "I'll reply to the email address you provided."}
        </p>
        <button
          type="button"
          className="button-quiet mt-8"
          onClick={() => setSent(false)}
        >
          {copy ? "Gửi tin khác" : "Send another note"}
        </button>
      </div>
    );

  return (
    <form
      action={`/api/contact?lang=${locale}`}
      method="post"
      onSubmit={handleSubmit(submit)}
      className="space-y-7"
      noValidate
    >
      <input
        {...register("companyWebsite")}
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-px w-px opacity-0"
        aria-hidden="true"
      />
      <input
        type="hidden"
        {...register("formStartedAt", { valueAsNumber: true })}
      />
      <fieldset className="space-y-3">
        <legend className="mono text-[10px] uppercase tracking-[.14em] text-white/50">
          {copy ? "Mình có thể giúp gì?" : "What can I help with?"}
        </legend>
        <input type="hidden" {...register("intent")} />
        <div className="grid gap-2 sm:grid-cols-3">
          {intents.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={intent === item.value}
              onClick={() => {
                setIntent(item.value);
                setValue("intent", item.value, { shouldValidate: true });
              }}
              className={`flex min-h-14 items-center border px-3 text-left text-sm transition-colors focus-ring ${intent === item.value ? "border-[var(--accent)] bg-[var(--accent)]/10 text-white" : "border-white/15 text-white/60 hover:border-white/35"}`}
            >
              <span>{copy ? item.vi : item.en}</span>
            </button>
          ))}
        </div>
        {errors.intent && (
          <p className="text-xs text-[#ff9b83]">{errors.intent.message}</p>
        )}
      </fieldset>
      <div className="grid gap-7 md:grid-cols-2">
        <Field
          label={copy ? "Tên của bạn" : "Your name"}
          error={errors.name?.message}
        >
          <input
            {...register("name")}
            autoComplete="name"
            className="form-input"
            placeholder={copy ? "Cao Nhật Linh" : "Your name"}
            aria-invalid={Boolean(errors.name)}
          />
        </Field>
        <Field label={copy ? "Email" : "Email"} error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            className="form-input"
            placeholder="you@company.com"
            aria-invalid={Boolean(errors.email)}
          />
        </Field>
      </div>
      <Field
        label={intent === "hire" ? (copy ? "Bạn muốn xây sản phẩm gì?" : "What would you like to build?") : (copy ? "Chủ đề bạn muốn trao đổi" : "What would you like to discuss?")}
        error={errors.project?.message}
      >
        <input
          {...register("project")}
          className="form-input"
          placeholder={
            intent === "hire" ? (copy ? "Website hoặc ứng dụng bạn muốn xây" : "The website or app you want to build") : (copy ? "Điều bạn muốn trao đổi" : "What you'd like to discuss")
          }
          aria-invalid={Boolean(errors.project)}
        />
      </Field>
      {intent === "hire" && <div className="grid gap-7 md:grid-cols-2">
        <Field
          label={copy ? "Thời gian dự kiến" : "When are you hoping to start?"}
          error={errors.timeline?.message}
        >
          <select {...register("timeline")} className="form-input">
            <option value="">
              {copy ? "Chọn nếu đã biết" : "Choose if you know"}
            </option>
            <option value="now">{copy ? "Ngay bây giờ" : "Now"}</option>
            <option value="1-3-months">
              {copy ? "Trong 1-3 tháng" : "Within 1-3 months"}
            </option>
            <option value="exploring">
              {copy ? "Đang tìm hiểu" : "Just exploring"}
            </option>
          </select>
        </Field>
        <Field
          label={copy ? "Ngân sách dự kiến" : "Budget range"}
          error={errors.budgetRange?.message}
        >
          <select {...register("budgetRange")} className="form-input">
            <option value="">
              {copy ? "Chọn nếu đã biết" : "Choose if you know"}
            </option>
            <option value="under-5k">&lt; $5k</option>
            <option value="5k-15k">$5k - $15k</option>
            <option value="15k-plus">$15k+</option>
          </select>
        </Field>
      </div>}
      <Field
        label={
          copy
            ? "Website hiện tại (không bắt buộc)"
            : "Current website (optional)"
        }
        error={errors.website?.message}
      >
        <input
          {...register("website")}
          type="url"
          className="form-input"
          placeholder="https://"
        />
      </Field>
      <Field
        label={copy ? "Thêm một chút bối cảnh" : "A little more context"}
        error={errors.message?.message}
      >
        <textarea
          {...register("message")}
          className="form-input min-h-36 resize-y"
          placeholder={
            copy
              ? "Mục tiêu, điều đang vướng, điều bạn muốn thay đổi..."
              : "Goals, what feels stuck, what you want to change..."
          }
        />
      </Field>
      {serverError && (
        <p className="text-sm text-[#ff9b83]" role="alert">
          {serverError}
        </p>
      )}
      <button type="submit" className="button-accent" disabled={isSubmitting}>
        {isSubmitting ? (
          <CircleNotch size={18} className="animate-spin" />
        ) : (
          <ArrowUpRight size={18} weight="bold" />
        )}
        {isSubmitting
          ? copy
            ? "Đang gửi"
            : "Sending"
          : intent === "hire"
            ? copy
              ? "Gửi brief"
              : "Send the brief"
            : copy
              ? "Gửi tin nhắn"
              : "Send the note"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mono text-[10px] uppercase tracking-[.14em] text-white/50">
        {label}
      </span>
      <span className="mt-2 block">{children}</span>
      {error && (
        <span className="mt-2 block text-xs text-[#ff9b83]">{error}</span>
      )}
    </label>
  );
}
