import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { Card, CardContent } from "@/components/ui/card";
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
import { useFileParser } from "@/hooks/useFileParser"; // Keep using this for txt/md
import { createScenario, addScenarioFile } from '@/api';

// Define a type for your supporting materials
interface SupportingMaterial {
  title: string;
  contentType: string; // e.g., 'text/plain', 'application/pdf'
  content: string; // Will store plain text for txt/md, Base64 Data URL for pdf
}

export default function TemplateBuilder() {
  const { toast } = useToast();
  const { parseFile, loading: parsingTextFile } = useFileParser();
  const [parsingPdf, setParsingPdf] = useState(false); // Separate loading state for PDFs
  const [showJsonOutput, setShowJsonOutput] = useState(false);
  const [generatedJson, setGeneratedJson] = useState<string>("");
  const [activeStep, setActiveStep] = useState(0);
  const totalSteps = 7; // Total number of steps in the form

  // Update the form type to use the SupportingMaterial interface
  const form = useForm<{
    scenarioType: string;
    keyTopics: string[];
    competenciesAndGoals: string[];
    guidelines: string;
    coachingFramework: { name: string; description: string; };
    supportingMaterials: SupportingMaterial[]; // Use the interface here
    persona: {
      name: string;
      role: string;
      disposition: string;
      background: string;
      communicationStyle: string;
      emotionalState: string;
    };
  }>({ // Add the explicit type here
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
      },
    },
    mode: "onChange",
  });

  // Handle form submission and generate JSON
  const onSubmit = async (data: any) => { // data will now have supportingMaterials with Base64 for PDFs
    // Format guidelines from textarea into array
    const guidelinesArray = data.guidelines
      .split("\n")
      .filter((line: string) => line.trim() !== "");

    const formattedData = {
      ...data,
      guidelines: guidelinesArray,
    };

    const pdfFiles = formattedData.supportingMaterials
      ? formattedData.supportingMaterials.filter(
        (material: SupportingMaterial) => material.contentType === 'application/pdf'
        )
      : [];

    const txtFiles = formattedData.supportingMaterials
      ? formattedData.supportingMaterials.filter(
          (material: SupportingMaterial) => material.contentType === 'text/plain'
        )
      : [];

    formattedData.supportingMaterials = [];
    txtFiles.forEach((file: SupportingMaterial) => {
      formattedData.supportingMaterials.push(file.content);
    });

    const token = localStorage.getItem('jwtToken') as string;

    try {
      const newScenario = await createScenario({
        ...formattedData,
      }, token);

      for (const pdfFile of pdfFiles) {
        try {
          console.log(`Uploading PDF: ${pdfFile.title}`);
          const newFileResponse = await addScenarioFile({
            scenarioId: newScenario.id, // Use the ID from the response
            base64: pdfFile.content,    // Send the Base64 data URL
          }, token);
          console.log(`PDF ${pdfFile.title} uploaded successfully:`, newFileResponse);
        } catch (fileUploadError) {
          // Handle individual file upload errors more gracefully if needed
          console.error(`Failed to upload file ${pdfFile.title}:`, fileUploadError);
          // Optionally: Collect errors and report them later, or stop the process
          // For now, we'll re-throw to be caught by the main catch block
          throw new Error(`Failed to upload supporting file ${pdfFile.title}. Scenario might be incomplete.`);
        }
      }

      const jsonOutput = JSON.stringify(formattedData, null, 2);
      setGeneratedJson(jsonOutput);
      setShowJsonOutput(true);

      toast({
        title: "Success!",
        description: "Your scenario template has been generated and saved.",
        variant: "default",
      });

      // Scroll to JSON output
      setTimeout(() => {
        const jsonSection = document.getElementById("json-output-section");
        if (jsonSection) {
          jsonSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);

    } catch (apiError) {
      console.error("API Error:", apiError);
      toast({
        title: "API Error",
        description: "Failed to save the scenario. Please try again.",
        variant: "destructive",
      });
      // Optionally display the formatted data even on API error for debugging
      const jsonOutput = JSON.stringify(formattedData, null, 2);
      setGeneratedJson(jsonOutput);
      setShowJsonOutput(true);
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

    if (selectedPersona) {
      form.setValue("persona.name", selectedPersona.name);
      form.setValue("persona.role", selectedPersona.role);
      form.setValue("persona.disposition", selectedPersona.disposition);
      form.setValue("persona.background", selectedPersona.background);
      form.setValue("persona.communicationStyle", selectedPersona.communicationStyle);
      form.setValue("persona.emotionalState", selectedPersona.emotionalState);
    } else if (value === "custom") {
      form.setValue("persona.name", "");
      form.setValue("persona.role", "");
      form.setValue("persona.disposition", "");
      form.setValue("persona.background", "");
      form.setValue("persona.communicationStyle", "");
      form.setValue("persona.emotionalState", "");
    }
  };

  // --- MODIFIED handleFileUpload ---
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const currentMaterials = form.getValues("supportingMaterials") || [];

    // Check maximum of 2 files
    if (currentMaterials.length + files.length > 2) {
      toast({
        title: "File limit reached",
        description: "You can only upload a maximum of 2 files",
        variant: "destructive",
      });
      return;
    }

    const newMaterials: SupportingMaterial[] = [];
    const filePromises: Promise<void>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileTitle = file.name.replace(/\.[^/.]+$/, ""); // Remove extension

      // Validate file type (keep this)
      if (!file.name.endsWith('.txt') && !file.name.endsWith('.md') && !file.name.endsWith('.pdf')) {
        toast({
          title: "Unsupported file format",
          description: `Skipping ${file.name}. Only .txt, .md, and .pdf files are accepted`,
          variant: "destructive",
        });
        continue; // Skip this file
      }

      // Create a promise for each file processing
      const filePromise = new Promise<void>((resolve, reject) => {
        if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
          // Use existing useFileParser for text files
          parseFile(file)
            .then(parsedContent => {
              newMaterials.push({
                title: fileTitle,
                contentType: file.type || 'text/plain', // Use actual file type
                content: parsedContent // Store plain text
              });
              resolve();
            })
            .catch(err => {
              console.error(`Error parsing text file ${file.name}:`, err);
              toast({
                title: "Parsing failed",
                description: `Could not process the text file ${file.name}`,
                variant: "destructive",
              });
              reject(err); // Reject the promise for this file
            });
        } else if (file.name.endsWith('.pdf')) {
          // Handle PDF files using readAsDataURL
          const reader = new FileReader();
          setParsingPdf(true); // Indicate PDF parsing started

          reader.onload = (e) => {
            const base64Content = e.target?.result as string;
            newMaterials.push({
              title: fileTitle,
              contentType: file.type || 'application/pdf', // Use actual file type
              content: base64Content // Store Base64 Data URL
            });
            setParsingPdf(false);
            resolve(); // Resolve the promise for this file
          };

          reader.onerror = (err) => {
            console.error(`Error reading PDF file ${file.name}:`, err);
            setParsingPdf(false);
            toast({
              title: "Upload failed",
              description: `Could not read the PDF file ${file.name}`,
              variant: "destructive",
            });
            reject(new Error(`Error reading PDF file ${file.name}`)); // Reject the promise
          };

          reader.readAsDataURL(file); // Read as Base64 Data URL
        } else {
          // Should not happen due to earlier check, but good practice
          reject(new Error(`Unsupported file type: ${file.name}`));
        }
      });
      filePromises.push(filePromise);
    }

    // Wait for all files to be processed
    try {
      await Promise.all(filePromises);
      // Only update form state if all files processed successfully (or were skipped)
      if (newMaterials.length > 0) {
        form.setValue("supportingMaterials", [...currentMaterials, ...newMaterials]);
        toast({
          title: "Files processed",
          description: `${newMaterials.length} file(s) added successfully.`,
          variant: "default",
        });
      }
    } catch (error) {
      // Errors are already toasted individually, maybe log the aggregate error
      console.error("One or more files failed to process:", error);
    }
  };

  // Remove supporting material - Should work as is, but ensure type safety
  const removeSupportingMaterial = (index: number) => {
    // Use the correct type here
    const materials: SupportingMaterial[] = form.getValues("supportingMaterials");
    const removedFile = materials[index];
    materials.splice(index, 1);
    form.setValue("supportingMaterials", [...materials]); // Spread the modified array

    toast({
      title: "File removed",
      description: `${removedFile.title} has been removed`,
      variant: "default",
    });
  };

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

  // Determine if any file is currently being processed
  const isProcessingFile = parsingTextFile || parsingPdf;

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

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
                          {isProcessingFile && <p className="text-sm text-blue-600 mt-2">Processing file...</p>}

                          {/* Uploaded files preview */}
                          {field.value.length > 0 && (
                            <div className="space-y-3 mt-6">
                              <p className="text-sm text-slate-600 font-medium mb-2">Uploaded files ({field.value.length}/2)</p>
                              {field.value.map((material: SupportingMaterial, index: number) => ( // Use interface here
                                <div key={index} className="flex items-start bg-slate-50 rounded-lg p-4 border border-slate-200">
                                  <div className="text-slate-400 mr-3 mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>
                                  </div>
                                  <div className="flex-1 overflow-hidden">
                                    <div className="text-sm font-medium">{material.title}</div>
                                    <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                                      {/* Display differently based on type */}
                                      {material.contentType.startsWith('text/')
                                        ? material.content.substring(0, 100) + (material.content.length > 100 ? "..." : "")
                                        : `(${material.contentType})` // Indicate it's binary/PDF
                                      }
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSupportingMaterial(index)}
                                    disabled={isProcessingFile}
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
                      disabled={isProcessingFile}
                      className="flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"></path></svg>
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={goToNextStep}
                      disabled={isProcessingFile}
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
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user text-blue-600"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">Persona</h3>
                        <p className="text-slate-600 text-sm">Define the character for this scenario</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-1">
                        <label className="text-slate-600 text-sm font-medium">Choose a persona</label>
                        <Select
                          onValueChange={handlePersonaChange}
                        >
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormField
                          control={form.control}
                          name="persona.name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-600">Name</FormLabel>
                              <FormControl>
                                <Input {...field} className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="persona.role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-600">Role</FormLabel>
                              <FormControl>
                                <Input {...field} className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="persona.disposition"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-600">Disposition</FormLabel>
                              <FormControl>
                                <Input {...field} className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="persona.emotionalState"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-600">Emotional State</FormLabel>
                              <FormControl>
                                <Input {...field} className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="persona.background"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-600">Background</FormLabel>
                            <FormControl>
                              <Textarea
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="persona.communicationStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-600">Communication Style</FormLabel>
                            <FormControl>
                              <Textarea
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
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
                      type="submit"
                      disabled={
                        !form.getValues("persona.name") ||
                        !form.getValues("persona.role") ||
                        !form.getValues("persona.disposition") ||
                        !form.getValues("persona.emotionalState") ||
                        !form.getValues("persona.background") ||
                        !form.getValues("persona.communicationStyle")
                      }
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2"
                    >
                      Generate Template
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>
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
                <p className="text-slate-600 max-w-md mx-auto">Your scenario has been successfully generated and is ready to use. Copy the JSON below or find it saved in your templates.</p>
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
