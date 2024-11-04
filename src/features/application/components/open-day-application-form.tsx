// src/app/application-form/page.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Schema für das Formular mit zod
const applicationSchema = z.object({
  applicationsType: z.enum(["OPEN_DAY", "ENROLLMENT", "OTHER"], {
    required_error: "Application Type is required",
  }),
  presenceCount: z.string().optional(),
  parents: z.array(
    z.object({
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
      zip: z.string().min(4),
      city: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
    })
  ),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export default function ApplicationForm() {
  // Verwende das Schema für die Validierung und Initialisierung des Formulars
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      applicationsType: "OPEN_DAY",
      presenceCount: "1",
      parents: [
        {
          firstName: "",
          lastName: "",
          zip: "",
          city: "",
          email: "",
          phone: "",
        },
      ],
    },
  });

  const onSubmit = async (values: ApplicationFormValues) => {
    setTimeout(() => {
      console.log(values);
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center my-5">
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle>Anmeldung Open Day Rietberg Montessori Schule</CardTitle>
          {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Presence Count */}
              <FormField
                control={form.control}
                name="presenceCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anzahl Personen</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wählen Sie die Anzahl der Personen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((anzahl) => (
                          <SelectItem key={anzahl} value={anzahl.toString()}>
                            {anzahl} {anzahl === 1 ? "Person" : "Personen"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Parents First Name */}
              <FormField
                name="parents.0.firstName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vorname</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.parents?.[0]?.firstName?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                name="parents.0.lastName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nachname</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.parents?.[0]?.lastName?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {/* zip */}
              <FormField
                name="parents.0.zip"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postleitzahl</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.parents?.[0]?.zip?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {/* city */}
              <FormField
                name="parents.0.city"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ort</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.parents?.[0]?.city?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {/* email */}
              <FormField
                name="parents.0.email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-Mail</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.parents?.[0]?.email?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {/* phone */}
              <FormField
                name="parents.0.phone"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.parents?.[0]?.firstName?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {/* Submit Button */}
              <Button
                className="w-full"
                disabled={!form.formState.isValid}
                type="submit"
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Anmelden
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
