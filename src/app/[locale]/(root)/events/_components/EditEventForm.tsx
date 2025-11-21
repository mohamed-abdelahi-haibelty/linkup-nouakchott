"use client";

import { updateEvent } from "@/app/[locale]/actions/events/organizer/updateEvent";
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
import { EventWithParticipants, SafeEvent } from "@/types";
import { ArrowLeft, DollarSign, Info, Loader2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function EditFormEvent({
  event,
  id,
}: {
  event: EventWithParticipants;
  id: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  const participants = event.participants.length;
  const now = new Date();
  const startTime = new Date(event.startTime);

  const isLocked = participants > 0 || startTime <= now;
  const isCancelled = event.status !== "approved";

  const form = useForm<EventFormInput>({
    defaultValues: {
      title: event.title,
      description: event.description,
      imageUrl: event.imageUrl,
      tag: event.tag ?? undefined,
      startTime: new Date(event.startTime),
      endTime: new Date(event.endTime),
      registrationDeadline: new Date(event.registrationDeadline),
      isFree: event.isFree,
      price: Number(event.price),
      location: event.location,
      contactPhone: event.contactPhone || "",
      capacity: event.capacity,
    },
  });

  const isFree = form.watch("isFree");

  const onSubmit = (values: EventFormInput) => {
    startTransition(async () => {
      const res = await updateEvent(id, values);

      if (res.success) {
        toast.success(res.message);
        if (res.data?.requiresReapproval) {
          const permission = Notification.permission;
          if (permission !== "granted") {
            setShowPermissionDialog(true);
            return;
          }
        }
        router.push("/events/");
      } else {
        // Handle validation errors
        if (res.error) {
          Object.entries(res.error).forEach(([key, value]) => {
            if (key in values) {
              form.setError(key as keyof EventFormInput, {
                type: "server",
                message: value?.[0],
              });
            }
          });
          toast.error("Please check the form for errors.");
        } else {
          toast.error(res?.message || "Failed to update event");
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
          <h1 className="font-bold text-xl">Edit event</h1>
          <p className="text-xs text-muted-foreground">
            Update your event details below
          </p>
        </div>
      </div>

      {isLocked && (
        <div className="p-3 rounded bg-yellow-100 text-yellow-800 text-sm mt-2">
          You can’t edit this event because it has already started or has
          participants.
        </div>
      )}

      {isCancelled && (
        <div className="p-3 rounded bg-red-100 text-red-800 text-sm mt-2">
          This event has been cancelled and cannot be edited.
        </div>
      )}

      {!isLocked && (
        <div className="mt-4">
          <Alert className="border-amber-200 bg-amber-50">
            <Info className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm text-amber-800">
              <strong>Changes require re-approval:</strong> Modifying the title,
              description, location, or image will reset this event to pending
              status and require moderator approval before it becomes visible
              again.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <FormField
            control={form.control}
            disabled={isLocked}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event title *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your event title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            disabled={isLocked}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your event in detail..."
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
                disabled={isLocked}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Category</FormLabel>

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
                disabled={isLocked}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Image</FormLabel>
                    <FileUploadComponent
                      value={field.value}
                      endpoint="eventImage"
                      disabled={isLocked || isCancelled}
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
              disabled={isLocked}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <DateTimePickerField
                    field={field}
                    fieldState={fieldState}
                    placeholder="Select start date and time"
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
              disabled={isLocked}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Registration Deadline</FormLabel>
                  <DateTimePickerField
                    field={field}
                    fieldState={fieldState}
                    placeholder="Select registration deadline"
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
              disabled={isLocked}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <DateTimePickerField
                    field={field}
                    fieldState={fieldState}
                    timeFormat="24"
                    placeholder="Select end date and time"
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
              disabled={isLocked}
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
                      This is a free event
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
                    disabled={isLocked}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ticket Price *</FormLabel>
                        <FormControl>
                          <div className="mt-2 relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
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
              disabled={isLocked}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location *</FormLabel>
                  <FormControl>
                    <Input
                      className="h-11"
                      placeholder="Enter address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              disabled={isLocked}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact phone *</FormLabel>
                  <FormControl>
                    <Input placeholder="+222 26735397" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              disabled={isLocked}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Capacity *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        className="pl-10"
                        placeholder="Enter address"
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
              disabled={isPending || isLocked || isCancelled}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Updating..." : "Update Event"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default EditFormEvent;
