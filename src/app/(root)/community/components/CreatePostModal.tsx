"use client";
import React, { useTransition } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  CommunityPostFormInput,
  communityPostSchema,
} from "@/lib/validation/communityPost";
import { createCommunityPost } from "@/app/actions/community/createCommunityPost";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DateTimePickerField } from "@/components/shared/dateTimePicker";
import FileUploadComponent from "@/components/shared/FileUploadComponent";
import { zodResolver } from "@hookform/resolvers/zod";
import { tagList } from "@/lib/constant";
import EventTags from "@/components/shared/EventTags";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreatePostModal({
  isOpen,
  onClose,
  onSuccess,
}: CreatePostModalProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CommunityPostFormInput>({
    resolver: zodResolver(communityPostSchema),
    defaultValues: {
      title: "",
      description: "",
      posterUrl: undefined,
      location: undefined,
      startTime: undefined,
      endTime: undefined,
      tag: undefined,
    },
  });

  const onSubmit = (values: CommunityPostFormInput) => {
    startTransition(async () => {
      const res = await createCommunityPost(values);

      if (!res) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      if (res.success) {
        toast.success(res.message || "Post created successfully!");
        form.reset();
        onClose();
        if (onSuccess) onSuccess();
      } else {
        if (res.message) {
          toast.error(res.message);
        }

        if (res.error) {
          Object.entries(res.error).forEach(([key, value]) => {
            if (key in values) {
              form.setError(key as keyof CommunityPostFormInput, {
                type: "server",
                message: value?.[0],
              });
            }
          });
          toast.error("Please check the form for errors.");
        }
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-lg border max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow-lg)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between p-6 border-b sticky top-0 z-10"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <div>
            <h2 className="text-lg font-semibold">Post Community Event</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Share events with the community
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:opacity-80 transition-opacity"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 space-y-4"
          >
            {/* Event Poster */}
            <FormField
              name="posterUrl"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Poster</FormLabel>
                  <FileUploadComponent
                    value={field.value ?? null}
                    endpoint="eventImage"
                    onImageChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
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

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your event in detail..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      placeholder="Select end date and time"
                      timeFormat="24"
                      minDate={new Date()}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Info Note */}
            <div
              className="rounded-md p-3 text-sm"
              style={{
                backgroundColor: "var(--muted)",
                color: "var(--muted-foreground)",
              }}
            >
              <p className="font-medium text-orange-600 dark:text-orange-400 mb-1">
                Note:
              </p>
              <p>
                Community posts are marked as "Pending" and need verification by
                our team before they become visible to other users.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? "Posting..." : "Post Event"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
