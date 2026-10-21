import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, X } from "lucide-react";
import { DateTime } from "luxon";
import { SCHEDULE_ZONE, labelTime, localToday } from "../shared/schedule";
import type { Availability } from "../shared/quote";
interface Props {
  date: string;
  time: string;
  onChange: (date: string, time: string) => void;
  disabled?: boolean;
  refreshKey?: number;
}
export default function AppointmentPicker({
  date: selectedDate,
  time: selectedTime,
  onChange,
  disabled = false,
  refreshKey = 0,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(selectedDate);
  const [time, setTime] = useState(selectedTime);
  const dismiss = () => {
    dialog.current?.close();
    setOpen(false);
    trigger.current?.focus();
  };
  const show = () => {
    setDate(selectedDate);
    setTime(selectedTime);
    setMonth(
      DateTime.fromISO(selectedDate || localToday(), {
        zone: SCHEDULE_ZONE,
      }).startOf("month"),
    );
    setOpen(true);
    dialog.current?.showModal();
  };
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  const today = DateTime.now().setZone(SCHEDULE_ZONE).startOf("day"),
    max = today.plus({ days: 90 });
  const [month, setMonth] = useState(() => today.startOf("month"));
  const [availability, setAvailability] = useState<Availability | null>(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false),
    [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!open || !date) {
      setAvailability(null);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setAvailability(null);
    fetch(`/api/availability?date=${encodeURIComponent(date)}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw Error(body.error || "Could not load times.");
        return body as Availability;
      })
      .then(setAvailability)
      .catch((e) => {
        if (!controller.signal.aborted)
          setError(e instanceof Error ? e.message : "Could not load times.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [open, date, retry, refreshKey]);
  const leading = month.weekday % 7;
  const days = Array.from(
    { length: Math.ceil((leading + month.daysInMonth!) / 7) * 7 },
    (_, i) => {
      const day = i - leading + 1;
      return day > 0 && day <= month.daysInMonth! ? month.set({ day }) : null;
    },
  );
  return (
    <div className="appointment-field">
      <label htmlFor="appointment-trigger">Preferred date & time *</label>
      <button
        ref={trigger}
        id="appointment-trigger"
        className="appointment-trigger"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="appointment-dialog"
        disabled={disabled}
        onClick={show}
      >
        <CalendarDays size={18} />
        <span>
          {selectedDate && selectedTime
            ? `${DateTime.fromISO(selectedDate).toFormat("MMM d, yyyy")} · ${labelTime(selectedTime)}`
            : "Choose a date and time"}
        </span>
        <ChevronRight size={16} />
      </button>
      <p className="fine-print">Calgary time · 9:00 AM–8:00 PM</p>
      <dialog
        ref={dialog}
        id="appointment-dialog"
        className="appointment-dialog"
        aria-labelledby="appointment-dialog-title"
        onCancel={(e) => {
          e.preventDefault();
          dismiss();
        }}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
        onClick={(e) => {
          if (e.target !== e.currentTarget) return;
          const rect = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
          )
            dismiss();
        }}
      >
        <div className="appointment-popup">
          <header className="appointment-popup-header">
            <div>
              <p className="eyebrow">YOUR PREFERRED VISIT</p>
              <h3 id="appointment-dialog-title">Choose date & time</h3>
            </div>
            <button
              type="button"
              className="appointment-close"
              aria-label="Close date and time picker"
              onClick={dismiss}
            >
              <X size={20} />
            </button>
          </header>
          <fieldset className="appointment-picker" disabled={disabled}>
            <legend className="sr-only">Preferred date and time</legend>

            <p className="appointment-zone">
              Calgary time · 9:00 AM–8:00 PM · 30-minute intervals
            </p>
            <div className="calendar-header">
              <button
                type="button"
                aria-label="Previous month"
                disabled={month <= today.startOf("month")}
                onClick={() => setMonth(month.minus({ months: 1 }))}
              >
                <ChevronLeft size={18} />
              </button>
              <strong aria-live="polite">{month.toFormat("MMMM yyyy")}</strong>
              <button
                type="button"
                aria-label="Next month"
                disabled={month.plus({ months: 1 }) > max.endOf("month")}
                onClick={() => setMonth(month.plus({ months: 1 }))}
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="calendar-week" aria-hidden="true">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
            <div
              className="calendar-days"
              aria-label="Choose a date"
              onKeyDown={(e) => {
                const delta: Record<string, number> = {
                  ArrowRight: 1,
                  ArrowLeft: -1,
                  ArrowDown: 7,
                  ArrowUp: -7,
                };
                if (!(e.key in delta)) return;
                const buttons = Array.from(
                  e.currentTarget.querySelectorAll<HTMLButtonElement>("button"),
                );
                const index = buttons.indexOf(e.target as HTMLButtonElement);
                if (index < 0) return;
                e.preventDefault();
                let next = index + delta[e.key];
                while (
                  next >= 0 &&
                  next < buttons.length &&
                  buttons[next].disabled
                )
                  next += Math.sign(delta[e.key]);
                buttons[next]?.focus();
              }}
            >
              {days.map((d, i) =>
                d ? (
                  <button
                    key={d.toISODate()}
                    type="button"
                    aria-label={d.toFormat("cccc, MMMM d, yyyy")}
                    aria-pressed={date === d.toISODate()}
                    aria-current={
                      d.toISODate() === localToday() ? "date" : undefined
                    }
                    disabled={d < today || d > max}
                    className={date === d.toISODate() ? "selected" : ""}
                    onClick={() => {
                      setDate(d.toISODate()!);
                      setTime("");
                    }}
                  >
                    {d.day}
                  </button>
                ) : (
                  <span key={`blank-${i}`} />
                ),
              )}
            </div>
            <div className="time-picker">
              <label htmlFor="appointment-time">
                Preferred time
                {date ? ` · ${DateTime.fromISO(date).toFormat("MMM d")}` : ""}
              </label>
              <select
                id="appointment-time"
                value={time}
                disabled={
                  !date || loading || !!error || !availability?.slots.length
                }
                onChange={(e) => setTime(e.target.value)}
              >
                <option value="">
                  {!date
                    ? "Choose a date first"
                    : loading
                      ? "Loading available times…"
                      : !availability?.slots.length
                        ? "No available times"
                        : "Choose a time"}
                </option>
                {availability?.slots.map((t) => (
                  <option key={t} value={t}>
                    {labelTime(t)}
                  </option>
                ))}
              </select>
              {error && (
                <p className="form-error" role="alert">
                  {error}{" "}
                  <button type="button" onClick={() => setRetry((v) => v + 1)}>
                    Retry
                  </button>
                </p>
              )}
              {date &&
                !loading &&
                !error &&
                availability &&
                !availability.slots.length && (
                  <p className="fine-print">
                    No times remain on this date. Please choose another day.
                  </p>
                )}
            </div>
            <p className="fine-print">
              Preferred start time only. We confirm availability and service
              duration before booking.
            </p>
          </fieldset>
          <footer className="appointment-popup-actions">
            <button type="button" className="btn secondary" onClick={dismiss}>
              Cancel
            </button>
            <button
              type="button"
              className="btn"
              disabled={
                !date ||
                !time ||
                loading ||
                !!error ||
                !availability?.slots.includes(time)
              }
              onClick={() => {
                onChange(date, time);
                dismiss();
              }}
            >
              Confirm selection
            </button>
          </footer>
        </div>
      </dialog>
    </div>
  );
}
