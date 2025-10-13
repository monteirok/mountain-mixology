'use client'

import { FormEvent, useState } from "react";

type BookingFormState = {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guests: string;
  venue: string;
  notes: string;
};

type SubmissionStatus =
  | { type: "idle" }
  | { type: "submitting" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const initialState: BookingFormState = {
  name: "",
  email: "",
  phone: "",
  eventDate: "",
  guests: "",
  venue: "",
  notes: "",
};

export default function BookingForm() {
  const [form, setForm] = useState<BookingFormState>(initialState);
  const [status, setStatus] = useState<SubmissionStatus>({ type: "idle" });
  const labelClass = "flex flex-col gap-2";
  const labelTextClass = "text-sm font-medium text-charcoal/80 dark:text-white/80";
  const inputClass =
    "rounded-lg border border-charcoal/15 bg-white/95 px-3 py-2 text-charcoal placeholder:text-charcoal/40 shadow-sm outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/20 dark:border-white/15 dark:bg-white/10 dark:text-white dark:placeholder:text-white/50";

  const handleChange =
    (field: keyof BookingFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: "submitting" });

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        const errorMessage = data?.error ?? "Submission failed.";
        setStatus({ type: "error", message: errorMessage });
        return;
      }

      setStatus({
        type: "success",
        message: "Thanks! We received your booking request.",
      });
      setForm(initialState);
    } catch (error) {
      console.error("Booking submission error:", error);
      setStatus({
        type: "error",
        message: "We couldn’t submit your booking. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className={labelClass}>
          <span className={labelTextClass}>Name *</span>
          <input
            required
            value={form.name}
            onChange={handleChange("name")}
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          <span className={labelTextClass}>Email *</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          <span className={labelTextClass}>Phone</span>
          <input
            value={form.phone}
            onChange={handleChange("phone")}
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          <span className={labelTextClass}>Event Date</span>
          <input
            type="date"
            value={form.eventDate}
            onChange={handleChange("eventDate")}
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          <span className={labelTextClass}>Guests</span>
          <input
            value={form.guests}
            onChange={handleChange("guests")}
            placeholder="Approximate number of guests"
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          <span className={labelTextClass}>Venue</span>
          <input
            value={form.venue}
            onChange={handleChange("venue")}
            className={inputClass}
          />
        </label>
      </div>

      <label className={labelClass}>
        <span className={labelTextClass}>Notes</span>
        <textarea
          rows={4}
          value={form.notes}
          onChange={handleChange("notes")}
          className={`${inputClass} resize-none`}
        />
      </label>

      <button
        type="submit"
        disabled={status.type === "submitting"}
        className="inline-flex items-center justify-center rounded-full bg-mountain-gold px-6 py-3 font-semibold text-charcoal transition hover:bg-copper disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status.type === "submitting" ? "Submitting..." : "Submit Booking"}
      </button>

      {status.type === "success" ? (
        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-300">{status.message}</p>
      ) : null}

      {status.type === "error" ? (
        <p className="text-sm font-medium text-red-500 dark:text-red-400">{status.message}</p>
      ) : null}
    </form>
  );
}
