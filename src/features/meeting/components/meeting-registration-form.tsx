"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  childFirstName: z
    .string()
    .min(2, { message: "Vorname muss mindestens 2 Zeichen lang sein." }),
  childLastName: z
    .string()
    .min(2, { message: "Nachname muss mindestens 2 Zeichen lang sein." }),
  childBirthDate: z.string().regex(/^\d{2}\.\d{2}\.\d{4}$/, {
    message: "Datum muss im Format TT.MM.JJJJ sein.",
  }),
  interestIn: z.enum(["kindergarten", "primarySchool"], {
    required_error: "Bitte wählen Sie eine Option.",
  }),
  motherFirstName: z
    .string()
    .min(2, { message: "Vorname muss mindestens 2 Zeichen lang sein." }),
  motherLastName: z
    .string()
    .min(2, { message: "Nachname muss mindestens 2 Zeichen lang sein." }),
  motherPhone: z
    .string()
    .min(5, { message: "Telefonnummer muss mindestens 5 Zeichen lang sein." }),
  motherEmail: z
    .string()
    .email({ message: "Bitte geben Sie eine gültige E-Mail-Adresse ein." }),
  fatherFirstName: z
    .string()
    .min(2, { message: "Vorname muss mindestens 2 Zeichen lang sein." }),
  fatherLastName: z
    .string()
    .min(2, { message: "Nachname muss mindestens 2 Zeichen lang sein." }),
  fatherPhone: z
    .string()
    .min(5, { message: "Telefonnummer muss mindestens 5 Zeichen lang sein." }),
  fatherEmail: z
    .string()
    .email({ message: "Bitte geben Sie eine gültige E-Mail-Adresse ein." }),
  reasonForInterest: z.object({
    montessoriPedagogy: z.boolean(),
    schoolLocation: z.boolean(),
    allDaySchool: z.boolean(),
    goodReputation: z.boolean(),
    bilingualism: z.boolean(),
    otherReason: z.string(),
  }),
  desiredEntryDate: z.date({
    required_error: "Bitte wählen Sie ein Datum aus.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function MeetingRegistrationForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      childFirstName: "",
      childLastName: "",
      childBirthDate: "",
      interestIn: undefined,
      motherFirstName: "",
      motherLastName: "",
      motherPhone: "",
      motherEmail: "",
      fatherFirstName: "",
      fatherLastName: "",
      fatherPhone: "",
      fatherEmail: "",
      reasonForInterest: {
        montessoriPedagogy: false,
        schoolLocation: false,
        allDaySchool: false,
        goodReputation: false,
        bilingualism: false,
        otherReason: "",
      },
      desiredEntryDate: undefined,
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
  }

  const formatDate = (input: string) => {
    const cleaned = input.replace(/\D/g, "");
    let formatted = "";

    if (cleaned.length > 0) {
      formatted += cleaned.substr(0, 2);
      if (cleaned.length > 2) {
        formatted += "." + cleaned.substr(2, 2);
        if (cleaned.length > 4) {
          formatted += "." + cleaned.substr(4, 4);
        }
      }
    }

    return formatted;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="childFirstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vorname des Kindes</FormLabel>
              <FormControl>
                <Input placeholder="Vorname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="childLastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nachname des Kindes</FormLabel>
              <FormControl>
                <Input placeholder="Nachname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="childBirthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Geburtsdatum des Kindes</FormLabel>
              <FormControl>
                <Input
                  placeholder="TT.MM.JJJJ"
                  {...field}
                  onChange={(e) => {
                    const formatted = formatDate(e.target.value);
                    field.onChange(formatted);
                  }}
                  maxLength={10}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interestIn"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Interesse für einen Platz</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="kindergarten" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      im Kindergarten
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="primarySchool" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      in der Primarschule
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="motherFirstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vorname der Mutter</FormLabel>
              <FormControl>
                <Input placeholder="Vorname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="motherLastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nachname der Mutter</FormLabel>
              <FormControl>
                <Input placeholder="Nachname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="motherPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon der Mutter</FormLabel>
              <FormControl>
                <Input placeholder="Telefonnummer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="motherEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-Mail der Mutter</FormLabel>
              <FormControl>
                <Input placeholder="E-Mail" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fatherFirstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vorname des Vaters</FormLabel>
              <FormControl>
                <Input placeholder="Vorname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fatherLastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nachname des Vaters</FormLabel>
              <FormControl>
                <Input placeholder="Nachname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fatherPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon des Vaters</FormLabel>
              <FormControl>
                <Input placeholder="Telefonnummer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fatherEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-Mail des Vaters</FormLabel>
              <FormControl>
                <Input placeholder="E-Mail" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reasonForInterest.montessoriPedagogy"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Montessori Pädagogik</FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reasonForInterest.schoolLocation"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Lage der Schule</FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reasonForInterest.allDaySchool"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Ganztagesschule</FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reasonForInterest.goodReputation"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Guter Ruf</FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reasonForInterest.bilingualism"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Zweisprachigkeit</FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reasonForInterest.otherReason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anderer Grund</FormLabel>
              <FormControl>
                <Input placeholder="Bitte spezifizieren" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="desiredEntryDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Gewünschtes Eintrittsdatum</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "P", { locale: de })
                      ) : (
                        <span>Datum auswählen</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date > new Date("2100-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Registrieren</Button>
      </form>
    </Form>
  );
}
