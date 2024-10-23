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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { useCallback } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

const childSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Vorname muss mindestens 2 Zeichen lang sein." }),
  lastName: z
    .string()
    .min(2, { message: "Nachname muss mindestens 2 Zeichen lang sein." }),
  birthDate: z.string().regex(/^\d{2}\.\d{2}\.\d{4}$/, {
    message: "Datum muss im Format TT.MM.JJJJ sein.",
  }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Bitte wählen Sie eine Option.",
  }),
  interestIn: z.enum(["kindergarten", "primarySchool"], {
    required_error: "Bitte wählen Sie eine Option.",
  }),
});

const parentSchema = z.object({
  salutation: z.enum(["herr", "frau", "andere", "keine"], {
    required_error: "Bitte wählen Sie eine Anrede aus.",
  }),
  firstName: z
    .string()
    .min(2, { message: "Vorname muss mindestens 2 Zeichen lang sein." }),
  lastName: z
    .string()
    .min(2, { message: "Nachname muss mindestens 2 Zeichen lang sein." }),
  phone: z
    .string()
    .min(5, { message: "Telefonnummer muss mindestens 5 Zeichen lang sein." }),
  email: z
    .string()
    .email({ message: "Bitte geben Sie eine gültige E-Mail-Adresse ein." }),
});

const formSchema = z.object({
  children: z.array(childSchema).min(1, "Mindestens ein Kind ist erforderlich"),
  parents: z
    .array(parentSchema)
    .min(1, "Mindestens ein Elternteil ist erforderlich"),
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
  const formatDate = useCallback((input: string) => {
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
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      children: [
        {
          firstName: "",
          lastName: "",
          birthDate: "",
          gender: "male",
          interestIn: "kindergarten",
        },
      ],
      parents: [
        {
          salutation: "herr",
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
        },
      ],
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

  const {
    fields: parentFields,
    append: appendParent,
    remove: removeParent,
  } = useFieldArray({
    control: form.control,
    name: "parents",
  });

  const {
    fields: childFields,
    append: appendChild,
    remove: removeChild,
  } = useFieldArray({
    control: form.control,
    name: "children",
  });

  const ChildFields = useCallback(
    () => (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Kinder</h3>
        {childFields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-4 p-4 border border-gray-200 rounded-md"
          >
            <h4 className="text-lg font-semibold">Kind {index + 1}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name={`children.${index}.firstName`}
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
                name={`children.${index}.lastName`}
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
                name={`children.${index}.birthDate`}
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
                name={`children.${index}.gender`}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Geschlecht</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            männlich
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            weiblich
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="other" />
                          </FormControl>
                          <FormLabel className="font-normal">divers</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`children.${index}.interestIn`}
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
            </div>
            {childFields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => removeChild(index)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Kind entfernen
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          onClick={() =>
            appendChild({
              firstName: "",
              lastName: "",
              birthDate: "",
              gender: "male",
              interestIn: "kindergarten",
            })
          }
          variant="outline"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Kind hinzufügen
        </Button>
      </div>
    ),
    [childFields, form.control, appendChild, removeChild, formatDate]
  );

  const ParentFields = useCallback(
    () => (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Eltern</h3>
        {parentFields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-4 p-4 border border-gray-200 rounded-md"
          >
            <h4 className="text-lg font-semibold">Elternteil {index + 1}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name={`parents.${index}.salutation`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anrede</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Bitte wählen Sie eine Anrede" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="herr">Herr</SelectItem>
                        <SelectItem value="frau">Frau</SelectItem>
                        <SelectItem value="andere">Andere</SelectItem>
                        <SelectItem value="keine">Keine Anrede</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`parents.${index}.firstName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vorname des Elternteils {index + 1}</FormLabel>
                    <FormControl>
                      <Input placeholder="Vorname" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`parents.${index}.lastName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nachname des Elternteils {index + 1}</FormLabel>
                    <FormControl>
                      <Input placeholder="Nachname" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`parents.${index}.phone`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon des Elternteils {index + 1}</FormLabel>
                    <FormControl>
                      <Input placeholder="Telefonnummer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`parents.${index}.email`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-Mail des Elternteils {index + 1}</FormLabel>
                    <FormControl>
                      <Input placeholder="E-Mail" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {parentFields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => removeParent(index)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Elternteil entfernen
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          onClick={() =>
            appendParent({
              salutation: "herr",
              firstName: "",
              lastName: "",
              phone: "",
              email: "",
            })
          }
          variant="outline"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Elternteil hinzufügen
        </Button>
      </div>
    ),
    [parentFields, form.control, appendParent, removeParent]
  );

  const onSubmit = useCallback((values: FormValues) => {
    console.log(values);
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h2 className="text-2xl font-semibold">Informationen zu Ihrem Kind</h2>
        <ChildFields />
        <ParentFields />

        <Separator />

        <h2 className="text-2xl font-semibold">Grund für Ihr Interesse?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
        </div>
        <Separator />
        <h2 className="text-2xl font-semibold">Gewünschtes Eintrittsdatum</h2>

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
