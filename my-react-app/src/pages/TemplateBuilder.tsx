// c:\code\referencearch\my-react-app\src\pages\TemplateBuilder.tsx
import { useState, useRef } from "react"; // Added useRef
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  ScenarioTypes,
  KeyTopics,
  CompetenciesAndGoals,
  CoachingFrameworks,
  Personas,
  scenarioSchema
} from "@/lib/schema";
import MultiSelectInput from "@/components/MultiSelectInput";
import FileUpload from "@/components/FileUpload";
import JsonDisplay from "@/components/JsonDisplay";
import { useFileParser } from "@/hooks/useFileParser";
import { createScenario } from '@/api';

export default function TemplateBuilder() {
  const { toast } = useToast();
  const { parseFile } = useFileParser();
  const [showJsonOutput, setShowJsonOutput] = useState(false);
  const [generatedJson, setGeneratedJson] = useState<string>("");
  const [activeStep, setActiveStep] = useState(0);
  const totalSteps = 7; // Total number of steps in the form
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null); // State for avatar preview URL
  const avatarInputRef = useRef<HTMLInputElement>(null); // Ref for file input

  // Form definition with default values
  const form = useForm<any>({ 
    resolver: zodResolver(scenarioSchema),
    defaultValues: {
      scenarioType: "",
      keyTopics: [],
      competenciesAndGoals: [],
      guidelines: "",
      coachingFramework: {
        name: "",
        description: "",
      },
      supportingMaterials: [],
      persona: {
        name: "",
        role: "",
        disposition: "",
        background: "",
        communicationStyle: "",
        emotionalState: "",
        avatar: "", // Default value for avatar
        avatarUrl: "", // Default value for avatarUrl
      },
    },
    mode: "onChange",
  });

  // Handle form submission and generate JSON
  const onSubmit = async (data: any) => {
    // Format guidelines from textarea into array
    const guidelinesArray = data.guidelines
      .split("\n")
      .filter((line: string) => line.trim() !== "");

    // TODO: Align supportingMaterials format with API expectation
    // The form has [{ title: string, parsedContent: string }],
    // but the API interface CoachonCueScenarioAttributes expects string[].
    // You'll need to decide how to map this, e.g., just send titles or parsedContent.
    // Example: Map to just parsed content strings
    const apiSupportingMaterials = data.supportingMaterials?.map(m => m.parsedContent);

    const formattedData = {
      ...data,
      guidelines: guidelinesArray,
      supportingMaterials: apiSupportingMaterials || [], // Use the mapped array
      // Avatar data should already be set in the form state by handleAvatarChange
    };

    const token = localStorage.getItem('jwtToken') as string;

    try {
      // Assuming createScenario expects data matching CoachonCueScenarioAttributes
      // You might need type assertion or ensure createScenario handles ScenarioFormValues
      await createScenario(formattedData as any, token); // Use 'as any' for now, refine API call signature if needed

      const jsonOutput = JSON.stringify(formattedData, null, 2);
      setGeneratedJson(jsonOutput);
      setShowJsonOutput(true);

      toast({
        title: "Success!",
        description: "Your scenario template has been generated",
        variant: "default",
      });

      // Scroll to JSON output
      setTimeout(() => {
        const jsonSection = document.getElementById("json-output-section");
        if (jsonSection) {
          jsonSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);

    } catch (error) {
       console.error("Error creating scenario:", error);
       toast({
         title: "Error",
         description: "Failed to create scenario template.",
         variant: "destructive",
       });
    }
  };

  // Handle coaching framework selection
  const handleFrameworkChange = (value: string) => {
    const selectedFramework = CoachingFrameworks.find(
      (framework) => framework.value === value
    );
    if (selectedFramework) {
      form.setValue("coachingFramework.name", selectedFramework.name);
      form.setValue("coachingFramework.description", selectedFramework.description);
    }
  };

  // Handle persona selection
  const handlePersonaChange = (value: string) => {
    const selectedPersona = Personas.find(
      (persona) => persona.value === value
    );

    // Clear existing avatar preview and form values when changing persona
    setAvatarPreview(null);
    form.setValue("persona.avatar", "");
    form.setValue("persona.avatarUrl", "");
    if (avatarInputRef.current) {
        avatarInputRef.current.value = ""; // Clear file input
    }


    if (selectedPersona) {
      form.setValue("persona.name", selectedPersona.name);
      form.setValue("persona.role", selectedPersona.role);
      form.setValue("persona.disposition", selectedPersona.disposition);
      form.setValue("persona.background", selectedPersona.background);
      form.setValue("persona.communicationStyle", selectedPersona.communicationStyle);
      form.setValue("persona.emotionalState", selectedPersona.emotionalState);
      // --- Set default avatar if available in Personas data ---
      // Example: Assuming Personas have avatarUrl property
      // if (selectedPersona.avatarUrl) {
      //   form.setValue("persona.avatarUrl", selectedPersona.avatarUrl);
      //   setAvatarPreview(selectedPersona.avatarUrl);
      // }
      // if (selectedPersona.avatar) { // If storing an identifier
      //    form.setValue("persona.avatar", selectedPersona.avatar);
      // }
      // --- End default avatar handling ---
    } else if (value === "custom") {
      // Clear all fields for custom persona entry
      form.resetField("persona"); // Resets the entire persona object to defaults
      // Ensure defaults are set correctly after reset if needed
       form.setValue("persona", {
            name: "", role: "", disposition: "", background: "",
            communicationStyle: "", emotionalState: "", avatar: "", avatarUrl: ""
       });
    }
  };

  // Handle file upload for supporting materials
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const materials = form.getValues("supportingMaterials") || [];

    if (materials.length + files.length > 2) {
      toast({
        title: "File limit reached",
        description: "You can only upload a maximum of 2 supporting files",
        variant: "destructive",
      });
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
        toast({
          title: "Unsupported file format",
          description: "Only .txt and .md files are accepted for supporting materials",
          variant: "destructive",
        });
        continue;
      }
      try {
        const parsedContent = await parseFile(file);
        const fileObject = {
          title: file.name.replace(/\.[^/.]+$/, ""),
          parsedContent
        };
        form.setValue("supportingMaterials", [...materials, fileObject]);
        toast({
          title: "File uploaded",
          description: `${file.name} has been successfully added`,
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Could not process the supporting file",
          variant: "destructive",
        });
      }
    }
  };

  // Remove supporting material
  const removeSupportingMaterial = (index: number) => {
    const materials = form.getValues("supportingMaterials") || [];
    const removedFile = materials[index];
    materials.splice(index, 1);
    form.setValue("supportingMaterials", [...materials]);
    toast({
      title: "File removed",
      description: `${removedFile.title} has been removed`,
      variant: "default",
    });
  };

  // --- Handle Avatar Image Selection ---
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      // Clear if no file selected or selection cancelled
      setAvatarPreview(null);
      form.setValue("persona.avatar", "");
      form.setValue("persona.avatarUrl", "");
      return;
    }

    // Basic validation (type and size)
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPG, PNG, GIF, or WEBP image.",
        variant: "destructive",
      });
      event.target.value = ""; // Clear the input
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2MB limit
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Avatar image must be smaller than 2MB.",
        variant: "destructive",
      });
      event.target.value = ""; // Clear the input
      return;
    }

    // Read file for preview and set form values
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setAvatarPreview(dataUrl);
      form.setValue("persona.avatar", file.name); // Store filename
      // Store data URL for preview/potential direct use.
      // In a real app, you might upload here and set a server URL.
      form.setValue("persona.avatarUrl", dataUrl, { shouldValidate: true });
    };
    reader.onerror = () => {
       toast({ title: "Error reading file", variant: "destructive" });
       setAvatarPreview(null);
       form.setValue("persona.avatar", "");
       form.setValue("persona.avatarUrl", "");
    };
    reader.readAsDataURL(file);
  };

  // --- Clear Avatar Selection ---
  const clearAvatar = () => {
    setAvatarPreview(null);
    form.setValue("persona.avatar", "");
    form.setValue("persona.avatarUrl", "");
    if (avatarInputRef.current) {
      avatarInputRef.current.value = ""; // Clear the file input visually
    }
    toast({ title: "Avatar cleared" });
  };
  // --- End Avatar Handlers ---


  // Navigation for steps
  const goToNextStep = () => {
    if (activeStep < totalSteps - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  // Calculate progress percentage
  const progressPercentage = ((activeStep + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-white to-blue-50">
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
            </div>
            <h1 className="text-xl font-semibold">CoachOnCue</h1>
          </div>
          <div className="hidden md:flex space-x-4">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>
              Templates
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-help-circle"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" x2="12.01" y1="17" y2="17"></line></svg>
              Help
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Form Title and Progress */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Create Coaching Scenario</h2>
              <p className="text-slate-600">Build structured templates for AI-driven coaching roleplays</p>
            </div>
            <div className="flex items-center mt-4 md:mt-0 text-sm">
              <span className="text-blue-600 font-medium">Step {activeStep + 1} of {totalSteps}</span>
              <div className="w-32 h-2 bg-slate-200 rounded-full mx-2 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Scenario Builder Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-8">

              {/* Step 1: Scenario Type */}
              {activeStep === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open-text text-blue-600"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path><path d="M6 8h2"></path><path d="M6 12h2"></path><path d="M16 8h2"></path><path d="M16 12h2"></path></svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">Scenario Type</h3>
                        <p className="text-slate-600 text-sm">Choose the type of training scenario</p>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="scenarioType"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-slate-600">Select a scenario type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select a scenario type..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ScenarioTypes.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end">
                    <Button
                      type="button"
                      onClick={goToNextStep}
                      disabled={!form.getValues("scenarioType")}
                      className="flex items-center gap-2"
                    >
                      Continue
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"></path></svg>
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Key Topics */}
              {activeStep === 1 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-checks text-blue-600"><path d="m3 17 2 2 4-4"></path><path d="m3 7 2 2 4-4"></path><path d="M13 6h8"></path><path d="M13 12h8"></path><path d="M13 18h8"></path></svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">Key Topics</h3>
                        <p className="text-slate-600 text-sm">Select or add topics covered in this scenario</p>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="keyTopics"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-slate-600">Select key topics</FormLabel>
                          <FormControl>
                            <MultiSelectInput
                              options={KeyTopics.map(topic => ({ label: topic, value: topic }))}
                              value={field.value.map((item: string) => ({ label: item, value: item }))}
                              onChange={(selected) => field.onChange(selected.map(item => item.value))}
                              placeholder="Select or type to add key topics..."
                            />
                          </FormControl>
                          <p className="text-xs text-slate-500 mt-2">Choose from the list or type to add custom topics</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between">
                    <Button
                      type="button"
                      onClick={goToPrevStep}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"></path></svg>
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={goToNextStep}
                      disabled={form.getValues("keyTopics").length === 0}
                      className="flex items-center gap-2"
                    >
                      Continue
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"></path></svg>
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Competencies and Goals */}
              {activeStep === 2 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target text-blue-600"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">Competencies and Goals</h3>
                        <p className="text-slate-600 text-sm">Define what participants should learn or demonstrate</p>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="competenciesAndGoals"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-slate-600">Select competencies and goals</FormLabel>
                          <FormControl>
                            <MultiSelectInput
                              options={CompetenciesAndGoals.map(item => ({ label: item, value: item }))}
                              value={field.value.map((item: string) => ({ label: item, value: item }))}
                              onChange={(selected) => field.onChange(selected.map(item => item.value))}
                              placeholder="Select or type to add competencies and goals..."
                            />
                          </FormControl>
                          <p className="text-xs text-slate-500 mt-2">Choose from the list or type to add custom competencies</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between">
                    <Button
                      type="button"
                      onClick={goToPrevStep}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"></path></svg>
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={goToNextStep}
                      disabled={form.getValues("competenciesAndGoals").length === 0}
                      className="flex items-center gap-2"
                    >
                      Continue
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"></path></svg>
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Guidelines */}
              {activeStep === 3 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-square text-blue-600"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">Guidelines</h3>
                        <p className="text-slate-600 text-sm">Add 3-5 specific guidelines for this scenario</p>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="guidelines"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-slate-600">Enter guidelines (one per line)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="E.g.,&#10;Do not raise your voice or use aggressive language.&#10;Acknowledge the teammate's feelings before offering solutions.&#10;Keep the conversation focused on team goals, not personal attacks."
                              className="min-h-[160px] font-medium"
                              {...field}
                            />
                          </FormControl>
                          <p className="text-xs text-slate-500 mt-2">These guidelines will direct AI behavior during the roleplay</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between">
                    <Button
                      type="button"
                      onClick={goToPrevStep}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"></path></svg>
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={goToNextStep}
                      disabled={!form.getValues("guidelines") || form.getValues("guidelines").length < 10}
                      className="flex items-center gap-2"
                    >
                      Continue
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"></path></svg>
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 5: Coaching Framework */}
              {activeStep === 4 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map text-blue-600"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" x2="9" y1="3" y2="18"></line><line x1="15" x2="15" y1="6" y2="21"></line></svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">Coaching Framework</h3>
                        <p className="text-slate-600 text-sm">Select a framework to guide the coaching approach</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <Controller
                        name="coachingFramework.name"
                        control={form.control}
                        render={({ field: { value } }) => (
                          <FormField
                            control={form.control}
                            name="coachingFramework.name"
                            render={() => (
                              <FormItem className="space-y-1">
                                <FormLabel className="text-slate-600">Select a coaching framework</FormLabel>
                                <Select
                                  onValueChange={(val) => handleFrameworkChange(val)}
                                  value={CoachingFrameworks.find(f => f.name === value)?.value || ""}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-12">
                                      <SelectValue placeholder="Select a framework..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {CoachingFrameworks.map((framework) => (
                                      <SelectItem key={framework.value} value={framework.value}>
                                        {framework.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="coachingFramework.description"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-slate-600">Framework description</FormLabel>
                            <FormControl>
                              <Textarea
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <p className="text-xs text-slate-500 mt-2">Edit the description to match your specific implementation</p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between">
                    <Button
                      type="button"
                      onClick={goToPrevStep}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"></path></svg>
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={goToNextStep}
                      disabled={!form.getValues("coachingFramework.name") || !form.getValues("coachingFramework.description")}
                      className="flex items-center gap-2"
                    >
                      Continue
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"></path></svg>
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 6: Supporting Materials */}
              {activeStep === 5 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text text-blue-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">Supporting Materials</h3>
                        <p className="text-slate-600 text-sm">Upload documents that provide additional context</p>
                      </div>
                    </div>

                    <Controller
                      name="supportingMaterials"
                      control={form.control}
                      render={({ field }) => (
                        <>
                          <FileUpload onFilesSelected={handleFileUpload} />

                          {/* Uploaded files preview */}
                          {field.value.length > 0 && (
                            <div className="space-y-3 mt-6">
                              <p className="text-sm text-slate-600 font-medium mb-2">Uploaded files ({field.value.length}/2)</p>
                              {field.value.map((material: any, index: number) => (
                                <div key={index} className="flex items-start bg-slate-50 rounded-lg p-4 border border-slate-200">
                                  <div className="text-slate-400 mr-3 mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>
                                  </div>
                                  <div className="flex-1 overflow-hidden">
                                    <div className="text-sm font-medium">{material.title}</div>
                                    <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                                      {material.parsedContent.substring(0, 100)}
                                      {material.parsedContent.length > 100 ? "..." : ""}
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSupportingMaterial(index)}
                                    className="text-slate-400 hover:text-red-500 ml-2"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                                    <span className="sr-only">Remove</span>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between">
                    <Button
                      type="button"
                      onClick={goToPrevStep}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"></path></svg>
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={goToNextStep}
                      className="flex items-center gap-2"
                    >
                      Continue
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"></path></svg>
                    </Button>
                  </div>
                </div>
              )}


              {/* Step 7: Persona */}
              {activeStep === 6 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center mb-6">
                      {/* ... Icon and Title ... */}
                       <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user text-blue-600"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                       </div>
                       <div>
                         <h3 className="text-xl font-semibold">Persona</h3>
                         <p className="text-slate-600 text-sm">Define the character for this scenario</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                      {/* Persona Selection Dropdown */}
                      <div className="space-y-1">
                        <label className="text-slate-600 text-sm font-medium">Choose a persona</label>
                        <Select onValueChange={handlePersonaChange}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Choose a persona..." />
                          </SelectTrigger>
                          <SelectContent>
                            {Personas.map((persona) => (
                              <SelectItem key={persona.value} value={persona.value}>
                                {persona.label}
                              </SelectItem>
                            ))}
                            <SelectItem value="custom">Custom Persona</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* --- Avatar Upload Section --- */}
                      <div className="space-y-2">
                         <FormLabel className="text-slate-600">Avatar Image (Optional)</FormLabel>
                         <div className="flex items-center gap-4">
                           <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                             {avatarPreview ? (
                               <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                             ) : (
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image text-slate-400"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
                             )}
                           </div>
                           <div className="flex flex-col gap-2">
                             <Button type="button" variant="outline" size="sm" onClick={() => avatarInputRef.current?.click()}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>
                                Upload Image
                             </Button>
                             {avatarPreview && (
                                <Button type="button" variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={clearAvatar}>
                                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x mr-1"><path d="M18 6 6 18"></path><path d="M6 6l12 12"></path></svg>
                                   Clear
                                </Button>
                             )}
                             <Input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/png, image/jpeg, image/gif, image/webp"
                                onChange={handleAvatarChange}
                                className="hidden" // Hide the default input, trigger via button
                                // We don't use FormField here as direct file input handling is often simpler
                             />
                             <p className="text-xs text-slate-500">Max 2MB (JPG, PNG, GIF, WEBP)</p>
                           </div>
                         </div>
                         {/* Display validation error for avatarUrl if needed */}
                         <FormMessage>{form.formState.errors.persona?.avatarUrl?.message}</FormMessage>
                      </div>
                      {/* --- End Avatar Upload Section --- */}


                      {/* Persona Detail Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormField control={form.control} name="persona.name" render={({ field }) => ( <FormItem> <FormLabel className="text-slate-600">Name</FormLabel> <FormControl><Input {...field} className="h-12" /></FormControl> <FormMessage /> </FormItem> )} />
                        <FormField control={form.control} name="persona.role" render={({ field }) => ( <FormItem> <FormLabel className="text-slate-600">Role</FormLabel> <FormControl><Input {...field} className="h-12" /></FormControl> <FormMessage /> </FormItem> )} />
                        <FormField control={form.control} name="persona.disposition" render={({ field }) => ( <FormItem> <FormLabel className="text-slate-600">Disposition</FormLabel> <FormControl><Input {...field} className="h-12" /></FormControl> <FormMessage /> </FormItem> )} />
                        <FormField control={form.control} name="persona.emotionalState" render={({ field }) => ( <FormItem> <FormLabel className="text-slate-600">Emotional State</FormLabel> <FormControl><Input {...field} className="h-12" /></FormControl> <FormMessage /> </FormItem> )} />
                      </div>
                      <FormField control={form.control} name="persona.background" render={({ field }) => ( <FormItem> <FormLabel className="text-slate-600">Background</FormLabel> <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                      <FormField control={form.control} name="persona.communicationStyle" render={({ field }) => ( <FormItem> <FormLabel className="text-slate-600">Communication Style</FormLabel> <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl> <FormMessage /> </FormItem> )} />

                    </div>
                  </div>

                  {/* Footer with Back and Submit Buttons */}
                  <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between">
                    <Button type="button" onClick={goToPrevStep} variant="outline" className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"></path></svg>
                      Back
                    </Button>
                    <Button
                      type="submit"
                      // Disable if the form is invalid OR if it's currently submitting
                      disabled={!form.formState.isValid || form.formState.isSubmitting}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2"
                    >
                      {form.formState.isSubmitting ? "Generating..." : "Generate Template"}
                      {!form.formState.isSubmitting && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>

          {/* JSON Output */}
          {showJsonOutput && (
             <div id="json-output-section" className="mt-12 flex flex-col gap-6">
                             <div className="text-center">
                <div className="inline-block p-3 rounded-full bg-blue-100 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle text-blue-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Template Generated!</h2>
                <p className="text-slate-600 max-w-md mx-auto">Your scenario has been successfully generated and is ready to use. Copy the JSON below to use in your training platform.</p>
              </div>

              <JsonDisplay jsonData={generatedJson} />

              <div className="flex justify-center mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setShowJsonOutput(false);
                    setActiveStep(0);
                  }}
                  className="flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                  Create Another Template
                </Button>
              </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}