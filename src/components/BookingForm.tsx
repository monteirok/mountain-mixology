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
      console.log("Booking response:", data);

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
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white/80">Name *</span>
          <input
            required
            value={form.name}
            onChange={handleChange("name")}
            className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white outline-none transition focus:border-mountain-gold focus:ring-2 focus:ring-mountain-gold"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white/80">Email *</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white outline-none transition focus:border-mountain-gold focus:ring-2 focus:ring-mountain-gold"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white/80">Phone</span>
          <input
            value={form.phone}
            onChange={handleChange("phone")}
            className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white outline-none transition focus:border-mountain-gold focus:ring-2 focus:ring-mountain-gold"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white/80">Event Date</span>
          <input
            type="date"
            value={form.eventDate}
            onChange={handleChange("eventDate")}
            className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white outline-none transition focus:border-mountain-gold focus:ring-2 focus:ring-mountain-gold"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white/80">Guests</span>
          <input
            value={form.guests}
            onChange={handleChange("guests")}
            placeholder="Approximate number of guests"
            className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white outline-none transition focus:border-mountain-gold focus:ring-2 focus:ring-mountain-gold"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white/80">Venue</span>
          <input
            value={form.venue}
            onChange={handleChange("venue")}
            className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white outline-none transition focus:border-mountain-gold focus:ring-2 focus:ring-mountain-gold"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-white/80">Notes</span>
        <textarea
          rows={4}
          value={form.notes}
          onChange={handleChange("notes")}
          className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white outline-none transition focus:border-mountain-gold focus:ring-2 focus:ring-mountain-gold"
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
        <p className="text-sm font-medium text-emerald-300">{status.message}</p>
      ) : null}

      {status.type === "error" ? (
        <p className="text-sm font-medium text-red-400">{status.message}</p>
      ) : null}
    </form>
  );
}
