"use client";

import { DateTimePickerField } from "@/components/shared/dateTimePicker";
import EventTags from "@/components/shared/EventTags";
import FileUploadComponent from "@/components/shared/FileUploadComponent";
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
import { createEventAction } from "@/lib/actions";
import { tagList } from "@/lib/constant";
import { cn } from "@/lib/utils";
import { CreateEventInput } from "@/lib/validation/event";
import { ArrowLeft, DollarSign, Loader2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function CreateEventForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateEventInput>({
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

  const onSubmit = (values: CreateEventInput) => {
    startTransition(async () => {
      const res = await createEventAction(values);

      if (!res) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      if (res.success) {
        // Success case
        toast.success(res.message || "Event created successfully!");
        form.reset();
        router.push("/events/");
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
              form.setError(key as keyof CreateEventInput, {
                type: "server",
                message: value?.[0],
              });
            }
          });

          // Show a toast for validation errors
          toast.error("Please check the form for errors.");
        }
      }
    });
  };

  return (
    <div className="">
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
          <h1 className="font-bold text-xl">Create new event</h1>
          <p className="text-xs text-muted-foreground">
            Set up your event details and schedule
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <FormField
            control={form.control}
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Image</FormLabel>
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
              name="endTime"
              control={form.control}
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
            <FormField
              name="registrationDeadline"
              control={form.control}
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
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default CreateEventForm;
