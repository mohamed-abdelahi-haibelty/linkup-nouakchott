"use client";

import { format } from "date-fns";
import { CalendarIcon, ClockIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showTime?: boolean;
  timeFormat?: "12" | "24";
  minDate?: Date;
  maxDate?: Date;
  name?: string;
  onBlur?: () => void;
  error?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick a date and time",
  disabled = false,
  className,
  showTime = true,
  timeFormat = "12",
  minDate,
  maxDate,
  name,
  onBlur,
  error = false,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
  const [previousValue, setPreviousValue] = useState(value);
  if (value !== previousValue) {
    setPreviousValue(value);
    setSelectedDate(value);
  }
  const [timeInput, setTimeInput] = useState({
    date: selectedDate,
    format: timeFormat,
    value: "",
  });
  const timeValue =
    timeInput.date === selectedDate &&
    timeInput.format === timeFormat &&
    timeInput.value
      ? timeInput.value
      : selectedDate && showTime
        ? format(selectedDate, timeFormat === "12" ? "hh:mm a" : "HH:mm")
        : "";

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(undefined);
      onChange?.(undefined);
      return;
    }

    const newDate = new Date(date);

    // If we have an existing selected date with time, preserve the time
    if (selectedDate && showTime) {
      newDate.setHours(selectedDate.getHours());
      newDate.setMinutes(selectedDate.getMinutes());
      newDate.setSeconds(selectedDate.getSeconds());
    }

    setSelectedDate(newDate);
    onChange?.(newDate);
  };

  const handleTimeChange = (timeString: string) => {
    setTimeInput({ date: selectedDate, format: timeFormat, value: timeString });

    if (!selectedDate) return;

    const newDate = new Date(selectedDate);

    try {
      if (timeFormat === "12") {
        const match = timeString.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (match) {
          let hours = Number.parseInt(match[1]);
          const minutes = Number.parseInt(match[2]);
          const period = match[3].toUpperCase();

          if (period === "PM" && hours !== 12) hours += 12;
          if (period === "AM" && hours === 12) hours = 0;

          newDate.setHours(hours, minutes, 0, 0);
          setSelectedDate(newDate);
          onChange?.(newDate);
        }
      } else {
        const match = timeString.match(/^(\d{1,2}):(\d{2})$/);
        if (match) {
          const hours = Number.parseInt(match[1]);
          const minutes = Number.parseInt(match[2]);

          if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
            newDate.setHours(hours, minutes, 0, 0);
            setSelectedDate(newDate);
            onChange?.(newDate);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDisplayValue = () => {
    if (!selectedDate) return "";

    if (showTime) {
      const timeFormatString =
        timeFormat === "12" ? "MMM d, yyyy h:mm a" : "MMM d, yyyy HH:mm";
      return format(selectedDate, timeFormatString);
    }

    return format(selectedDate, "MMM d, yyyy");
  };

  const handlePopoverClose = (isOpen: boolean) => {
    if (isOpen && !selectedDate) {
      const now = new Date();
      setSelectedDate(now);
      onChange?.(now);
    }
    setOpen(isOpen);
    if (!isOpen) {
      onBlur?.();
    }
  };

  return (
    <Popover open={open} onOpenChange={handlePopoverClose}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start h-11 text-left bg-card hover:bg-muted hover:text-muted-foreground font-normal",
            !selectedDate && "text-muted-foreground",
            error && "border-destructive focus-visible:ring-destructive",
            className,
          )}
          disabled={disabled}
          name={name}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? formatDisplayValue() : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            defaultMonth={selectedDate || new Date()}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const checkDate = new Date(date);
              checkDate.setHours(0, 0, 0, 0);

              if (minDate) {
                const min = new Date(minDate);
                min.setHours(0, 0, 0, 0);
                if (checkDate < min) return true;
              }

              if (maxDate) {
                const max = new Date(maxDate);
                max.setHours(0, 0, 0, 0);
                if (checkDate > max) return true;
              }

              return false;
            }}
            initialFocus
          />

          {showTime && (
            <>
              <Separator className="my-3" />
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <ClockIcon className="h-4 w-4" />
                  Time
                </Label>
                <Input
                  placeholder={timeFormat === "12" ? "12:00 PM" : "12:00"}
                  value={timeValue}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {timeFormat === "12"
                    ? "Format: HH:MM AM/PM (e.g., 2:30 PM)"
                    : "Format: HH:MM (e.g., 14:30)"}
                </p>
              </div>
            </>
          )}

          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedDate(undefined);
                setTimeInput({
                  date: undefined,
                  format: timeFormat,
                  value: "",
                });
                onChange?.(undefined);
                setOpen(false);
              }}
              className="flex-1"
            >
              Clear
            </Button>
            <Button size="sm" onClick={() => setOpen(false)} className="flex-1">
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export interface DateTimePickerFieldProps extends Omit<
  DateTimePickerProps,
  "value" | "onChange" | "onBlur" | "name" | "error"
> {
  field: {
    value: Date | undefined;
    onChange: (value: Date | undefined) => void;
    onBlur: () => void;
    name: string;
  };
  fieldState: {
    error?: { message?: string };
  };
}

export function DateTimePickerField({
  field,
  fieldState,
  ...props
}: DateTimePickerFieldProps) {
  return (
    <DateTimePicker
      {...props}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      name={field.name}
      error={!!fieldState.error}
    />
  );
}
