//CreateEventForm.tsx
"use client";

import { createEvent } from "@/app/[locale]/actions/events/organizer/createEvent";
import { DateTimePickerField } from "@/components/shared/dateTimePicker";
import EventTags from "@/components/shared/EventTags";
import FileUploadComponent from "@/components/shared/FileUploadComponent";
import { NotificationPermissionDialog } from "@/components/shared/NotificationPermissionDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { tagList } from "@/lib/constant";
import { cn } from "@/lib/utils";
import { EventFormInput } from "@/lib/validation/event";
import { ArrowLeft, DollarSign, Info, Loader2, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function CreateEventForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const t = useTranslations("events.create.form");
  const posthog = usePostHog();
  posthog.capture("event_creation_started", {
    source: "event_create_page",
  });

  const form = useForm<EventFormInput>({
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      tag: undefined,
      startTime: undefined,
      endTime: undefined,
      registrationDeadline: undefined,
      isFree: true,
      price: 0,
      location: "",
      contactPhone: "",
      capacity: 0,
    },
  });

  const isFree = form.watch("isFree");

  const onSubmit = (values: EventFormInput) => {
    startTransition(async () => {
      const res = await createEvent(values);

      if (!res) {
        toast.error(t("errorGeneric")); // "Something went wrong. Please try again."
        return;
      }

      if (res.success) {
        // Success case
        toast.success(res.message || t("success")); // "Event created successfully!"
        form.reset();

        posthog.capture("event_created", {
          source: "event_create_page",
        });

        // ----- NEW: check user preference -----
        const optOut = localStorage.getItem("notifications_opt_out") === "true";
        if (optOut) {
          router.push("/events/");
          return;
        }

        const permission = Notification.permission;
        // Case 1: User already granted → do NOT show dialog
        if (permission === "granted") {
          const registration = await navigator.serviceWorker.getRegistration();
          const existingSub = await registration?.pushManager.getSubscription();

          if (existingSub) {
            router.push("/events/");
            return;
          }

          // Subscription missing → auto subscribe without showing dialog
          setShowPermissionDialog(true);
          return;
        }

        // Case 2: Denied → cannot ask again → skip dialog
        if (permission === "denied") {
          router.push("/events/");
          return;
        }

        // Case 3: Default (first time ever) → show dialog
        if (permission === "default") {
          setShowPermissionDialog(true);
          return;
        }
      } else {
        // Error case
        if (res.message) {
          // General error message (database errors, etc.)
          toast.error(res.message);
        }

        // Map field-specific validation errors into form
        if (res.error) {
          Object.entries(res.error).forEach(([key, value]) => {
            if (key in values) {
              form.setError(key as keyof EventFormInput, {
                type: "server",
                message: value?.[0],
              });
            }
          });

          // Show a toast for validation errors
          toast.error(t("validationError")); // "Please check the form for errors."
        }
      }
    });
  };

  return (
    <div className="">
      <NotificationPermissionDialog
        open={showPermissionDialog}
        onComplete={() => {
          setShowPermissionDialog(false);
          router.push("/events/");
        }}
      />
      <div className="flex items-center gap-x-3 border-b border-dashed pb-3">
        <Button
          className="hover:text-foreground hover:border-accent border border-transparent hover:bg-white/60 transition duration-75"
          size={"sm"}
          variant={"ghost"}
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="font-bold text-xl">
            {t("createNewEvent")} {/* "Create new event" */}
          </h1>
          <p className="text-xs text-muted-foreground">
            {t("setupDetails")} {/* "Set up your event details and schedule" */}
          </p>
        </div>
      </div>

      <div className="p-3 rounded bg-red-100 text-red-800 text-sm mt-2">
        {t("adminApprovalNotice")}
        {/* "Created events must be approved by an administrator before they become visible." */}
      </div>

      <Alert className="mt-2 border-blue-200 bg-blue-50 text-blue-800">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm">
          <strong>{t("important")}</strong> {t("phoneRequirement")}
          {/* "Your contact phone number must include the country code..." */}
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("titleLabel")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("titlePlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("descriptionLabel")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("descriptionPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-y-3 md:grid-cols-2 md:gap-x-6 border-b border-dashed pb-8">
            <div className="">
              <FormField
                name="tag"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("categoryLabel")}</FormLabel>

                    <EventTags
                      selectedTag={field.value}
                      onChange={field.onChange}
                      tags={tagList}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                name="imageUrl"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("imageLabel")}</FormLabel>
                    <FileUploadComponent
                      value={field.value}
                      endpoint="eventImage"
                      onImageChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="mt-8 grid items-start grid-cols-1 gap-y-4 md:grid-cols-3 md:gap-x-6">
            <FormField
              name="startTime"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t("startTime")}</FormLabel>
                  <DateTimePickerField
                    field={field}
                    fieldState={fieldState}
                    placeholder={t("startTimePlaceholder")}
                    timeFormat="24"
                    minDate={new Date()}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="registrationDeadline"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t("registrationDeadline")}</FormLabel>
                  <DateTimePickerField
                    field={field}
                    fieldState={fieldState}
                    placeholder={t("registrationDeadlinePlaceholder")}
                    timeFormat="24"
                    minDate={new Date()}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="endTime"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t("endTime")}</FormLabel>
                  <DateTimePickerField
                    field={field}
                    fieldState={fieldState}
                    timeFormat="24"
                    placeholder={t("endTimePlaceholder")}
                    minDate={new Date()}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-3 pb-3">
            <FormField
              name="isFree"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/30 border">
                    <Switch
                      id="free-event"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label
                      htmlFor="free-event"
                      className="text-sm font-medium cursor-pointer"
                    >
                      {t("freeEvent")} {/* "This is a free event" */}
                    </Label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isFree && (
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 animate-in slide-in-from-top-2 duration-300">
                <div>
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("ticketPrice")}</FormLabel>
                        <FormControl>
                          <div className="mt-2 relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              placeholder={t("pricePlaceholder")} // "0.00"
                              className={cn(
                                "pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                              )}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 items-start gap-y-4 md:grid-cols-3 md:gap-x-4 border-t border-dashed pt-8">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("locationLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      className="h-11"
                      placeholder={t("locationPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("contactPhoneLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder="+222 27298087" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("phoneHint")}
                    {/* "Include country code (e.g., +222, +212, +1)" */}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("capacityLabel")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        className="pl-10"
                        placeholder={t("capacityPlaceholder")}
                        type="number"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button
              className="xl:rounded-lg"
              type="submit"
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? t("creating") : t("createEvent")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default CreateEventForm;
